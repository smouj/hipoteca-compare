// ============================================
// Spanish Mortgage Comparison - Type Definitions
// ============================================

// ============ ENUMS ============

export enum MortgageType {
  FIJA = 'FIJA',
  VARIABLE = 'VARIABLE',
  MIXTA = 'MIXTA',
}

export enum OperationType {
  PURCHASE = 'COMPRA',
  REFINANCE = 'REFINANCIACION',
  SUBROGATION = 'SUBROGACION',
}

export enum PropertyType {
  USUAL_RESIDENCE = 'VIVIENDA_HABITUAL',
  SECOND_RESIDENCE = 'SEGUNDA_VIVIENDA',
  NEW_CONSTRUCTION = 'OBRA_NUEVA',
}

export enum EmploymentType {
  INDEFINITE_CONTRACT = 'INDEFINIDO',
  TEMPORARY_CONTRACT = 'TEMPORAL',
  SELF_EMPLOYED = 'AUTONOMO',
  CIVIL_SERVANT = 'FUNCIONARIO',
  RETIRED = 'JUBILADO',
  UNEMPLOYED = 'DESEMPLEADO',
}

export enum RiskTolerance {
  LOW = 'BAJO',
  MEDIUM = 'MEDIO',
  HIGH = 'ALTO',
}

export enum RateTypePreference {
  FIXED_ONLY = 'SOLO_FIJA',
  MIXED_PREFERRED = 'PREFERENCIA_MIXTA',
  VARIABLE_PREFERRED = 'PREFERENCIA_VARIABLE',
  ALL = 'TODAS',
}

export enum ConfidenceLevel {
  VERIFIED = 'VERIFICADO',
  ESTIMATED = 'ESTIMADO',
  OUTDATED = 'DESFASADO',
  PENDING = 'PENDIENTE_VERIFICACION',
}

export enum CommissionType {
  OPENING = 'APERTURA',
  EARLY_REPAYMENT = 'AMORTIZACION_ANTICIPADA',
  SUBROGATION = 'SUBROGACION',
  NOVATION = 'NOVACION',
  CANCELLATION = 'CANCELACION',
}

export enum LinkedProductType {
  PAYROLL = 'NOMINA',
  LIFE_INSURANCE = 'SEGURO_VIDA',
  HOME_INSURANCE = 'SEGURO_HOGAR',
  PENSION_PLAN = 'PLAN_PENSIONES',
  CREDIT_CARD = 'TARJETA_CREDITO',
  DEBIT_CARD = 'TARJETA_DEBITO',
  ALARMS = 'ALARMA',
  ELECTRICITY = 'LUZ',
  GAS = 'GAS',
  INTERNET = 'INTERNET',
}

// ============ CORE TYPES ============

export interface RateCondition {
  /** Tipo de hipoteca */
  type: MortgageType;
  /** TIN (Tipo de Interés Nominal) anual en porcentaje */
  tin: number;
  /** Diferencial sobre Euríbor para hipotecas variables (ej: 0.75) */
  spread?: number;
  /** Años de periodo fijo para hipotecas mixtas */
  fixedPeriodYears?: number;
  /** TIN durante el periodo fijo en hipotecas mixtas */
  fixedPeriodTin?: number;
  /** Spread durante el periodo variable en hipotecas mixtas */
  variableSpread?: number;
  /** Fecha de validez del tipo */
  validFrom: string;
  /** Nivel de confianza del dato */
  confidence: ConfidenceLevel;
}

export interface Commission {
  /** Tipo de comisión */
  type: CommissionType;
  /** Porcentaje sobre el capital (ej: 0.5 para 0.5%) */
  percentage?: number;
  /** Importe fijo en euros */
  fixedAmount?: number;
  /** Límite máximo en euros (si aplica) */
  maxAmount?: number;
  /** Condiciones especiales */
  conditions?: string;
  /** Nivel de confianza */
  confidence: ConfidenceLevel;
}

export interface LinkedProduct {
  /** Tipo de producto vinculado */
  type: LinkedProductType;
  /** Es obligatorio para obtener el tipo bonificado */
  required: boolean;
  /** Bonificación que aporta al TIN (en puntos porcentuales) */
  bonusTin: number;
  /** Coste estimado anual del producto */
  estimatedAnnualCost?: number;
  /** Descripción adicional */
  description?: string;
}

export interface MortgageOffer {
  /** Identificador único */
  id: string;
  /** Banco emisor */
  bankId: string;
  /** Nombre del producto */
  productName: string;
  /** Tipo de hipoteca */
  mortgageType: MortgageType;
  /** Condiciones del tipo de interés */
  rateCondition: RateCondition;
  /** Comisiones aplicables */
  commissions: Commission[];
  /** Productos vinculados para bonificación */
  linkedProducts: LinkedProduct[];
  /** LTV máximo (Loan to Value) en porcentaje */
  maxLtv: number;
  /** Plazo máximo en años */
  maxTermYears: number;
  /** Importe mínimo de préstamo */
  minLoanAmount: number;
  /** Importe máximo de préstamo */
  maxLoanAmount: number;
  /** Edad máxima del titular al finalizar */
  maxBorrowerAge: number;
  /** Requisitos de ingresos mínimos */
  minIncomeRequirement?: number;
  /** Permite amortización anticipada sin comisión */
  allowsEarlyRepayment: boolean;
  /** Porcentaje máximo de amortización anticipada anual sin comisión */
  freeEarlyRepaymentPercent?: number;
  /** Es portable a otra vivienda */
  isPortable: boolean;
  /** Período de carencia (meses sin pagar capital) */
  gracePeriodMonths?: number;
  /** Fecha de actualización de los datos */
  updatedAt: string;
  /** Fuente de los datos */
  source: string;
  /** Nivel de confianza general de la oferta */
  confidence: ConfidenceLevel;
  /** URL del producto en la web del banco */
  productUrl?: string;
  /** Notas adicionales */
  notes?: string[];
}

export interface Bank {
  /** Identificador único */
  id: string;
  /** Nombre comercial */
  name: string;
  /** Código de entidad bancaria */
  entityCode: string;
  /** Logo URL */
  logoUrl?: string;
  /** Web oficial */
  website: string;
  /** Tamaño de la entidad por activos (en millones de euros) */
  assetsSize: number;
  /** Número de oficinas en España */
  officeCount?: number;
  /** Rating de solvencia (si aplica) */
  creditRating?: string;
  /** Es un banco totalmente online */
  isOnlineOnly: boolean;
  /** Descripción breve */
  description?: string;
}

// ============ USER INPUT TYPES ============

export interface PropertyDetails {
  /** Precio de compra/valor de tasación */
  price: number;
  /** Ubicación (provincia o código postal) */
  location?: string;
  /** Tipo de propiedad */
  propertyType: PropertyType;
  /** Año de construcción */
  constructionYear?: number;
  /** Superficie en m² */
  surfaceArea?: number;
  /** Necesita reforma */
  needsRenovation?: boolean;
}

export interface BorrowerProfile {
  /** Tipo de empleo principal */
  employmentType: EmploymentType;
  /** Antigüedad en el empleo actual (meses) */
  employmentMonths?: number;
  /** Ingresos netos mensuales */
  monthlyIncome: number;
  /** Ingresos adicionales (alquileres, etc.) */
  additionalIncome?: number;
  /** Pagas extraordinarias al año */
  extraPaymentsPerYear: number;
  /** Deudas actuales (préstamos personales, tarjetas) */
  monthlyDebtPayments: number;
  /** Ahorros disponibles para entrada y gastos */
  availableSavings: number;
  /** Edad del titular principal */
  age: number;
  /** Número de titulares */
  numberOfBorrowers: number;
  /** Ingresos del segundo titular (si aplica) */
  coBorrowerIncome?: number;
  /** Edad del segundo titular */
  coBorrowerAge?: number;
  /** Tipo de empleo del segundo titular */
  coBorrowerEmploymentType?: EmploymentType;
}

export interface MortgagePreferences {
  /** Preferencia de tipo de interés */
  rateTypePreference: RateTypePreference;
  /** Tolerancia al riesgo de subida de tipos */
  riskTolerance: RiskTolerance;
  /** Acepta productos vinculados para bonificación */
  acceptLinkedProducts: boolean;
  /** Productos que ya tiene el usuario */
  existingProducts: LinkedProductType[];
  /** Plazo deseado en años */
  desiredTermYears: number;
  /** Prefiere cuota baja vs total coste bajo */
  prioritizeLowPayment: boolean;
  /** Está dispuesto a cambiar de banco para la nómina */
  willingToSwitchBank: boolean;
}

export interface UserScenario {
  /** Tipo de operación */
  operationType: OperationType;
  /** Detalles de la propiedad */
  propertyDetails: PropertyDetails;
  /** Perfil del prestatario */
  borrowerProfile: BorrowerProfile;
  /** Preferencias de hipoteca */
  preferences: MortgagePreferences;
  /** Importe del préstamo solicitado */
  loanAmount: number;
  /** Plazo en años */
  termYears: number;
  /** Fecha de la consulta */
  createdAt: string;
}

// ============ CALCULATION RESULT TYPES ============

export interface ScenarioCalculation {
  /** Nombre del escenario (base, conservador, adverso) */
  name: string;
  /** Descripción del escenario */
  description: string;
  /** Euríbor supuesto para el escenario */
  assumedEuribor: number;
  /** Cuota mensual resultante */
  monthlyPayment: number;
  /** Total de intereses a pagar */
  totalInterest: number;
  /** Coste total del préstamo */
  totalCost: number;
}

export interface CalculationResult {
  /** Cuota mensual en el escenario base */
  monthlyPayment: number;
  /** TAE estimada */
  tae: number;
  /** TIN efectivo */
  effectiveTin: number;
  /** Coste total (capital + intereses + comisiones) */
  totalCost: number;
  /** Total de intereses */
  totalInterest: number;
  /** Total de comisiones estimadas */
  totalCommissions: number;
  /** Ratio LTV resultante */
  ltv: number;
  /** Ratio de endeudamiento sobre ingresos */
  debtToIncomeRatio: number;
  /** Cálculos por escenario (para hipotecas variables/mixtas) */
  scenarios?: ScenarioCalculation[];
  /** Fecha del cálculo */
  calculatedAt: string;
}

// ============ SCORING TYPES ============

export interface ScoreFactor {
  /** Identificador del factor */
  id: string;
  /** Nombre del factor */
  name: string;
  /** Puntuación de 0 a 100 */
  score: number;
  /** Peso del factor en el total (0-1) */
  weight: number;
  /** Puntuación ponderada (score * weight) */
  weightedScore: number;
  /** Explicación de la puntuación */
  explanation: string;
  /** Detalles adicionales */
  details?: string[];
}

export interface ScoredOffer {
  /** Oferta original */
  offer: MortgageOffer;
  /** Resultado del cálculo */
  calculation: CalculationResult;
  /** Puntuación total (0-100) */
  totalScore: number;
  /** Factores de puntuación detallados */
  scoreFactors: ScoreFactor[];
  /** Ventajas para el perfil del usuario */
  pros: string[];
  /** Desventajas para el perfil del usuario */
  cons: string[];
  /** Recomendación personalizada */
  recommendation?: string;
  /** Es la mejor opción */
  isBestOption?: boolean;
  /** Alertas sobre la oferta */
  alerts?: string[];
}

// ============ COMPARISON CONTEXT TYPES ============

export interface ComparisonContext {
  /** Escenario del usuario */
  userScenario: UserScenario;
  /** Euríbor actual */
  currentEuribor: number;
  /** Fecha de la comparación */
  comparisonDate: string;
  /** Ofertas puntuadas */
  scoredOffers: ScoredOffer[];
  /** Filtros activos */
  activeFilters: ComparisonFilter;
}

export interface ComparisonFilter {
  /** Filtrar por tipo de hipoteca */
  mortgageTypes?: MortgageType[];
  /** Cuota máxima */
  maxMonthlyPayment?: number;
  /** LTV mínimo requerido */
  minLtv?: number;
  /** Plazo máximo */
  maxTermYears?: number;
  /** Solo ofertas sin comisión de apertura */
  noOpeningCommission?: boolean;
  /** Solo ofertas sin productos vinculados obligatorios */
  noMandatoryLinkedProducts?: boolean;
}

// ============ FORM TYPES ============

export interface FormStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface FormData {
  operationType: OperationType;
  propertyPrice: number;
  propertyLocation: string;
  propertyType: PropertyType;
  loanAmount: number;
  downPayment: number;
  termYears: number;
  employmentType: EmploymentType;
  employmentMonths: number;
  monthlyIncome: number;
  additionalIncome: number;
  extraPaymentsPerYear: number;
  monthlyDebtPayments: number;
  availableSavings: number;
  age: number;
  numberOfBorrowers: number;
  coBorrowerIncome: number;
  coBorrowerAge: number;
  coBorrowerEmploymentType: EmploymentType;
  rateTypePreference: RateTypePreference;
  riskTolerance: RiskTolerance;
  acceptLinkedProducts: boolean;
  existingProducts: LinkedProductType[];
  desiredTermYears: number;
  prioritizeLowPayment: boolean;
  willingToSwitchBank: boolean;
}

// ============ API TYPES ============

export interface CompareMortgagesRequest {
  userScenario: UserScenario;
}

export interface CompareMortgagesResponse {
  success: boolean;
  data?: {
    scoredOffers: ScoredOffer[];
    comparisonContext: ComparisonContext;
  };
  error?: string;
}

// ============ UTILITY TYPES ============

export interface EuriborData {
  date: string;
  value: number;
  monthlyAverage?: number;
  previousMonthValue?: number;
  yearToDateAverage?: number;
}

export interface MaturitySchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// ============ DEFAULT VALUES ============

export const DEFAULT_FORM_DATA: FormData = {
  operationType: OperationType.PURCHASE,
  propertyPrice: 250000,
  propertyLocation: '',
  propertyType: PropertyType.USUAL_RESIDENCE,
  loanAmount: 200000,
  downPayment: 50000,
  termYears: 25,
  employmentType: EmploymentType.INDEFINITE_CONTRACT,
  employmentMonths: 24,
  monthlyIncome: 3000,
  additionalIncome: 0,
  extraPaymentsPerYear: 2,
  monthlyDebtPayments: 0,
  availableSavings: 60000,
  age: 35,
  numberOfBorrowers: 1,
  coBorrowerIncome: 0,
  coBorrowerAge: 0,
  coBorrowerEmploymentType: EmploymentType.INDEFINITE_CONTRACT,
  rateTypePreference: RateTypePreference.ALL,
  riskTolerance: RiskTolerance.MEDIUM,
  acceptLinkedProducts: true,
  existingProducts: [],
  desiredTermYears: 25,
  prioritizeLowPayment: false,
  willingToSwitchBank: true,
};

// ============ TYPE GUARDS ============

export function isFixedMortgage(offer: MortgageOffer): boolean {
  return offer.mortgageType === MortgageType.FIJA;
}

export function isVariableMortgage(offer: MortgageOffer): boolean {
  return offer.mortgageType === MortgageType.VARIABLE;
}

export function isMixedMortgage(offer: MortgageOffer): boolean {
  return offer.mortgageType === MortgageType.MIXTA;
}

// ============ LABEL MAPPINGS ============

export const MORTGAGE_TYPE_LABELS: Record<MortgageType, string> = {
  [MortgageType.FIJA]: 'Fija',
  [MortgageType.VARIABLE]: 'Variable',
  [MortgageType.MIXTA]: 'Mixta',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  [EmploymentType.INDEFINITE_CONTRACT]: 'Contrato indefinido',
  [EmploymentType.TEMPORARY_CONTRACT]: 'Contrato temporal',
  [EmploymentType.SELF_EMPLOYED]: 'Autónomo',
  [EmploymentType.CIVIL_SERVANT]: 'Funcionario',
  [EmploymentType.RETIRED]: 'Jubilado',
  [EmploymentType.UNEMPLOYED]: 'En paro',
};

export const RISK_TOLERANCE_LABELS: Record<RiskTolerance, string> = {
  [RiskTolerance.LOW]: 'Bajo',
  [RiskTolerance.MEDIUM]: 'Medio',
  [RiskTolerance.HIGH]: 'Alto',
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  [PropertyType.USUAL_RESIDENCE]: 'Vivienda habitual',
  [PropertyType.SECOND_RESIDENCE]: 'Segunda vivienda',
  [PropertyType.NEW_CONSTRUCTION]: 'Obra nueva',
};

export const CONFIDENCE_LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  [ConfidenceLevel.VERIFIED]: 'Verificado',
  [ConfidenceLevel.ESTIMATED]: 'Estimado',
  [ConfidenceLevel.OUTDATED]: 'Desfasado',
  [ConfidenceLevel.PENDING]: 'Pendiente de verificación',
};

export const LINKED_PRODUCT_LABELS: Record<LinkedProductType, string> = {
  [LinkedProductType.PAYROLL]: 'Domiciliación de nómina',
  [LinkedProductType.LIFE_INSURANCE]: 'Seguro de vida',
  [LinkedProductType.HOME_INSURANCE]: 'Seguro de hogar',
  [LinkedProductType.PENSION_PLAN]: 'Plan de pensiones',
  [LinkedProductType.CREDIT_CARD]: 'Tarjeta de crédito',
  [LinkedProductType.DEBIT_CARD]: 'Tarjeta de débito',
  [LinkedProductType.ALARMS]: 'Sistema de alarma',
  [LinkedProductType.ELECTRICITY]: 'Luz',
  [LinkedProductType.GAS]: 'Gas',
  [LinkedProductType.INTERNET]: 'Internet',
};
