import { NextRequest, NextResponse } from 'next/server';
import { MORTGAGE_OFFERS } from '@/lib/adapters/offers';
import { compareOffers } from '@/lib/scoring';
import { CURRENT_EURIBOR } from '@/lib/calculations';
import { 
  UserScenario, 
  ScoredOffer, 
  ComparisonContext,
  CompareMortgagesRequest,
  CompareMortgagesResponse,
  MortgageType,
  ComparisonFilter,
} from '@/types/mortgage';

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

    // Filter offers based on basic eligibility
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

      // Check LTV (basic check)
      const ltv = (userScenario.loanAmount / userScenario.propertyDetails.price) * 100;
      if (ltv > offer.maxLtv) {
        return false;
      }

      // Check borrower age at end of term
      const maxAge = Math.max(
        userScenario.borrowerProfile.age,
        userScenario.borrowerProfile.coBorrowerAge ?? 0
      );
      if (maxAge + userScenario.termYears > offer.maxBorrowerAge) {
        return false;
      }

      // Check minimum income requirement
      if (offer.minIncomeRequirement) {
        const totalIncome = 
          userScenario.borrowerProfile.monthlyIncome + 
          (userScenario.borrowerProfile.coBorrowerIncome ?? 0);
        if (totalIncome < offer.minIncomeRequirement) {
          return false;
        }
      }

      // Filter by rate type preference
      if (userScenario.preferences?.rateTypePreference) {
        const pref = userScenario.preferences.rateTypePreference;
        
        if (pref === 'SOLO_FIJA' && offer.mortgageType !== 'FIJA') {
          return false;
        }
        if (pref === 'PREFERENCIA_MIXTA' && offer.mortgageType === 'VARIABLE') {
          // Still include, but deprioritize
        }
        if (pref === 'PREFERENCIA_VARIABLE' && offer.mortgageType === 'FIJA') {
          // Still include, but deprioritize
        }
      }

      return true;
    });

    // If no eligible offers, return informative message
    if (eligibleOffers.length === 0) {
      return NextResponse.json<CompareMortgagesResponse>(
        { 
          success: false, 
          error: 'No se encontraron hipotecas que cumplan con los criterios especificados. Intenta ajustar el importe, plazo o LTV.' 
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

// GET endpoint for fetching available offers (for debugging/info)
export async function GET() {
  return NextResponse.json({
    totalOffers: MORTGAGE_OFFERS.length,
    currentEuribor: CURRENT_EURIBOR,
    offersByType: {
      fixed: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'FIJA').length,
      variable: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'VARIABLE').length,
      mixed: MORTGAGE_OFFERS.filter(o => o.mortgageType === 'MIXTA').length,
    },
    lastUpdated: new Date().toISOString(),
  });
}
