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

export enum MaritalStatus {
  SINGLE = 'SOLTERO',
  MARRIED = 'CASADO',
  DIVORCED = 'DIVORCIADO',
  WIDOWED = 'VIUDO',
  CIVIL_UNION = 'PAREJA_HECHO',
}

export enum EmploymentSector {
  PRIVATE = 'PRIVADO',
  PUBLIC = 'PUBLICO',
  SELF = 'AUTONOMO',
  RETIRED = 'JUBILADO',
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

// ============ BORROWER TYPES (COMPLETE) ============

/**
 * Complete borrower information for Spanish mortgage operations
 * Includes all data typically required by Spanish banks
 */
export interface Borrower {
  /** Unique identifier for this borrower */
  id: string;
  /** Order/position of this borrower (1 = principal, 2+ = co-borrowers) */
  order: number;
  
  // ===== PERSONAL DATA =====
  /** Full name (Nombre y apellidos) */
  fullName: string;
  /** ID Document number (DNI/NIE) */
  documentId: string;
  /** Date of birth (YYYY-MM-DD) */
  dateOfBirth: string;
  /** Age calculated from dateOfBirth */
  age: number;
  /** Marital status */
  maritalStatus: MaritalStatus;
  /** Regimen económico matrimonial (only if married) */
  matrimonialRegime?: 'GANANCIALES' | 'SEPARACION_BIENES' | 'PARTICIPACION';
  /** Number of dependents (children, elderly relatives) */
  dependents: number;
  /** Phone number */
  phone?: string;
  /** Email */
  email?: string;
  
  // ===== EMPLOYMENT DATA =====
  /** Type of employment */
  employmentType: EmploymentType;
  /** Employment sector */
  employmentSector?: EmploymentSector;
  /** Company name (for employees) */
  companyName?: string;
  /** Activity sector (e.g., 'Tecnología', 'Sanidad', 'Educación') */
  activitySector?: string;
  /** Job position/title */
  jobTitle?: string;
  /** Months at current job */
  employmentMonths: number;
  /** Total working years (for stability assessment) */
  totalWorkingYears?: number;
  
  // ===== SPECIFIC EMPLOYMENT DETAILS =====
  /** For civil servants: body/level (Cuerpo/Escala) */
  civilServantBody?: string;
  /** For civil servants: level (Nivel administrativo) */
  civilServantLevel?: number;
  /** For self-employed: years of activity */
  selfEmployedYears?: number;
  /** For self-employed: IAE epígrafe */
  iaeEpigrafe?: string;
  /** For self-employed: last year's net profit */
  selfEmployedNetProfit?: number;
  /** For retired: pension type */
  pensionType?: 'JUBILACION' | 'VIUDEDAD' | 'INCAPACIDAD' | 'ORFANDAD';
  
  // ===== INCOME DATA =====
  /** Monthly net income (salario neto mensual) */
  monthlyNetIncome: number;
  /** Extra payments per year (pagas extraordinarias) */
  extraPaymentsPerYear: number;
  /** Total annual income (calculated) */
  annualIncome: number;
  /** Additional recurring income (alquileres, rentas, etc.) */
  additionalMonthlyIncome: number;
  /** Source of additional income */
  additionalIncomeSource?: string;
  /** Other annual income (bonuses, commissions, etc.) */
  otherAnnualIncome?: number;
  
  // ===== DEBT & ASSETS =====
  /** Monthly debt payments (préstamos, tarjetas, etc.) */
  monthlyDebtPayments: number;
  /** List of current debts */
  debts?: DebtInfo[];
  /** Available savings for down payment and expenses */
  availableSavings: number;
  /** Other assets value (propiedades, inversiones, etc.) */
  otherAssets?: number;
  /** Description of other assets */
  otherAssetsDescription?: string;
  
  // ===== METADATA =====
  /** Is this the principal borrower? */
  isPrincipal: boolean;
  /** Ownership percentage (if different from equal split) */
  ownershipPercentage?: number;
}

export interface DebtInfo {
  type: 'PRESTAMO_PERSONAL' | 'PRESTAMO_AUTO' | 'TARJETA_CREDITO' | 'OTRA_HIPOTECA' | 'OTRO';
  description: string;
  outstandingAmount: number;
  monthlyPayment: number;
  remainingMonths: number;
}

// ============ PROPERTY TYPES ============

export interface PropertyDetails {
  /** Precio de compra/valor de tasación */
  price: number;
  /** Ubicación (provincia o código postal) */
  location?: string;
  /** Full address */
  address?: string;
  /** Tipo de propiedad */
  propertyType: PropertyType;
  /** Año de construcción */
  constructionYear?: number;
  /** Superficie en m² */
  surfaceArea?: number;
  /** Necesita reforma */
  needsRenovation?: boolean;
  /** Energy rating (A-G) */
  energyRating?: string;
  /** Has garage */
  hasGarage?: boolean;
  /** Has storage room */
  hasStorageRoom?: boolean;
  /** Community fees monthly */
  communityFees?: number;
}

// ============ USER INPUT TYPES (UPDATED) ============

export interface BorrowerProfile {
  /** DEPRECATED: Use borrowers array instead */
  employmentType: EmploymentType;
  employmentMonths?: number;
  monthlyIncome: number;
  additionalIncome?: number;
  extraPaymentsPerYear: number;
  monthlyDebtPayments: number;
  availableSavings: number;
  age: number;
  numberOfBorrowers: number;
  coBorrowerIncome?: number;
  coBorrowerAge?: number;
  coBorrowerEmploymentType?: EmploymentType;
  
  /** NEW: Complete borrower information array */
  borrowers?: Borrower[];
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
  
  // Legacy fields (kept for backwards compatibility)
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
  
  // NEW: Complete borrowers array
  borrowers: Borrower[];
  
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

import { v4 as uuidv4 } from 'uuid';

export const createDefaultBorrower = (order: number = 1): Borrower => ({
  id: uuidv4(),
  order,
  fullName: '',
  documentId: '',
  dateOfBirth: '',
  age: 35,
  maritalStatus: MaritalStatus.SINGLE,
  dependents: 0,
  employmentType: EmploymentType.INDEFINITE_CONTRACT,
  employmentMonths: 24,
  monthlyNetIncome: 3000,
  extraPaymentsPerYear: 2,
  annualIncome: 42000,
  additionalMonthlyIncome: 0,
  monthlyDebtPayments: 0,
  availableSavings: 60000,
  isPrincipal: order === 1,
});

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
  borrowers: [createDefaultBorrower(1)],
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

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  [MaritalStatus.SINGLE]: 'Soltero/a',
  [MaritalStatus.MARRIED]: 'Casado/a',
  [MaritalStatus.DIVORCED]: 'Divorciado/a',
  [MaritalStatus.WIDOWED]: 'Viudo/a',
  [MaritalStatus.CIVIL_UNION]: 'Pareja de hecho',
};

export const EMPLOYMENT_SECTOR_LABELS: Record<EmploymentSector, string> = {
  [EmploymentSector.PRIVATE]: 'Sector Privado',
  [EmploymentSector.PUBLIC]: 'Sector Público',
  [EmploymentSector.SELF]: 'Autónomo',
  [EmploymentSector.RETIRED]: 'Jubilado/Pensionista',
};
