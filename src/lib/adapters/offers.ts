// ============================================
// Spanish Mortgage Offers Data
// Based on March 2026 market conditions
// ============================================

import {
  MortgageOffer,
  MortgageType,
  CommissionType,
  ConfidenceLevel,
  LinkedProductType,
  Commission,
  LinkedProduct,
} from '@/types/mortgage';

// ============ COMMISSION TEMPLATES ============

const noOpeningCommission: Commission = {
  type: CommissionType.OPENING,
  percentage: 0,
  confidence: ConfidenceLevel.VERIFIED,
};

const standardOpeningCommission: Commission = {
  type: CommissionType.OPENING,
  percentage: 0.5,
  maxAmount: 3000,
  confidence: ConfidenceLevel.VERIFIED,
};

const earlyRepayCommissionFixed: Commission = {
  type: CommissionType.EARLY_REPAYMENT,
  percentage: 2,
  maxAmount: 15000,
  conditions: 'Comisión aplicable durante los primeros 5 años',
  confidence: ConfidenceLevel.VERIFIED,
};

const earlyRepayCommissionVariable: Commission = {
  type: CommissionType.EARLY_REPAYMENT,
  percentage: 0.25,
  conditions: 'Solo si el tipo aplicable es inferior al de origen',
  confidence: ConfidenceLevel.VERIFIED,
};

const subrogationCommission: Commission = {
  type: CommissionType.SUBROGATION,
  percentage: 0.5,
  maxAmount: 2000,
  confidence: ConfidenceLevel.VERIFIED,
};

// ============ LINKED PRODUCTS TEMPLATES ============

const standardBonificationProducts: LinkedProduct[] = [
  {
    type: LinkedProductType.PAYROLL,
    required: true,
    bonusTin: 0.5,
    description: 'Domiciliación de nómina o pensión > 600€/mes',
  },
  {
    type: LinkedProductType.LIFE_INSURANCE,
    required: true,
    bonusTin: 0.25,
    estimatedAnnualCost: 300,
  },
  {
    type: LinkedProductType.HOME_INSURANCE,
    required: true,
    bonusTin: 0.25,
    estimatedAnnualCost: 400,
  },
  {
    type: LinkedProductType.PENSION_PLAN,
    required: false,
    bonusTin: 0.10,
    estimatedAnnualCost: 1200,
  },
  {
    type: LinkedProductType.CREDIT_CARD,
    required: false,
    bonusTin: 0.05,
    description: 'Uso mínimo 3 veces al año',
  },
];

const minimalLinkedProducts: LinkedProduct[] = [
  {
    type: LinkedProductType.PAYROLL,
    required: true,
    bonusTin: 0.5,
  },
  {
    type: LinkedProductType.HOME_INSURANCE,
    required: true,
    bonusTin: 0.25,
    estimatedAnnualCost: 350,
  },
];

// ============ MORTGAGE OFFERS ============

export const MORTGAGE_OFFERS: MortgageOffer[] = [
  // ==================== SANTANDER ====================
  {
    id: 'santander-fija-1',
    bankId: 'santander',
    productName: 'Hipoteca Fija Santander',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.55,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 5000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-15',
    source: 'Web oficial Banco Santander',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bancosantander.es/particulares/hipotecas',
    notes: ['Proceso 100% online disponible', 'Estudio previo sin compromiso'],
  },
  {
    id: 'santander-mixta-1',
    bankId: 'santander',
    productName: 'Hipoteca Mixta Santander',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 2.75,
      fixedPeriodYears: 15,
      fixedPeriodTin: 2.75,
      variableSpread: 0.90,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [
      { type: CommissionType.OPENING, percentage: 1, confidence: ConfidenceLevel.VERIFIED },
      earlyRepayCommissionFixed,
      subrogationCommission,
    ],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 5000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-15',
    source: 'Web oficial Banco Santander',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bancosantander.es/particulares/hipotecas',
  },
  {
    id: 'santander-variable-1',
    bankId: 'santander',
    productName: 'Hipoteca Variable Santander',
    mortgageType: MortgageType.VARIABLE,
    rateCondition: {
      type: MortgageType.VARIABLE,
      tin: 3.25,
      spread: 0.75,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionVariable, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 5000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-15',
    source: 'Web oficial Banco Santander',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bancosantander.es/particulares/hipotecas',
  },

  // ==================== BBVA ====================
  {
    id: 'bbva-fija-1',
    bankId: 'bbva',
    productName: 'Hipoteca Fija BBVA',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.45,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 3000000,
    maxBorrowerAge: 75,
    minIncomeRequirement: 1500,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-10',
    source: 'Web oficial BBVA',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bbva.es/particulares/hipotecas',
    notes: ['Preaprobación online en 10 minutos', 'Proceso 100% digital disponible'],
  },
  {
    id: 'bbva-mixta-1',
    bankId: 'bbva',
    productName: 'Hipoteca Mixta BBVA',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 2.10,
      fixedPeriodYears: 10,
      fixedPeriodTin: 2.10,
      variableSpread: 0.80,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [standardOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 3000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-10',
    source: 'Web oficial BBVA',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bbva.es/particulares/hipotecas',
  },
  {
    id: 'bbva-variable-1',
    bankId: 'bbva',
    productName: 'Hipoteca Variable BBVA',
    mortgageType: MortgageType.VARIABLE,
    rateCondition: {
      type: MortgageType.VARIABLE,
      tin: 3.00,
      spread: 0.65,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionVariable, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 3000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-10',
    source: 'Web oficial BBVA',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bbva.es/particulares/hipotecas',
  },

  // ==================== CAIXABANK ====================
  {
    id: 'caixabank-fija-1',
    bankId: 'caixabank',
    productName: 'Hipoteca Fija CaixaBank',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.50,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: [
      {
        type: LinkedProductType.PAYROLL,
        required: true,
        bonusTin: 0.5,
      },
      {
        type: LinkedProductType.LIFE_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 350,
      },
      {
        type: LinkedProductType.HOME_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 400,
      },
      {
        type: LinkedProductType.PENSION_PLAN,
        required: false,
        bonusTin: 0.15,
        estimatedAnnualCost: 1200,
      },
    ],
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 4000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-12',
    source: 'Web oficial CaixaBank',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.caixabank.es/particulares/hipotecas',
    notes: ['Amplia red de oficinas para gestión presencial'],
  },
  {
    id: 'caixabank-mixta-1',
    bankId: 'caixabank',
    productName: 'Hipoteca Mixta CaixaBank',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.90,
      fixedPeriodYears: 10,
      fixedPeriodTin: 1.90,
      variableSpread: 0.85,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [standardOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: minimalLinkedProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 4000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-12',
    source: 'Web oficial CaixaBank',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.caixabank.es/particulares/hipotecas',
  },

  // ==================== BANKINTER ====================
  {
    id: 'bankinter-fija-1',
    bankId: 'bankinter',
    productName: 'Hipoteca Fija Bankinter',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.40,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 2000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-08',
    source: 'Web oficial Bankinter',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bankinter.com/banca/hipotecas-prestamos/hipotecas',
    notes: ['Excelente atención al cliente', 'App móvil muy valorada'],
  },
  {
    id: 'bankinter-mixta-1',
    bankId: 'bankinter',
    productName: 'Hipoteca Vamos Mixta',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.70,
      fixedPeriodYears: 5,
      fixedPeriodTin: 1.70,
      variableSpread: 0.90,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [
      { type: CommissionType.OPENING, percentage: 0.25, confidence: ConfidenceLevel.VERIFIED },
      earlyRepayCommissionFixed,
      subrogationCommission,
    ],
    linkedProducts: minimalLinkedProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 2000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-08',
    source: 'Web oficial Bankinter',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bankinter.com/banca/hipotecas-prestamos/hipotecas/hipoteca-mixta',
    notes: ['Una de las mejores mixtas del mercado'],
  },
  {
    id: 'bankinter-variable-1',
    bankId: 'bankinter',
    productName: 'Hipoteca Variable Bankinter',
    mortgageType: MortgageType.VARIABLE,
    rateCondition: {
      type: MortgageType.VARIABLE,
      tin: 2.90,
      spread: 0.70,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionVariable, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 2000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-08',
    source: 'Web oficial Bankinter',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bankinter.com/banca/hipotecas-prestamos/hipotecas',
  },

  // ==================== SABADELL ====================
  {
    id: 'sabadell-fija-1',
    bankId: 'sabadell',
    productName: 'Hipoteca Fija Sabadell',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.60,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 2500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-05',
    source: 'Web oficial Banco Sabadell',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bancsabadell.com/bsnacional/es/particulares/hipotecas',
  },
  {
    id: 'sabadell-mixta-1',
    bankId: 'sabadell',
    productName: 'Hipoteca Mixta Sabadell',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.50,
      fixedPeriodYears: 10,
      fixedPeriodTin: 1.50,
      variableSpread: 0.85,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [standardOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: minimalLinkedProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 2500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-05',
    source: 'Web oficial Banco Sabadell',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.bancsabadell.com/bsnacional/es/particulares/hipotecas',
    notes: ['Tipo fijo muy competitivo los primeros 10 años'],
  },

  // ==================== UNICAJA ====================
  {
    id: 'unicaja-fija-1',
    bankId: 'unicaja',
    productName: 'Hipoteca Fija Unicaja',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.45,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Web oficial Unicaja Banco',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.unicajabanco.es/particulares/hipotecas',
  },
  {
    id: 'unicaja-mixta-1',
    bankId: 'unicaja',
    productName: 'Hipoteca Mixta Bonificada Unicaja',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.30,
      fixedPeriodYears: 5,
      fixedPeriodTin: 1.30,
      variableSpread: 0.95,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [standardOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: minimalLinkedProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Rastreator.com - Marzo 2026',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.unicajabanco.es/particulares/hipotecas',
    notes: ['Una de las mejores mixtas del mes (Rastreator)', 'Verificar condiciones actuales'],
  },

  // ==================== IBERCAJA ====================
  {
    id: 'ibercaja-fija-1',
    bankId: 'ibercaja',
    productName: 'Hipoteca Vamos Fija',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.30,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-06',
    source: 'El Economista - Marzo 2026',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.ibercaja.es/particulares/hipotecas',
    notes: ['Mejor hipoteca fija según El Economista (Marzo 2026)'],
  },
  {
    id: 'ibercaja-mixta-1',
    bankId: 'ibercaja',
    productName: 'Hipoteca Mixta Ibercaja',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.60,
      fixedPeriodYears: 10,
      fixedPeriodTin: 1.60,
      variableSpread: 0.90,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [standardOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: minimalLinkedProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1000000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-06',
    source: 'Web oficial Ibercaja',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.ibercaja.es/particulares/hipotecas',
  },

  // ==================== ING ====================
  {
    id: 'ing-fija-1',
    bankId: 'ing',
    productName: 'Hipoteca Fija ING',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.50,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.VERIFIED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed],
    linkedProducts: [
      {
        type: LinkedProductType.PAYROLL,
        required: true,
        bonusTin: 0.5,
        description: 'Nómina > 1000€/mes',
      },
      {
        type: LinkedProductType.HOME_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 350,
      },
    ],
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Web oficial ING',
    confidence: ConfidenceLevel.VERIFIED,
    productUrl: 'https://www.ing.es/hipotecas',
    notes: ['Sin comisiones', 'Proceso 100% online', 'Mínimas vinculaciones'],
  },
  {
    id: 'ing-mixta-1',
    bankId: 'ing',
    productName: 'Hipoteca Mixta ING',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 1.80,
      fixedPeriodYears: 10,
      fixedPeriodTin: 1.80,
      variableSpread: 0.80,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed],
    linkedProducts: [
      {
        type: LinkedProductType.PAYROLL,
        required: true,
        bonusTin: 0.5,
      },
      {
        type: LinkedProductType.HOME_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 350,
      },
    ],
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1500000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Web oficial ING',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.ing.es/hipotecas',
    notes: ['Pocas vinculaciones requeridas'],
  },

  // ==================== ABANCA ====================
  {
    id: 'abanca-fija-1',
    bankId: 'abanca',
    productName: 'Hipoteca Fija Abanca',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.55,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 80,
    maxTermYears: 30,
    minLoanAmount: 50000,
    maxLoanAmount: 1200000,
    maxBorrowerAge: 75,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 25,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Web oficial Abanca',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.abanca.es/particulares/hipotecas',
  },

  // ==================== HIGH LTV OFFERS (90-95%) ====================
  // These offers allow financing above 80% LTV, typically requiring mortgage insurance
  
  {
    id: 'bbva-fija-90ltv',
    bankId: 'bbva',
    productName: 'Hipoteca Fija Sin Entrada BBVA',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.85,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [
      { type: CommissionType.OPENING, percentage: 0.75, confidence: ConfidenceLevel.ESTIMATED },
      earlyRepayCommissionFixed,
      subrogationCommission,
    ],
    linkedProducts: standardBonificationProducts,
    maxLtv: 95,
    maxTermYears: 30,
    minLoanAmount: 100000,
    maxLoanAmount: 500000,
    maxBorrowerAge: 70,
    minIncomeRequirement: 2500,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 15,
    isPortable: true,
    updatedAt: '2026-03-10',
    source: 'Producto específico alto LTV - Estimado',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.bbva.es/particulares/hipotecas',
    notes: ['Financiación hasta 95%', 'Requiere seguro de impago', 'Condiciones sujetas a perfil'],
  },
  {
    id: 'santander-fija-90ltv',
    bankId: 'santander',
    productName: 'Hipoteca Sin Entrada Santander',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.95,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [
      { type: CommissionType.OPENING, percentage: 0.50, confidence: ConfidenceLevel.ESTIMATED },
      earlyRepayCommissionFixed,
      subrogationCommission,
    ],
    linkedProducts: standardBonificationProducts,
    maxLtv: 90,
    maxTermYears: 30,
    minLoanAmount: 100000,
    maxLoanAmount: 600000,
    maxBorrowerAge: 70,
    minIncomeRequirement: 3000,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 15,
    isPortable: true,
    updatedAt: '2026-03-15',
    source: 'Producto alto LTV - Estimado',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.bancosantander.es/particulares/hipotecas',
    notes: ['Financiación hasta 90%', 'Requiere seguro de impago o aval'],
  },
  {
    id: 'caixabank-fija-95ltv',
    bankId: 'caixabank',
    productName: 'Hipoteca Joven CaixaBank',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.70,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed, subrogationCommission],
    linkedProducts: standardBonificationProducts,
    maxLtv: 95,
    maxTermYears: 30,
    minLoanAmount: 80000,
    maxLoanAmount: 400000,
    maxBorrowerAge: 35, // Solo para menores de 35
    minIncomeRequirement: 2000,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 20,
    isPortable: true,
    updatedAt: '2026-03-12',
    source: 'Hipoteca Joven - Estimado',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.caixabank.es/particulares/hipotecas',
    notes: ['Para menores de 35 años', 'Hasta 95% financiación', 'Requiere nómina domiciliada'],
  },
  {
    id: 'ing-fija-90ltv',
    bankId: 'ing',
    productName: 'Hipoteca Sin Entrada ING',
    mortgageType: MortgageType.FIJA,
    rateCondition: {
      type: MortgageType.FIJA,
      tin: 2.75,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [noOpeningCommission, earlyRepayCommissionFixed],
    linkedProducts: [
      {
        type: LinkedProductType.PAYROLL,
        required: true,
        bonusTin: 0.5,
        description: 'Nómina > 2000€/mes para LTV alto',
      },
      {
        type: LinkedProductType.HOME_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 400,
      },
      {
        type: LinkedProductType.LIFE_INSURANCE,
        required: true,
        bonusTin: 0.25,
        estimatedAnnualCost: 350,
      },
    ],
    maxLtv: 90,
    maxTermYears: 30,
    minLoanAmount: 100000,
    maxLoanAmount: 350000,
    maxBorrowerAge: 70,
    minIncomeRequirement: 2500,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 15,
    isPortable: true,
    updatedAt: '2026-03-01',
    source: 'Producto alto LTV - Estimado',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.ing.es/hipotecas',
    notes: ['Financiación hasta 90%', 'Proceso 100% online', 'Requiere perfil solvente'],
  },
  {
    id: 'bankinter-mixta-90ltv',
    bankId: 'bankinter',
    productName: 'Hipoteca Mixta Alto LTV',
    mortgageType: MortgageType.MIXTA,
    rateCondition: {
      type: MortgageType.MIXTA,
      tin: 2.00,
      fixedPeriodYears: 5,
      fixedPeriodTin: 2.00,
      variableSpread: 1.00,
      validFrom: '2026-03-01',
      confidence: ConfidenceLevel.ESTIMATED,
    },
    commissions: [
      { type: CommissionType.OPENING, percentage: 0.50, confidence: ConfidenceLevel.ESTIMATED },
      earlyRepayCommissionFixed,
      subrogationCommission,
    ],
    linkedProducts: standardBonificationProducts,
    maxLtv: 90,
    maxTermYears: 25,
    minLoanAmount: 100000,
    maxLoanAmount: 400000,
    maxBorrowerAge: 65,
    minIncomeRequirement: 2500,
    allowsEarlyRepayment: true,
    freeEarlyRepaymentPercent: 10,
    isPortable: true,
    updatedAt: '2026-03-08',
    source: 'Producto alto LTV - Estimado',
    confidence: ConfidenceLevel.ESTIMATED,
    productUrl: 'https://www.bankinter.com/banca/hipotecas-prestamos/hipotecas',
    notes: ['Financiación hasta 90%', 'TIN ligeramente superior', 'Perfil solvente requerido'],
  },
];

// ============ HELPER FUNCTIONS ============

/**
 * Get all offers for a specific bank
 */
export function getOffersByBank(bankId: string): MortgageOffer[] {
  return MORTGAGE_OFFERS.filter(offer => offer.bankId === bankId);
}

/**
 * Get all offers of a specific mortgage type
 */
export function getOffersByType(mortgageType: MortgageType): MortgageOffer[] {
  return MORTGAGE_OFFERS.filter(offer => offer.mortgageType === mortgageType);
}

/**
 * Get all fixed mortgage offers
 */
export function getFixedOffers(): MortgageOffer[] {
  return getOffersByType(MortgageType.FIJA);
}

/**
 * Get all variable mortgage offers
 */
export function getVariableOffers(): MortgageOffer[] {
  return getOffersByType(MortgageType.VARIABLE);
}

/**
 * Get all mixed mortgage offers
 */
export function getMixedOffers(): MortgageOffer[] {
  return getOffersByType(MortgageType.MIXTA);
}

/**
 * Get offers sorted by TIN (lowest first)
 */
export function getOffersSortedByTin(): MortgageOffer[] {
  return [...MORTGAGE_OFFERS].sort((a, b) => {
    const tinA = a.rateCondition.fixedPeriodTin ?? a.rateCondition.tin;
    const tinB = b.rateCondition.fixedPeriodTin ?? b.rateCondition.tin;
    return tinA - tinB;
  });
}

/**
 * Get the best offers (lowest TIN) for each type
 */
export function getBestOffers(): { fixed: MortgageOffer; variable: MortgageOffer; mixed: MortgageOffer } {
  const fixed = [...getFixedOffers()].sort(
    (a, b) => a.rateCondition.tin - b.rateCondition.tin
  )[0]!;

  const variable = [...getVariableOffers()].sort(
    (a, b) => (a.rateCondition.spread ?? 1) - (b.rateCondition.spread ?? 1)
  )[0]!;

  const mixed = [...getMixedOffers()].sort(
    (a, b) => (a.rateCondition.fixedPeriodTin ?? a.rateCondition.tin) - 
              (b.rateCondition.fixedPeriodTin ?? b.rateCondition.tin)
  )[0]!;

  return { fixed, variable, mixed };
}
