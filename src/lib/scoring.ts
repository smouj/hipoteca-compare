// ============================================
// Mortgage Scoring System
// Composite scoring algorithm with weighted factors
// ============================================

import {
  MortgageOffer,
  UserScenario,
  ScoredOffer,
  ScoreFactor,
  CalculationResult,
  MortgageType,
  RiskTolerance,
  RateTypePreference,
  EmploymentType,
  ConfidenceLevel,
} from '@/types/mortgage';
import {
  calculateMortgage,
  formatCurrency,
  CURRENT_EURIBOR,
} from '@/lib/calculations';
import { BANKS } from '@/lib/adapters/banks';

// ============ SCORING WEIGHTS ============

interface ScoringWeights {
  economicCost: number;      // 40% - Monthly payment, total cost
  flexibility: number;       // 20% - Early repayment, portability
  transparency: number;      // 15% - Clear conditions, no hidden fees
  bankReliability: number;   // 15% - Entity size, reputation
  userFit: number;           // 10% - Matches user preferences
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  economicCost: 0.40,
  flexibility: 0.20,
  transparency: 0.15,
  bankReliability: 0.15,
  userFit: 0.10,
};

// Adjust weights based on user profile
function adjustWeightsForProfile(scenario: UserScenario): ScoringWeights {
  const weights = { ...DEFAULT_WEIGHTS };

  // Higher risk tolerance = less weight on economic cost, more on flexibility
  if (scenario.preferences.riskTolerance === RiskTolerance.HIGH) {
    weights.economicCost = 0.30;
    weights.flexibility = 0.25;
  } else if (scenario.preferences.riskTolerance === RiskTolerance.LOW) {
    weights.economicCost = 0.50;
    weights.flexibility = 0.15;
  }

  // Prioritizing low payment = more weight on economic cost
  if (scenario.preferences.prioritizeLowPayment) {
    weights.economicCost = 0.45;
    weights.userFit = 0.05;
  }

  return weights;
}

// ============ INDIVIDUAL FACTOR SCORING ============

/**
 * Score based on economic cost (monthly payment and total cost)
 */
function scoreEconomicCost(
  calculation: CalculationResult,
  allCalculations: CalculationResult[]
): ScoreFactor {
  const monthlyPayment = calculation.monthlyPayment;
  const totalCost = calculation.totalCost;

  // Find min/max for normalization
  const minPayment = Math.min(...allCalculations.map(c => c.monthlyPayment));
  const maxPayment = Math.max(...allCalculations.map(c => c.monthlyPayment));
  const minCost = Math.min(...allCalculations.map(c => c.totalCost));
  const maxCost = Math.max(...allCalculations.map(c => c.totalCost));

  // Normalize scores (0-100, higher is better for lower values)
  const paymentScore = maxPayment > minPayment
    ? 100 * (1 - (monthlyPayment - minPayment) / (maxPayment - minPayment))
    : 50;

  const costScore = maxCost > minCost
    ? 100 * (1 - (totalCost - minCost) / (maxCost - minCost))
    : 50;

  // Combined score (60% payment, 40% total cost)
  const score = Math.round(paymentScore * 0.6 + costScore * 0.4);

  const details: string[] = [
    `Cuota mensual: ${formatCurrency(monthlyPayment)}`,
    `Coste total: ${formatCurrency(totalCost)}`,
    `TAE: ${calculation.tae.toFixed(2)}%`,
  ];

  // Add scenario info for variable/mixed
  if (calculation.scenarios && calculation.scenarios.length > 1) {
    const adverse = calculation.scenarios[2];
    if (adverse) {
      details.push(`Cuota adverso: ${formatCurrency(adverse.monthlyPayment)}`);
    }
  }

  return {
    id: 'economic_cost',
    name: 'Coste económico',
    score,
    weight: DEFAULT_WEIGHTS.economicCost,
    weightedScore: score * DEFAULT_WEIGHTS.economicCost,
    explanation: score >= 80
      ? 'Excelente coste económico, entre las mejores opciones'
      : score >= 60
      ? 'Buen coste económico, competitivo'
      : score >= 40
      ? 'Coste económico medio'
      : 'Coste económico por debajo de la media',
    details,
  };
}

/**
 * Score based on flexibility (early repayment, portability)
 */
function scoreFlexibility(offer: MortgageOffer): ScoreFactor {
  let score = 50; // Base score
  const details: string[] = [];

  // Early repayment
  if (offer.allowsEarlyRepayment) {
    const freePercent = offer.freeEarlyRepaymentPercent ?? 0;
    if (freePercent >= 25) {
      score += 25;
      details.push(`Amortización anticipada gratis hasta ${freePercent}% anual`);
    } else if (freePercent >= 10) {
      score += 15;
      details.push(`Amortización anticipada gratis hasta ${freePercent}% anual`);
    } else {
      score += 5;
      details.push('Permite amortización anticipada con comisión');
    }
  }

  // Portability
  if (offer.isPortable) {
    score += 15;
    details.push('Hipoteca portable a otra vivienda');
  }

  // Grace period
  if (offer.gracePeriodMonths && offer.gracePeriodMonths > 0) {
    score += 5;
    details.push(`Carencia de ${offer.gracePeriodMonths} meses disponible`);
  }

  // Check early repayment commissions
  const earlyRepayCommission = offer.commissions.find(
    c => c.type === 'AMORTIZACION_ANTICIPADA'
  );
  if (!earlyRepayCommission || earlyRepayCommission.percentage === 0) {
    score += 5;
  } else if (earlyRepayCommission.percentage && earlyRepayCommission.percentage < 0.25) {
    score += 2;
  }

  score = Math.min(100, Math.max(0, score));

  return {
    id: 'flexibility',
    name: 'Flexibilidad',
    score,
    weight: DEFAULT_WEIGHTS.flexibility,
    weightedScore: score * DEFAULT_WEIGHTS.flexibility,
    explanation: score >= 80
      ? 'Excelente flexibilidad, muy adaptable a cambios'
      : score >= 60
      ? 'Buena flexibilidad, condiciones razonables'
      : score >= 40
      ? 'Flexibilidad limitada'
      : 'Baja flexibilidad, condiciones restrictivas',
    details,
  };
}

/**
 * Score based on transparency
 */
function scoreTransparency(offer: MortgageOffer): ScoreFactor {
  let score = 70; // Base score
  const details: string[] = [];

  // Check for opening commission
  const openingCommission = offer.commissions.find(c => c.type === 'APERTURA');
  if (!openingCommission || openingCommission.percentage === 0) {
    score += 15;
    details.push('Sin comisión de apertura');
  } else {
    if (openingCommission.percentage && openingCommission.percentage <= 0.5) {
      score += 5;
      details.push(`Comisión apertura baja: ${openingCommission.percentage}%`);
    } else {
      score -= 10;
      details.push(`Comisión apertura: ${openingCommission.percentage}%`);
    }
  }

  // Confidence level
  if (offer.confidence === ConfidenceLevel.VERIFIED) {
    score += 10;
    details.push('Datos verificados recientemente');
  } else if (offer.confidence === ConfidenceLevel.ESTIMATED) {
    details.push('Datos estimados');
  } else if (offer.confidence === ConfidenceLevel.OUTDATED) {
    score -= 15;
    details.push('Datos desactualizados');
  }

  // Mandatory linked products
  const mandatoryProducts = offer.linkedProducts.filter(p => p.required);
  if (mandatoryProducts.length === 0) {
    score += 5;
    details.push('Sin vinculaciones obligatorias');
  } else if (mandatoryProducts.length <= 2) {
    details.push(`${mandatoryProducts.length} vinculaciones obligatorias`);
  } else {
    score -= 10;
    details.push(`${mandatoryProducts.length} vinculaciones obligatorias`);
  }

  // Clear product URL
  if (offer.productUrl) {
    score += 5;
    details.push('Enlace a condiciones oficiales disponible');
  }

  score = Math.min(100, Math.max(0, score));

  return {
    id: 'transparency',
    name: 'Transparencia',
    score,
    weight: DEFAULT_WEIGHTS.transparency,
    weightedScore: score * DEFAULT_WEIGHTS.transparency,
    explanation: score >= 80
      ? 'Excelente transparencia, condiciones claras'
      : score >= 60
      ? 'Buena transparencia'
      : score >= 40
      ? 'Transparencia mejorable'
      : 'Baja transparencia, revisar condiciones con detalle',
    details,
  };
}

/**
 * Score based on bank reliability
 */
function scoreBankReliability(bankId: string): ScoreFactor {
  const bank = BANKS.find(b => b.id === bankId);
  
  if (!bank) {
    return {
      id: 'bank_reliability',
      name: 'Solidez de la entidad',
      score: 50,
      weight: DEFAULT_WEIGHTS.bankReliability,
      weightedScore: 50 * DEFAULT_WEIGHTS.bankReliability,
      explanation: 'Información de la entidad no disponible',
      details: ['Entidad no identificada'],
    };
  }

  let score = 50;
  const details: string[] = [];

  // Assets size (larger = more stable)
  if (bank.assetsSize >= 500000) { // >500B €
    score += 25;
    details.push('Banco grande, alta solidez financiera');
  } else if (bank.assetsSize >= 100000) { // >100B €
    score += 15;
    details.push('Banco mediano-grande');
  } else if (bank.assetsSize >= 10000) { // >10B €
    score += 10;
    details.push('Banco mediano');
  } else {
    score += 5;
    details.push('Banco pequeño o especializado');
  }

  // Office network
  if (bank.officeCount && bank.officeCount > 2000) {
    score += 10;
    details.push(`Amplia red de oficinas (${bank.officeCount})`);
  } else if (bank.officeCount && bank.officeCount > 500) {
    score += 5;
    details.push(`Buena red de oficinas (${bank.officeCount})`);
  } else if (bank.isOnlineOnly) {
    details.push('Banco 100% online');
  }

  // Credit rating
  if (bank.creditRating) {
    const ratingUpper = bank.creditRating.toUpperCase();
    if (ratingUpper.startsWith('AA') || ratingUpper.startsWith('AAA')) {
      score += 15;
      details.push(`Rating excelente: ${bank.creditRating}`);
    } else if (ratingUpper.startsWith('A')) {
      score += 10;
      details.push(`Rating bueno: ${bank.creditRating}`);
    } else if (ratingUpper.startsWith('BBB')) {
      score += 5;
      details.push(`Rating aceptable: ${bank.creditRating}`);
    }
  }

  score = Math.min(100, Math.max(0, score));

  return {
    id: 'bank_reliability',
    name: 'Solidez de la entidad',
    score,
    weight: DEFAULT_WEIGHTS.bankReliability,
    weightedScore: score * DEFAULT_WEIGHTS.bankReliability,
    explanation: score >= 80
      ? 'Entidad muy sólida y fiable'
      : score >= 60
      ? 'Entidad fiable y establecida'
      : score >= 40
      ? 'Entidad con solidez media'
      : 'Entidad pequeña o con menor solidez',
    details,
  };
}

/**
 * Score based on user fit (preferences match)
 */
function scoreUserFit(offer: MortgageOffer, scenario: UserScenario): ScoreFactor {
  let score = 50;
  const details: string[] = [];
  const prefs = scenario.preferences;

  // Rate type preference
  const preferredTypes: MortgageType[] = [];
  if (prefs.rateTypePreference === RateTypePreference.FIXED_ONLY) {
    preferredTypes.push(MortgageType.FIJA);
  } else if (prefs.rateTypePreference === RateTypePreference.MIXED_PREFERRED) {
    preferredTypes.push(MortgageType.MIXTA, MortgageType.FIJA);
  } else if (prefs.rateTypePreference === RateTypePreference.VARIABLE_PREFERRED) {
    preferredTypes.push(MortgageType.VARIABLE, MortgageType.MIXTA);
  } else {
    preferredTypes.push(MortgageType.FIJA, MortgageType.MIXTA, MortgageType.VARIABLE);
  }

  if (preferredTypes.includes(offer.mortgageType)) {
    score += 20;
    details.push('Tipo de interés acorde a preferencias');
  } else {
    score -= 10;
    details.push('Tipo de interés diferente a preferencias');
  }

  // Risk tolerance
  if (prefs.riskTolerance === RiskTolerance.LOW && offer.mortgageType === MortgageType.FIJA) {
    score += 15;
    details.push('Ideal para perfil conservador');
  } else if (prefs.riskTolerance === RiskTolerance.HIGH && 
             (offer.mortgageType === MortgageType.VARIABLE || offer.mortgageType === MortgageType.MIXTA)) {
    score += 15;
    details.push('Adecuado para perfil con mayor tolerancia al riesgo');
  }

  // Linked products acceptance
  const mandatoryProducts = offer.linkedProducts.filter(p => p.required);
  if (mandatoryProducts.length === 0 && !prefs.acceptLinkedProducts) {
    score += 10;
    details.push('Sin vinculaciones obligatorias (acorde a preferencias)');
  } else if (mandatoryProducts.length > 0 && prefs.acceptLinkedProducts) {
    // Check if user already has some of the required products
    const alreadyHasProducts = mandatoryProducts.filter(
      p => prefs.existingProducts.includes(p.type)
    );
    if (alreadyHasProducts.length > 0) {
      score += 10;
      details.push(`Ya tienes ${alreadyHasProducts.length} de las vinculaciones requeridas`);
    }
  } else if (mandatoryProducts.length > 0 && !prefs.acceptLinkedProducts) {
    score -= 10;
    details.push('Requiere vinculaciones que preferirías evitar');
  }

  // Term preferences
  if (scenario.termYears <= offer.maxTermYears) {
    score += 5;
  }

  // Employment type considerations
  const employment = scenario.borrowerProfile.employmentType;
  if (employment === EmploymentType.SELF_EMPLOYED || employment === EmploymentType.TEMPORARY_CONTRACT) {
    // Variable mortgages might be riskier for irregular income
    if (offer.mortgageType === MortgageType.FIJA && prefs.riskTolerance === RiskTolerance.LOW) {
      score += 5;
      details.push('Fija recomendada para ingresos variables');
    }
  }

  score = Math.min(100, Math.max(0, score));

  return {
    id: 'user_fit',
    name: 'Ajuste a tu perfil',
    score,
    weight: DEFAULT_WEIGHTS.userFit,
    weightedScore: score * DEFAULT_WEIGHTS.userFit,
    explanation: score >= 80
      ? 'Excelente ajuste a tus necesidades y preferencias'
      : score >= 60
      ? 'Buen ajuste a tu perfil'
      : score >= 40
      ? 'Ajuste moderado a tu perfil'
      : 'Poco ajustado a tus preferencias',
    details,
  };
}

// ============ MAIN SCORING FUNCTION ============

/**
 * Scores a mortgage offer based on user scenario
 */
export function scoreOffer(
  offer: MortgageOffer,
  scenario: UserScenario,
  allCalculations: CalculationResult[],
  calculation: CalculationResult
): ScoredOffer {
  const weights = adjustWeightsForProfile(scenario);

  // Calculate individual factor scores
  const economicCostScore = scoreEconomicCost(calculation, allCalculations);
  const flexibilityScore = scoreFlexibility(offer);
  const transparencyScore = scoreTransparency(offer);
  const reliabilityScore = scoreBankReliability(offer.bankId);
  const userFitScore = scoreUserFit(offer, scenario);

  // Apply adjusted weights
  economicCostScore.weight = weights.economicCost;
  economicCostScore.weightedScore = economicCostScore.score * weights.economicCost;
  flexibilityScore.weight = weights.flexibility;
  flexibilityScore.weightedScore = flexibilityScore.score * weights.flexibility;
  transparencyScore.weight = weights.transparency;
  transparencyScore.weightedScore = transparencyScore.score * weights.transparency;
  reliabilityScore.weight = weights.bankReliability;
  reliabilityScore.weightedScore = reliabilityScore.score * weights.bankReliability;
  userFitScore.weight = weights.userFit;
  userFitScore.weightedScore = userFitScore.score * weights.userFit;

  const scoreFactors: ScoreFactor[] = [
    economicCostScore,
    flexibilityScore,
    transparencyScore,
    reliabilityScore,
    userFitScore,
  ];

  // Calculate total score
  const totalScore = Math.round(
    scoreFactors.reduce((sum, factor) => sum + factor.weightedScore, 0)
  );

  // Generate pros and cons
  const { pros, cons } = generateProsCons(offer, scenario, calculation, scoreFactors);

  // Generate recommendation
  const recommendation = generateRecommendation(offer, scenario, totalScore);

  // Generate alerts
  const alerts = generateAlerts(offer, scenario, calculation);

  return {
    offer,
    calculation,
    totalScore,
    scoreFactors,
    pros,
    cons,
    recommendation,
    alerts,
  };
}

/**
 * Generate pros and cons based on analysis
 */
function generateProsCons(
  offer: MortgageOffer,
  scenario: UserScenario,
  calculation: CalculationResult,
  factors: ScoreFactor[]
): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];

  // From scoring factors
  factors.forEach(factor => {
    if (factor.score >= 70) {
      pros.push(...(factor.details?.filter(() => factor.score >= 70) ?? []));
    } else if (factor.score < 40) {
      cons.push(...(factor.details?.filter(() => factor.score < 40) ?? []));
    }
  });

  // Specific conditions

  // Fixed rate stability
  if (offer.mortgageType === MortgageType.FIJA) {
    pros.push('Cuota estable durante toda la vida del préstamo');
    if (scenario.preferences.riskTolerance === RiskTolerance.LOW) {
      pros.push('Ideal para tu perfil conservador');
    }
  }

  // Variable rate potential savings
  if (offer.mortgageType === MortgageType.VARIABLE) {
    if (CURRENT_EURIBOR < 2) {
      pros.push('Potencial ahorro con Euríbor bajo');
    }
    cons.push('Cuota variable según Euríbor');
    if (scenario.preferences.riskTolerance === RiskTolerance.LOW) {
      cons.push('Riesgo de subida de cuota si sube el Euríbor');
    }
  }

  // Mixed rate benefits
  if (offer.mortgageType === MortgageType.MIXTA) {
    pros.push(`Estabilidad los primeros ${offer.rateCondition.fixedPeriodYears ?? 10} años`);
    pros.push('Posibilidad de refinanciación en el periodo variable');
  }

  // No opening commission
  const openingCommission = offer.commissions.find(c => c.type === 'APERTURA');
  if (!openingCommission || openingCommission.percentage === 0) {
    pros.push('Sin comisión de apertura');
  }

  // Portability
  if (offer.isPortable) {
    pros.push('Portable a otra vivienda');
  }

  // High LTV
  if (offer.maxLtv >= 90) {
    pros.push('Financiación hasta el 90%');
  } else if (offer.maxLtv >= 80) {
    pros.push('Financiación hasta el 80%');
  }

  // Debt-to-income ratio
  if (calculation.debtToIncomeRatio > 35) {
    cons.push(`Endeudamiento alto: ${calculation.debtToIncomeRatio.toFixed(1)}%`);
  }

  // Scenarios for variable
  if (calculation.scenarios && calculation.scenarios.length > 1) {
    const adverse = calculation.scenarios[2];
    const base = calculation.scenarios[0];
    if (adverse && base) {
      const increase = ((adverse.monthlyPayment - base.monthlyPayment) / base.monthlyPayment) * 100;
      if (increase > 30) {
        cons.push(`Cuota podría subir +${increase.toFixed(0)}% en escenario adverso`);
      }
    }
  }

  return {
    pros: [...new Set(pros)].slice(0, 5),
    cons: [...new Set(cons)].slice(0, 5),
  };
}

/**
 * Generate personalized recommendation
 */
function generateRecommendation(
  offer: MortgageOffer,
  scenario: UserScenario,
  totalScore: number
): string {
  const bank = BANKS.find(b => b.id === offer.bankId);
  const bankName = bank?.name ?? 'El banco';

  if (totalScore >= 80) {
    return `${bankName} ${offer.productName} es una excelente opción para tu perfil. Ofrece un equilibrio óptimo entre coste, flexibilidad y seguridad.`;
  } else if (totalScore >= 70) {
    return `${bankName} ${offer.productName} es una buena opción. Considera comparar con otras ofertas antes de decidir.`;
  } else if (totalScore >= 60) {
    return `${bankName} ${offer.productName} es una opción aceptable. Hay aspectos que podrían no ajustarse completamente a tus necesidades.`;
  } else {
    return `${bankName} ${offer.productName} tiene limitaciones significativas para tu perfil. Considera otras opciones.`;
  }
}

/**
 * Generate alerts for the offer
 */
function generateAlerts(
  offer: MortgageOffer,
  scenario: UserScenario,
  calculation: CalculationResult
): string[] {
  const alerts: string[] = [];

  // Confidence level alerts
  if (offer.confidence === ConfidenceLevel.OUTDATED) {
    alerts.push('Los datos de esta oferta pueden estar desactualizados. Verifica con el banco.');
  } else if (offer.confidence === ConfidenceLevel.ESTIMATED) {
    alerts.push('Las condiciones son estimadas. Confirma con el banco antes de decidir.');
  }

  // High debt ratio
  if (calculation.debtToIncomeRatio > 40) {
    alerts.push('Tu ratio de endeudamiento supera el 40%. Considera reducir el importe solicitado.');
  }

  // High LTV
  if (calculation.ltv > 80) {
    alerts.push('Financiación superior al 80% requiere seguro de impago adicional.');
  }

  // Mandatory products
  const mandatoryProducts = offer.linkedProducts.filter(p => p.required);
  if (mandatoryProducts.length > 3) {
    alerts.push(`Requiere ${mandatoryProducts.length} productos vinculados. Evalúa el coste real.`);
  }

  // Variable rate with low risk tolerance
  if ((offer.mortgageType === MortgageType.VARIABLE || offer.mortgageType === MortgageType.MIXTA) &&
      scenario.preferences.riskTolerance === RiskTolerance.LOW) {
    alerts.push('Hipoteca variable/mixta con tu perfil conservador. Considera una fija para mayor estabilidad.');
  }

  // Adverse scenario impact
  if (calculation.scenarios && calculation.scenarios.length > 1) {
    const adverse = calculation.scenarios[2];
    const base = calculation.scenarios[0];
    if (adverse && base && adverse.monthlyPayment > base.monthlyPayment * 1.4) {
      alerts.push('En escenario adverso, la cuota podría aumentar más del 40%.');
    }
  }

  return alerts;
}

/**
 * Compare and rank all eligible offers
 */
export function compareOffers(
  offers: MortgageOffer[],
  scenario: UserScenario
): ScoredOffer[] {
  // Calculate all mortgages first (needed for relative scoring)
  const calculations = offers.map(offer => calculateMortgage(offer, scenario));

  // Score each offer
  const scoredOffers = offers.map((offer, index) =>
    scoreOffer(offer, scenario, calculations, calculations[index]!)
  );

  // Sort by total score (descending)
  scoredOffers.sort((a, b) => b.totalScore - a.totalScore);

  // Mark the best option
  if (scoredOffers.length > 0) {
    scoredOffers[0]!.isBestOption = true;
  }

  return scoredOffers;
}
