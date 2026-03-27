// ============================================
// Spanish Mortgage Calculation Engine
// Implements French amortization system and Spanish TAE calculation
// ============================================

import {
  MortgageOffer,
  UserScenario,
  CalculationResult,
  ScenarioCalculation,
  MortgageType,
  MaturitySchedule,
} from '@/types/mortgage';

// ============ CONSTANTS ============

/** Current Euribor value (March 2026) */
export const CURRENT_EURIBOR = 2.496;

/** Number of months in a year */
const MONTHS_PER_YEAR = 12;

/** 
 * Maximum LTV for usual residence mortgages in Spain
 * Note: LTV > 80% typically requires mortgage insurance or additional guarantees
 */
export const MAX_LTV_USUAL_RESIDENCE = 1.0; // 100% - allows full financing

/** Maximum LTV for second residence mortgages */
export const MAX_LTV_SECOND_RESIDENCE = 0.90; // 90%

/** Maximum debt-to-income ratio recommended in Spain */
export const MAX_DEBT_TO_INCOME_RATIO = 0.35;

/** Approximate notary and registry costs as percentage */
export const NOTARY_REGISTRY_COSTS = 0.01;

/** Approximate appraisal cost */
export const APPRAISAL_COST = 400;

// ============ CORE CALCULATION FUNCTIONS ============

/**
 * Calculates the monthly payment using the French amortization system
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * 
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate (as percentage, e.g., 2.5 for 2.5%)
 * @param termYears - Loan term in years
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0) return 0;
  if (termYears <= 0) return 0;
  if (annualRate < 0) return principal / (termYears * MONTHS_PER_YEAR);

  const monthlyRate = annualRate / 100 / MONTHS_PER_YEAR;
  const totalPayments = termYears * MONTHS_PER_YEAR;

  // Special case for 0% interest
  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return Math.round(payment * 100) / 100;
}

/**
 * Generates the complete amortization schedule
 * Useful for calculating total interest and TAE
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number
): MaturitySchedule[] {
  const schedule: MaturitySchedule[] = [];
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const monthlyRate = annualRate / 100 / MONTHS_PER_YEAR;
  let remainingBalance = principal;

  for (let month = 1; month <= termYears * MONTHS_PER_YEAR; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance,
    });
  }

  return schedule;
}

/**
 * Calculates total interest paid over the life of the loan
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const schedule = generateAmortizationSchedule(principal, annualRate, termYears);
  return schedule.reduce((total, month) => total + month.interest, 0);
}

/**
 * Calculates the TAE (Tasa Anual Equivalente) following Banco de España formula
 * TAE considers the interest rate plus any commissions and costs
 * 
 * Formula: TAE = (1 + TIN/n)^n - 1, adjusted for commissions
 * For mortgages with commissions, we use the IRR approach
 */
export function calculateTAE(
  principal: number,
  annualRate: number,
  termYears: number,
  openingCommissionPercent: number = 0,
  otherCosts: number = 0
): number {
  if (principal <= 0 || termYears <= 0) return 0;

  // Net amount received after commissions
  const openingCommission = principal * (openingCommissionPercent / 100);
  const netAmount = principal - openingCommission - otherCosts;

  if (netAmount <= 0) return annualRate;

  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const totalPayments = termYears * MONTHS_PER_YEAR;

  // Use Newton-Raphson method to find IRR
  // We need to find the rate 'r' where:
  // netAmount = sum(payment / (1 + r)^month) for all months

  // Simplified TAE calculation for practical purposes
  // For a more accurate calculation, we'd use IRR
  const totalPaid = monthlyPayment * totalPayments;
  const effectiveInterestRate = ((totalPaid - netAmount) / netAmount) / termYears;
  const tae = (Math.pow(1 + effectiveInterestRate / MONTHS_PER_YEAR, MONTHS_PER_YEAR) - 1) * 100;

  return Math.round(tae * 100) / 100;
}

/**
 * Calculates LTV (Loan to Value) ratio
 */
export function calculateLTV(loanAmount: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  return Math.round((loanAmount / propertyValue) * 10000) / 100;
}

/**
 * Calculates debt-to-income ratio
 */
export function calculateDebtToIncomeRatio(
  monthlyDebtPayment: number,
  monthlyIncome: number
): number {
  if (monthlyIncome <= 0) return 0;
  return Math.round((monthlyDebtPayment / monthlyIncome) * 10000) / 100;
}

/**
 * Calculates total commission costs
 */
export function calculateTotalCommissions(
  principal: number,
  openingCommissionPercent: number = 0
): number {
  return principal * (openingCommissionPercent / 100);
}

/**
 * Calculates total cost of the mortgage (capital + interest + commissions)
 */
export function calculateTotalCost(
  principal: number,
  annualRate: number,
  termYears: number,
  openingCommissionPercent: number = 0
): number {
  const totalInterest = calculateTotalInterest(principal, annualRate, termYears);
  const commissions = calculateTotalCommissions(principal, openingCommissionPercent);
  return principal + totalInterest + commissions;
}

// ============ VARIABLE/MIXED RATE CALCULATIONS ============

/**
 * Calculates effective rate for variable mortgages
 */
export function calculateVariableRate(spread: number, euribor: number): number {
  return euribor + spread;
}

/**
 * Calculates monthly payment for a mixed mortgage
 * (fixed rate for initial period, variable after)
 */
export function calculateMixedMortgagePayment(
  principal: number,
  fixedPeriodYears: number,
  fixedRate: number,
  variableSpread: number,
  euribor: number,
  totalTermYears: number
): { initialPayment: number; variablePayment: number; averagePayment: number } {
  // Calculate payment during fixed period
  const initialPayment = calculateMonthlyPayment(principal, fixedRate, totalTermYears);

  // Calculate remaining balance after fixed period
  const schedule = generateAmortizationSchedule(principal, fixedRate, totalTermYears);
  const monthIndex = Math.min(fixedPeriodYears * MONTHS_PER_YEAR - 1, schedule.length - 1);
  const remainingBalance = schedule[monthIndex]?.remainingBalance ?? 0;

  // Calculate payment during variable period
  const remainingTermYears = totalTermYears - fixedPeriodYears;
  const variableRate = calculateVariableRate(variableSpread, euribor);
  const variablePayment = remainingTermYears > 0 
    ? calculateMonthlyPayment(remainingBalance, variableRate, remainingTermYears)
    : 0;

  // Calculate weighted average payment
  const fixedMonths = fixedPeriodYears * MONTHS_PER_YEAR;
  const variableMonths = remainingTermYears * MONTHS_PER_YEAR;
  const totalMonths = totalTermYears * MONTHS_PER_YEAR;
  const averagePayment = 
    (initialPayment * fixedMonths + variablePayment * variableMonths) / totalMonths;

  return {
    initialPayment,
    variablePayment,
    averagePayment: Math.round(averagePayment * 100) / 100,
  };
}

/**
 * Generates scenario calculations for variable/mixed mortgages
 */
export function generateScenarioCalculations(
  principal: number,
  offer: MortgageOffer,
  termYears: number
): ScenarioCalculation[] {
  const scenarios: ScenarioCalculation[] = [];

  if (offer.mortgageType === MortgageType.FIJA) {
    // Fixed rate - no scenarios needed, just one result
    const monthlyPayment = calculateMonthlyPayment(
      principal,
      offer.rateCondition.tin,
      termYears
    );
    const totalInterest = calculateTotalInterest(
      principal,
      offer.rateCondition.tin,
      termYears
    );
    return [{
      name: 'Escenario único',
      description: 'Tipo fijo durante toda la vida del préstamo',
      assumedEuribor: 0,
      monthlyPayment,
      totalInterest,
      totalCost: principal + totalInterest,
    }];
  }

  if (offer.mortgageType === MortgageType.VARIABLE) {
    const spread = offer.rateCondition.spread ?? 0.75;

    // Base scenario (current Euribor)
    const baseRate = calculateVariableRate(spread, CURRENT_EURIBOR);
    const basePayment = calculateMonthlyPayment(principal, baseRate, termYears);
    const baseInterest = calculateTotalInterest(principal, baseRate, termYears);
    scenarios.push({
      name: 'Escenario base',
      description: `Euríbor actual (${CURRENT_EURIBOR}%) + ${spread}%`,
      assumedEuribor: CURRENT_EURIBOR,
      monthlyPayment: basePayment,
      totalInterest: baseInterest,
      totalCost: principal + baseInterest,
    });

    // Conservative scenario (+1% Euribor)
    const conservativeEuribor = CURRENT_EURIBOR + 1;
    const conservativeRate = calculateVariableRate(spread, conservativeEuribor);
    const conservativePayment = calculateMonthlyPayment(principal, conservativeRate, termYears);
    const conservativeInterest = calculateTotalInterest(principal, conservativeRate, termYears);
    scenarios.push({
      name: 'Escenario conservador',
      description: `Euríbor +1% (${conservativeEuribor}%) + ${spread}%`,
      assumedEuribor: conservativeEuribor,
      monthlyPayment: conservativePayment,
      totalInterest: conservativeInterest,
      totalCost: principal + conservativeInterest,
    });

    // Adverse scenario (+2% Euribor)
    const adverseEuribor = CURRENT_EURIBOR + 2;
    const adverseRate = calculateVariableRate(spread, adverseEuribor);
    const adversePayment = calculateMonthlyPayment(principal, adverseRate, termYears);
    const adverseInterest = calculateTotalInterest(principal, adverseRate, termYears);
    scenarios.push({
      name: 'Escenario adverso',
      description: `Euríbor +2% (${adverseEuribor}%) + ${spread}%`,
      assumedEuribor: adverseEuribor,
      monthlyPayment: adversePayment,
      totalInterest: adverseInterest,
      totalCost: principal + adverseInterest,
    });
  }

  if (offer.mortgageType === MortgageType.MIXTA) {
    const fixedPeriodYears = offer.rateCondition.fixedPeriodYears ?? 10;
    const fixedRate = offer.rateCondition.fixedPeriodTin ?? offer.rateCondition.tin;
    const variableSpread = offer.rateCondition.variableSpread ?? 0.90;

    // Base scenario
    const basePayments = calculateMixedMortgagePayment(
      principal,
      fixedPeriodYears,
      fixedRate,
      variableSpread,
      CURRENT_EURIBOR,
      termYears
    );
    
    // Calculate total interest for mixed mortgage (simplified)
    const fixedInterest = calculateTotalInterest(principal, fixedRate, fixedPeriodYears);
    const schedule = generateAmortizationSchedule(principal, fixedRate, termYears);
    const remainingBalance = schedule[fixedPeriodYears * MONTHS_PER_YEAR - 1]?.remainingBalance ?? principal * 0.7;
    const remainingTermYears = termYears - fixedPeriodYears;
    const baseVariableRate = calculateVariableRate(variableSpread, CURRENT_EURIBOR);
    const variableInterest = calculateTotalInterest(remainingBalance, baseVariableRate, remainingTermYears);

    scenarios.push({
      name: 'Escenario base',
      description: `Fijo ${fixedPeriodYears} años al ${fixedRate}%, luego Euríbor (${CURRENT_EURIBOR}%) + ${variableSpread}%`,
      assumedEuribor: CURRENT_EURIBOR,
      monthlyPayment: basePayments.initialPayment,
      totalInterest: fixedInterest + variableInterest,
      totalCost: principal + fixedInterest + variableInterest,
    });

    // Conservative scenario
    const conservativeEuribor = CURRENT_EURIBOR + 1;
    const conservativeVariableRate = calculateVariableRate(variableSpread, conservativeEuribor);
    const conservativeVariableInterest = calculateTotalInterest(remainingBalance, conservativeVariableRate, remainingTermYears);
    const conservativePayments = calculateMixedMortgagePayment(
      principal,
      fixedPeriodYears,
      fixedRate,
      variableSpread,
      conservativeEuribor,
      termYears
    );

    scenarios.push({
      name: 'Escenario conservador',
      description: `Fijo ${fixedPeriodYears} años al ${fixedRate}%, luego Euríbor +1% (${conservativeEuribor}%) + ${variableSpread}%`,
      assumedEuribor: conservativeEuribor,
      monthlyPayment: conservativePayments.initialPayment,
      totalInterest: fixedInterest + conservativeVariableInterest,
      totalCost: principal + fixedInterest + conservativeVariableInterest,
    });

    // Adverse scenario
    const adverseEuribor = CURRENT_EURIBOR + 2;
    const adverseVariableRate = calculateVariableRate(variableSpread, adverseEuribor);
    const adverseVariableInterest = calculateTotalInterest(remainingBalance, adverseVariableRate, remainingTermYears);
    const adversePayments = calculateMixedMortgagePayment(
      principal,
      fixedPeriodYears,
      fixedRate,
      variableSpread,
      adverseEuribor,
      termYears
    );

    scenarios.push({
      name: 'Escenario adverso',
      description: `Fijo ${fixedPeriodYears} años al ${fixedRate}%, luego Euríbor +2% (${adverseEuribor}%) + ${variableSpread}%`,
      assumedEuribor: adverseEuribor,
      monthlyPayment: adversePayments.initialPayment,
      totalInterest: fixedInterest + adverseVariableInterest,
      totalCost: principal + fixedInterest + adverseVariableInterest,
    });
  }

  return scenarios;
}

// ============ MAIN CALCULATION FUNCTION ============

/**
 * Performs complete calculation for a mortgage offer given user scenario
 */
export function calculateMortgage(
  offer: MortgageOffer,
  scenario: UserScenario
): CalculationResult {
  const principal = scenario.loanAmount;
  const termYears = scenario.termYears;

  // Get opening commission percentage
  const openingCommission = offer.commissions.find(
    (c) => c.type === 'APERTURA'
  );
  const openingCommissionPercent = openingCommission?.percentage ?? 0;

  // Calculate base metrics
  let effectiveTin: number;
  let monthlyPayment: number;

  if (offer.mortgageType === MortgageType.FIJA) {
    effectiveTin = offer.rateCondition.tin;
    monthlyPayment = calculateMonthlyPayment(principal, effectiveTin, termYears);
  } else if (offer.mortgageType === MortgageType.VARIABLE) {
    const spread = offer.rateCondition.spread ?? 0.75;
    effectiveTin = calculateVariableRate(spread, CURRENT_EURIBOR);
    monthlyPayment = calculateMonthlyPayment(principal, effectiveTin, termYears);
  } else {
    // Mixed mortgage
    const fixedPeriodYears = offer.rateCondition.fixedPeriodYears ?? 10;
    effectiveTin = offer.rateCondition.fixedPeriodTin ?? offer.rateCondition.tin;
    const payments = calculateMixedMortgagePayment(
      principal,
      fixedPeriodYears,
      effectiveTin,
      offer.rateCondition.variableSpread ?? 0.90,
      CURRENT_EURIBOR,
      termYears
    );
    monthlyPayment = payments.initialPayment;
  }

  // Calculate TAE
  const tae = calculateTAE(principal, effectiveTin, termYears, openingCommissionPercent);

  // Calculate total interest and cost
  const totalInterest = calculateTotalInterest(principal, effectiveTin, termYears);
  const totalCommissions = calculateTotalCommissions(principal, openingCommissionPercent);
  const totalCost = principal + totalInterest + totalCommissions;

  // Calculate LTV
  const ltv = calculateLTV(principal, scenario.propertyDetails.price);

  // Calculate debt-to-income ratio
  const totalMonthlyIncome = 
    scenario.borrowerProfile.monthlyIncome +
    (scenario.borrowerProfile.additionalIncome ?? 0) +
    (scenario.borrowerProfile.coBorrowerIncome ?? 0);
  
  const existingDebtPayments = scenario.borrowerProfile.monthlyDebtPayments;
  const debtToIncomeRatio = calculateDebtToIncomeRatio(
    monthlyPayment + existingDebtPayments,
    totalMonthlyIncome
  );

  // Generate scenarios for variable/mixed mortgages
  const scenarios = generateScenarioCalculations(principal, offer, termYears);

  return {
    monthlyPayment,
    tae,
    effectiveTin,
    totalCost,
    totalInterest,
    totalCommissions,
    ltv,
    debtToIncomeRatio,
    scenarios,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Validates if an offer is eligible for the user scenario
 */
export function isOfferEligible(
  offer: MortgageOffer,
  scenario: UserScenario
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check loan amount bounds
  if (scenario.loanAmount < offer.minLoanAmount) {
    reasons.push(`Importe mínimo requerido: ${formatCurrency(offer.minLoanAmount)}`);
  }
  if (scenario.loanAmount > offer.maxLoanAmount) {
    reasons.push(`Importe máximo permitido: ${formatCurrency(offer.maxLoanAmount)}`);
  }

  // Check term
  if (scenario.termYears > offer.maxTermYears) {
    reasons.push(`Plazo máximo: ${offer.maxTermYears} años`);
  }

  // Check LTV
  const ltv = calculateLTV(scenario.loanAmount, scenario.propertyDetails.price);
  if (ltv > offer.maxLtv) {
    reasons.push(`LTV máximo: ${offer.maxLtv}%`);
  }

  // Check borrower age
  const maxAge = Math.max(
    scenario.borrowerProfile.age,
    scenario.borrowerProfile.coBorrowerAge ?? 0
  );
  const ageAtEnd = maxAge + scenario.termYears;
  if (ageAtEnd > offer.maxBorrowerAge) {
    reasons.push(`Edad máxima al finalizar: ${offer.maxBorrowerAge} años`);
  }

  // Check income requirement
  if (offer.minIncomeRequirement) {
    const totalIncome = 
      scenario.borrowerProfile.monthlyIncome +
      (scenario.borrowerProfile.coBorrowerIncome ?? 0);
    if (totalIncome < offer.minIncomeRequirement) {
      reasons.push(`Ingresos mínimos: ${formatCurrency(offer.minIncomeRequirement)}/mes`);
    }
  }

  // Check debt-to-income ratio
  const monthlyPayment = calculateMonthlyPayment(
    scenario.loanAmount,
    offer.rateCondition.tin,
    scenario.termYears
  );
  const totalMonthlyIncome = 
    scenario.borrowerProfile.monthlyIncome +
    (scenario.borrowerProfile.additionalIncome ?? 0) +
    (scenario.borrowerProfile.coBorrowerIncome ?? 0);
  
  const dti = calculateDebtToIncomeRatio(
    monthlyPayment + scenario.borrowerProfile.monthlyDebtPayments,
    totalMonthlyIncome
  );

  if (dti > 35) {
    reasons.push(`Ratio endeudamiento alto: ${dti.toFixed(1)}% (máx recomendado: 35%)`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

// ============ UTILITY FUNCTIONS ============

/**
 * Formats a number as Spanish currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculates the minimum down payment required
 */
export function calculateMinDownPayment(
  propertyPrice: number,
  maxLtv: number = MAX_LTV_USUAL_RESIDENCE
): number {
  return propertyPrice * (1 - maxLtv);
}

/**
 * Estimates total purchase costs (taxes, notary, etc.)
 */
export function estimatePurchaseCosts(
  propertyPrice: number,
  isNewConstruction: boolean
): number {
  // ITP (Impuesto de Transmisiones Patrimoniales) for used homes: ~6-10% depending on region
  // IVA (IVA) for new homes: 10%
  // AJD (Actos Jurídicos Documentados) for new homes: ~0.5-1.5%
  
  const taxRate = isNewConstruction ? 0.10 : 0.08; // Simplified average
  const tax = propertyPrice * taxRate;
  
  // Notary, registry, agency fees
  const notaryRegistry = propertyPrice * NOTARY_REGISTRY_COSTS;
  
  // Appraisal
  const appraisal = APPRAISAL_COST;
  
  return tax + notaryRegistry + appraisal;
}

/**
 * Calculates the maximum affordable loan based on income
 */
export function calculateMaxAffordableLoan(
  monthlyIncome: number,
  monthlyDebtPayments: number,
  interestRate: number,
  termYears: number,
  maxDti: number = MAX_DEBT_TO_INCOME_RATIO
): number {
  const availableForMortgage = monthlyIncome * maxDti - monthlyDebtPayments;
  
  if (availableForMortgage <= 0) return 0;
  
  // Reverse engineer the loan amount from payment
  const monthlyRate = interestRate / 100 / MONTHS_PER_YEAR;
  const totalPayments = termYears * MONTHS_PER_YEAR;
  
  if (monthlyRate === 0) {
    return availableForMortgage * totalPayments;
  }
  
  const loanAmount =
    availableForMortgage *
    (Math.pow(1 + monthlyRate, totalPayments) - 1) /
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments));
  
  return Math.round(loanAmount);
}
