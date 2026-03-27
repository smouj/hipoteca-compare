'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  FormData, 
  OperationType, 
  PropertyType, 
  EmploymentType,
  RateTypePreference,
  RiskTolerance,
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  MORTGAGE_TYPE_LABELS,
} from '@/types/mortgage';
import { formatCurrency } from '@/lib/calculations';
import { 
  CheckCircle2, 
  Home, 
  Building2, 
  Calculator, 
  User, 
  Settings,
  MapPin,
  TrendingUp,
  Shield,
  Scale,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface StepSummaryProps {
  formData: FormData;
  errors: Record<string, string>;
}

export function StepSummary({ formData, errors }: StepSummaryProps) {
  const hasErrors = Object.keys(errors).length > 0;

  // Calculate derived values
  const ltv = formData.propertyPrice > 0 
    ? Math.round((formData.loanAmount / formData.propertyPrice) * 100)
    : 0;

  const totalMonthlyIncome = formData.monthlyIncome + 
    formData.additionalIncome + 
    (formData.numberOfBorrowers > 1 ? formData.coBorrowerIncome : 0);

  const estimatedMonthlyPayment = formData.loanAmount > 0
    ? Math.round(formData.loanAmount * 0.0045) // Rough estimate at ~3% for 25 years
    : 0;

  const debtToIncome = totalMonthlyIncome > 0
    ? Math.round(((estimatedMonthlyPayment + formData.monthlyDebtPayments) / totalMonthlyIncome) * 100)
    : 0;

  // Get operation type label
  const getOperationLabel = () => {
    switch (formData.operationType) {
      case OperationType.PURCHASE: return 'Compra de vivienda';
      case OperationType.REFINANCE: return 'Refinanciación';
      case OperationType.SUBROGATION: return 'Subrogación';
      default: return 'Compra de vivienda';
    }
  };

  // Get risk tolerance label
  const getRiskLabel = () => {
    switch (formData.riskTolerance) {
      case RiskTolerance.LOW: return 'Conservador';
      case RiskTolerance.MEDIUM: return 'Equilibrado';
      case RiskTolerance.HIGH: return 'Arriesgado';
      default: return 'Equilibrado';
    }
  };

  // Get rate preference label
  const getRatePreferenceLabel = () => {
    switch (formData.rateTypePreference) {
      case RateTypePreference.ALL: return 'Todas las opciones';
      case RateTypePreference.FIXED_ONLY: return 'Solo fija';
      case RateTypePreference.MIXED_PREFERRED: return 'Preferencia mixta';
      case RateTypePreference.VARIABLE_PREFERRED: return 'Preferencia variable';
      default: return 'Todas las opciones';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
          <FileCheck className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Resumen de tu solicitud</h3>
        <p className="text-sm text-slate-500">Revisa los datos antes de calcular las ofertas</p>
      </div>

      {/* Errors Warning */}
      {hasErrors && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Hay errores en el formulario</p>
                <p className="text-sm text-red-700">Por favor, revisa los campos marcados en rojo antes de continuar.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Operation Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Home className="h-5 w-5 text-slate-600" />
            Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Tipo de operación</p>
              <p className="font-medium text-slate-900">{getOperationLabel()}</p>
            </div>
            <div>
              <p className="text-slate-500">Tipo de vivienda</p>
              <p className="font-medium text-slate-900">
                {PROPERTY_TYPE_LABELS[formData.propertyType] || 'Vivienda habitual'}
              </p>
            </div>
            {formData.propertyLocation && (
              <div className="col-span-2">
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Ubicación
                </p>
                <p className="font-medium text-slate-900">{formData.propertyLocation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loan Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-600" />
            Préstamo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Precio propiedad</p>
              <p className="font-medium text-slate-900">{formatCurrency(formData.propertyPrice)}</p>
            </div>
            <div>
              <p className="text-slate-500">Importe préstamo</p>
              <p className="font-medium text-slate-900">{formatCurrency(formData.loanAmount)}</p>
            </div>
            <div>
              <p className="text-slate-500">Entrada</p>
              <p className="font-medium text-slate-900">{formatCurrency(formData.downPayment)}</p>
            </div>
            <div>
              <p className="text-slate-500">Financiación (LTV)</p>
              <p className="font-medium text-slate-900">{ltv}%</p>
            </div>
            <div>
              <p className="text-slate-500">Plazo</p>
              <p className="font-medium text-slate-900">{formData.termYears} años</p>
            </div>
            <div>
              <p className="text-slate-500">Cuota estimada</p>
              <p className="font-medium text-slate-900">~{formatCurrency(estimatedMonthlyPayment)}/mes</p>
            </div>
          </div>
          
          {/* LTV Warning */}
          {ltv > 80 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Financiación superior al 80%</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Podría requerir seguro de impago o aval adicional
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrower Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-5 w-5 text-slate-600" />
            Perfil del solicitante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Situación laboral</p>
              <p className="font-medium text-slate-900">
                {EMPLOYMENT_TYPE_LABELS[formData.employmentType] || 'Contrato indefinido'}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Edad</p>
              <p className="font-medium text-slate-900">{formData.age} años</p>
            </div>
            <div>
              <p className="text-slate-500">Ingresos mensuales</p>
              <p className="font-medium text-slate-900">{formatCurrency(totalMonthlyIncome)}</p>
            </div>
            <div>
              <p className="text-slate-500">Deudas actuales</p>
              <p className="font-medium text-slate-900">
                {formData.monthlyDebtPayments > 0 
                  ? formatCurrency(formData.monthlyDebtPayments) + '/mes'
                  : 'Sin deudas'}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Ahorros disponibles</p>
              <p className="font-medium text-slate-900">{formatCurrency(formData.availableSavings)}</p>
            </div>
            <div>
              <p className="text-slate-500">Titulares</p>
              <p className="font-medium text-slate-900">{formData.numberOfBorrowers}</p>
            </div>
          </div>
          
          {/* Debt-to-income Warning */}
          {debtToIncome > 35 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Ratio de endeudamiento alto: {debtToIncome}%</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Se recomienda no superar el 35% de endeudamiento sobre ingresos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-600" />
            Preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Tipo preferido</p>
              <p className="font-medium text-slate-900">{getRatePreferenceLabel()}</p>
            </div>
            <div>
              <p className="text-slate-500">Perfil de riesgo</p>
              <div className="flex items-center gap-2">
                {formData.riskTolerance === RiskTolerance.LOW && (
                  <Shield className="h-4 w-4 text-emerald-600" />
                )}
                {formData.riskTolerance === RiskTolerance.MEDIUM && (
                  <Scale className="h-4 w-4 text-amber-600" />
                )}
                {formData.riskTolerance === RiskTolerance.HIGH && (
                  <TrendingUp className="h-4 w-4 text-rose-600" />
                )}
                <span className="font-medium text-slate-900">{getRiskLabel()}</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500">Vinculaciones</p>
              <p className="font-medium text-slate-900">
                {formData.acceptLinkedProducts 
                  ? `Sí (${formData.existingProducts.length} productos existentes)`
                  : 'No'}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Cambiar de banco</p>
              <p className="font-medium text-slate-900">
                {formData.willingToSwitchBank ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready to calculate */}
      {!hasErrors && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">Datos completos</p>
                <p className="text-sm text-emerald-700">
                  Pulsa &quot;Calcular ofertas&quot; para ver las mejores hipotecas para ti
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
