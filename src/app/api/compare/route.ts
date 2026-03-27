import { NextRequest, NextResponse } from 'next/server';
import { MORTGAGE_OFFERS } from '@/lib/adapters/offers';
import { compareOffers } from '@/lib/scoring';
import { CURRENT_EURIBOR, formatCurrency } from '@/lib/calculations';
import { 
  UserScenario, 
  ScoredOffer, 
  ComparisonContext,
  CompareMortgagesRequest,
  CompareMortgagesResponse,
  ComparisonFilter,
} from '@/types/mortgage';

// ============ INTERFACES FOR DIAGNOSTICS ============

interface RejectionReason {
  count: number;
  reason: string;
  suggestion?: string;
}

interface DiagnosticResult {
  totalOffers: number;
  eligibleOffers: number;
  rejections: RejectionReason[];
  primaryIssue: string | null;
  suggestions: string[];
}

/**
 * Analyzes why offers were rejected and returns diagnostic information
 */
function analyzeRejections(
  scenario: UserScenario,
  offers: typeof MORTGAGE_OFFERS
): DiagnosticResult {
  const rejections: RejectionReason[] = [];
  let eligibleCount = 0;

  // Count rejections by reason
  const rejectionCounts = {
    loanAmountTooLow: 0,
    loanAmountTooHigh: 0,
    termTooLong: 0,
    ltvTooHigh: 0,
    ageAtEndTooHigh: 0,
    incomeTooLow: 0,
    rateTypeMismatch: 0,
  };

  // Handle multiple borrowers
  const borrowers = scenario.borrowerProfile.borrowers || [];
  const ltv = (scenario.loanAmount / scenario.propertyDetails.price) * 100;
  const maxAge = borrowers.length > 0
    ? Math.max(...borrowers.map(b => b.age))
    : Math.max(
        scenario.borrowerProfile.age,
        scenario.borrowerProfile.coBorrowerAge ?? 0
      );
  const totalIncome = borrowers.length > 0
    ? borrowers.reduce((sum, b) => sum + b.monthlyNetIncome + (b.additionalMonthlyIncome || 0), 0)
    : scenario.borrowerProfile.monthlyIncome + 
      (scenario.borrowerProfile.coBorrowerIncome ?? 0);

  for (const offer of offers) {
    let isEligible = true;

    // Check loan amount range
    if (scenario.loanAmount < offer.minLoanAmount) {
      rejectionCounts.loanAmountTooLow++;
      isEligible = false;
    }
    if (scenario.loanAmount > offer.maxLoanAmount) {
      rejectionCounts.loanAmountTooHigh++;
      isEligible = false;
    }

    // Check term
    if (scenario.termYears > offer.maxTermYears) {
      rejectionCounts.termTooLong++;
      isEligible = false;
    }

    // Check LTV
    if (ltv > offer.maxLtv) {
      rejectionCounts.ltvTooHigh++;
      isEligible = false;
    }

    // Check borrower age at end of term
    if (maxAge + scenario.termYears > offer.maxBorrowerAge) {
      rejectionCounts.ageAtEndTooHigh++;
      isEligible = false;
    }

    // Check minimum income requirement
    if (offer.minIncomeRequirement && totalIncome < offer.minIncomeRequirement) {
      rejectionCounts.incomeTooLow++;
      isEligible = false;
    }

    // Check rate type preference
    if (scenario.preferences?.rateTypePreference) {
      const pref = scenario.preferences.rateTypePreference;
      if (pref === 'SOLO_FIJA' && offer.mortgageType !== 'FIJA') {
        rejectionCounts.rateTypeMismatch++;
        isEligible = false;
      }
    }

    if (isEligible) {
      eligibleCount++;
    }
  }

  // Build rejection reasons array with suggestions
  if (rejectionCounts.loanAmountTooLow > 0) {
    const minRequired = Math.min(...offers.map(o => o.minLoanAmount));
    rejections.push({
      count: rejectionCounts.loanAmountTooLow,
      reason: `Importe demasiado bajo (mínimo ${formatCurrency(minRequired)})`,
      suggestion: `Aumenta el importe del préstamo a al menos ${formatCurrency(minRequired)}`,
    });
  }

  if (rejectionCounts.loanAmountTooHigh > 0) {
    const maxAllowed = Math.max(...offers.map(o => o.maxLoanAmount));
    rejections.push({
      count: rejectionCounts.loanAmountTooHigh,
      reason: `Importe demasiado alto (máximo ${formatCurrency(maxAllowed)})`,
      suggestion: `Reduce el importe del préstamo o busca financiación privada`,
    });
  }

  if (rejectionCounts.termTooLong > 0) {
    const maxTerm = Math.max(...offers.map(o => o.maxTermYears));
    rejections.push({
      count: rejectionCounts.termTooLong,
      reason: `Plazo demasiado largo (máximo ${maxTerm} años)`,
      suggestion: `Reduce el plazo a ${maxTerm} años o menos`,
    });
  }

  if (rejectionCounts.ltvTooHigh > 0) {
    rejections.push({
      count: rejectionCounts.ltvTooHigh,
      reason: `LTV demasiado alto (${ltv.toFixed(1)}% > 80%)`,
      suggestion: `Aumenta la entrada para reducir la financiación al 80% o menos`,
    });
  }

  if (rejectionCounts.ageAtEndTooHigh > 0) {
    const maxAgeEnd = Math.min(...offers.map(o => o.maxBorrowerAge));
    rejections.push({
      count: rejectionCounts.ageAtEndTooHigh,
      reason: `Edad al finalizar demasiado alta (máximo ${maxAgeEnd} años)`,
      suggestion: `Reduce el plazo o incluye un titular más joven`,
    });
  }

  if (rejectionCounts.incomeTooLow > 0) {
    rejections.push({
      count: rejectionCounts.incomeTooLow,
      reason: `Ingresos insuficientes para algunas ofertas`,
      suggestion: `Considera añadir un cotitular con ingresos o reducir el importe`,
    });
  }

  if (rejectionCounts.rateTypeMismatch > 0) {
    rejections.push({
      count: rejectionCounts.rateTypeMismatch,
      reason: `Preferencia de tipo restrictiva`,
      suggestion: `Considera permitir otros tipos de hipoteca (variable o mixta)`,
    });
  }

  // Sort by count (most common first)
  rejections.sort((a, b) => b.count - a.count);

  // Determine primary issue
  let primaryIssue: string | null = null;
  const suggestions: string[] = [];

  if (rejections.length > 0) {
    primaryIssue = rejections[0]!.reason;
    rejections.forEach(r => {
      if (r.suggestion) {
        suggestions.push(r.suggestion);
      }
    });
  }

  return {
    totalOffers: offers.length,
    eligibleOffers: eligibleCount,
    rejections,
    primaryIssue,
    suggestions,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CompareMortgagesRequest;
    const { userScenario } = body;

    // Validate request
    if (!userScenario) {
      return NextResponse.json<CompareMortgagesResponse>(
        { 
          success: false, 
          error: 'Se requiere el escenario del usuario' 
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const validationErrors: string[] = [];
    
    if (!userScenario.loanAmount || userScenario.loanAmount <= 0) {
      validationErrors.push('El importe del préstamo es requerido');
    }
    
    if (!userScenario.termYears || userScenario.termYears <= 0) {
      validationErrors.push('El plazo del préstamo es requerido');
    }
    
    if (!userScenario.propertyDetails?.price || userScenario.propertyDetails.price <= 0) {
      validationErrors.push('El precio de la propiedad es requerido');
    }
    
    if (!userScenario.borrowerProfile?.monthlyIncome || userScenario.borrowerProfile.monthlyIncome <= 0) {
      validationErrors.push('Los ingresos mensuales son requeridos');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json<CompareMortgagesResponse>(
        { 
          success: false, 
          error: `Errores de validación: ${validationErrors.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Calculate LTV for filtering
    const ltv = (userScenario.loanAmount / userScenario.propertyDetails.price) * 100;
    
    // Handle multiple borrowers
    const borrowers = userScenario.borrowerProfile.borrowers || [];
    const maxAge = borrowers.length > 0
      ? Math.max(...borrowers.map(b => b.age))
      : Math.max(
          userScenario.borrowerProfile.age,
          userScenario.borrowerProfile.coBorrowerAge ?? 0
        );
    const totalIncome = borrowers.length > 0
      ? borrowers.reduce((sum, b) => sum + b.monthlyNetIncome + (b.additionalMonthlyIncome || 0), 0)
      : userScenario.borrowerProfile.monthlyIncome + 
        (userScenario.borrowerProfile.coBorrowerIncome ?? 0);

    // Filter offers based on eligibility criteria
    const eligibleOffers = MORTGAGE_OFFERS.filter(offer => {
      // Check loan amount range
      if (userScenario.loanAmount < offer.minLoanAmount || 
          userScenario.loanAmount > offer.maxLoanAmount) {
        return false;
      }

      // Check term
      if (userScenario.termYears > offer.maxTermYears) {
        return false;
      }

      // Check LTV
      if (ltv > offer.maxLtv) {
        return false;
      }

      // Check borrower age at end of term
      if (maxAge + userScenario.termYears > offer.maxBorrowerAge) {
        return false;
      }

      // Check minimum income requirement
      if (offer.minIncomeRequirement && totalIncome < offer.minIncomeRequirement) {
        return false;
      }

      // Filter by rate type preference
      if (userScenario.preferences?.rateTypePreference) {
        const pref = userScenario.preferences.rateTypePreference;
        if (pref === 'SOLO_FIJA' && offer.mortgageType !== 'FIJA') {
          return false;
        }
      }

      return true;
    });

    // If no eligible offers, provide detailed diagnostic
    if (eligibleOffers.length === 0) {
      const diagnostic = analyzeRejections(userScenario, MORTGAGE_OFFERS);
      
      // Build informative error message
      let errorMessage = 'No se encontraron hipotecas compatibles con tu perfil.\n\n';
      
      if (diagnostic.primaryIssue) {
        errorMessage += `**Principal motivo:** ${diagnostic.primaryIssue}\n\n`;
      }

      if (diagnostic.suggestions.length > 0) {
        errorMessage += '**Sugerencias:**\n';
        diagnostic.suggestions.slice(0, 3).forEach((s, i) => {
          errorMessage += `${i + 1}. ${s}\n`;
        });
      }

      // Add diagnostic details for transparency
      errorMessage += `\n*Análisis: de ${diagnostic.totalOffers} ofertas, `;
      errorMessage += `${diagnostic.rejections.map(r => `${r.count} por ${r.reason.toLowerCase()}`).join(', ')}.*`;

      return NextResponse.json<CompareMortgagesResponse>(
        { 
          success: false, 
          error: errorMessage,
        },
        { status: 200 }
      );
    }

    // Compare and score offers
    const scoredOffers = compareOffers(eligibleOffers, userScenario);

    // Build comparison context
    const comparisonContext: ComparisonContext = {
      userScenario,
      currentEuribor: CURRENT_EURIBOR,
      comparisonDate: new Date().toISOString(),
      scoredOffers,
      activeFilters: {} as ComparisonFilter,
    };

    return NextResponse.json<CompareMortgagesResponse>(
      {
        success: true,
        data: {
          scoredOffers,
          comparisonContext,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error comparing mortgages:', error);
    
    return NextResponse.json<CompareMortgagesResponse>(
      { 
        success: false, 
        error: 'Error interno al procesar la comparativa. Por favor, inténtalo de nuevo.' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching available offers info and constraints
export async function GET() {
  // Calculate constraints from the offers dataset
  const minLoanAmount = Math.min(...MORTGAGE_OFFERS.map(o => o.minLoanAmount));
  const maxLoanAmount = Math.max(...MORTGAGE_OFFERS.map(o => o.maxLoanAmount));
  const maxTermYears = Math.max(...MORTGAGE_OFFERS.map(o => o.maxTermYears));
  const maxLtv = Math.max(...MORTGAGE_OFFERS.map(o => o.maxLtv));
  const maxBorrowerAge = Math.min(...MORTGAGE_OFFERS.map(o => o.maxBorrowerAge));
  const minIncomeRequirements = MORTGAGE_OFFERS
    .filter(o => o.minIncomeRequirement)
    .map(o => o.minIncomeRequirement!);
  const minIncomeRequired = minIncomeRequirements.length > 0 
    ? Math.min(...minIncomeRequirements) 
    : 0;

  return NextResponse.json({
    totalOffers: MORTGAGE_OFFERS.length,
    currentEuribor: CURRENT_EURIBOR,
    offersByType: {
      fixed: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'FIJA').length,
      variable: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'VARIABLE').length,
      mixed: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'MIXTA').length,
    },
    constraints: {
      minLoanAmount,
      maxLoanAmount,
      maxTermYears,
      maxLtv,
      maxBorrowerAge,
      minIncomeRequired,
    },
    lastUpdated: new Date().toISOString(),
  });
}
