'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  FormData, 
  RateTypePreference, 
  RiskTolerance, 
  LinkedProductType,
  LINKED_PRODUCT_LABELS 
} from '@/types/mortgage';
import { Shield, TrendingUp, Scale, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';

interface StepPreferencesProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const RATE_TYPE_OPTIONS = [
  { 
    value: RateTypePreference.ALL, 
    label: 'Todas las opciones',
    description: 'Ver hipotecas fijas, variables y mixtas',
    icon: '📊'
  },
  { 
    value: RateTypePreference.FIXED_ONLY, 
    label: 'Solo fija',
    description: 'Cuota estable durante todo el préstamo',
    icon: '🔒'
  },
  { 
    value: RateTypePreference.MIXED_PREFERRED, 
    label: 'Preferencia mixta',
    description: 'Estabilidad inicial con posible ahorro',
    icon: '⚖️'
  },
  { 
    value: RateTypePreference.VARIABLE_PREFERRED, 
    label: 'Preferencia variable',
    description: 'Potencial ahorro con Euríbor bajo',
    icon: '📈'
  },
];

const RISK_OPTIONS = [
  { 
    value: RiskTolerance.LOW, 
    label: 'Conservador',
    description: 'Prefiero estabilidad total en la cuota',
    icon: Shield,
    color: 'emerald'
  },
  { 
    value: RiskTolerance.MEDIUM, 
    label: 'Equilibrado',
    description: 'Acepto cierta variación a cambio de posible ahorro',
    icon: Scale,
    color: 'amber'
  },
  { 
    value: RiskTolerance.HIGH, 
    label: 'Arriesgado',
    description: 'Busco maximizar el ahorro potencial',
    icon: TrendingUp,
    color: 'rose'
  },
];

const LINKED_PRODUCT_OPTIONS = [
  { value: LinkedProductType.PAYROLL, label: 'Nómina domiciliada', icon: '💰' },
  { value: LinkedProductType.LIFE_INSURANCE, label: 'Seguro de vida', icon: '❤️' },
  { value: LinkedProductType.HOME_INSURANCE, label: 'Seguro de hogar', icon: '🏠' },
  { value: LinkedProductType.PENSION_PLAN, label: 'Plan de pensiones', icon: '📈' },
  { value: LinkedProductType.CREDIT_CARD, label: 'Tarjeta de crédito', icon: '💳' },
  { value: LinkedProductType.DEBIT_CARD, label: 'Tarjeta de débito', icon: '💳' },
  { value: LinkedProductType.ELECTRICITY, label: 'Luz', icon: '⚡' },
  { value: LinkedProductType.GAS, label: 'Gas', icon: '🔥' },
  { value: LinkedProductType.INTERNET, label: 'Internet', icon: '🌐' },
];

export function StepPreferences({ formData, updateFormData, errors }: StepPreferencesProps) {
  const handleExistingProductToggle = (product: LinkedProductType, checked: boolean) => {
    const currentProducts = formData.existingProducts || [];
    const newProducts = checked
      ? [...currentProducts, product]
      : currentProducts.filter((p) => p !== product);
    updateFormData({ existingProducts: newProducts });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Preferencias de hipoteca</h3>
        <p className="text-sm text-slate-500">Personaliza la búsqueda según tus necesidades</p>
      </div>

      {/* Rate Type Preference */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-600" />
            Preferencia de tipo de interés
          </Label>
          <p className="text-sm text-slate-500">¿Qué tipo de hipoteca prefieres?</p>
        </div>
        
        <RadioGroup
          value={formData.rateTypePreference}
          onValueChange={(value) => updateFormData({ rateTypePreference: value as RateTypePreference })}
          className="grid gap-3 md:grid-cols-2"
        >
          {RATE_TYPE_OPTIONS.map((option) => {
            const isSelected = formData.rateTypePreference === option.value;
            return (
              <Label
                key={option.value}
                htmlFor={`rate-${option.value}`}
                className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <RadioGroupItem value={option.value} id={`rate-${option.value}`} className="sr-only" />
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-sm text-slate-500">{option.description}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                )}
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Risk Tolerance */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900">Tolerancia al riesgo</Label>
          <p className="text-sm text-slate-500">¿Cómo reaccionarías si tu cuota mensual subiera?</p>
        </div>
        
        <RadioGroup
          value={formData.riskTolerance}
          onValueChange={(value) => updateFormData({ riskTolerance: value as RiskTolerance })}
          className="grid gap-3 md:grid-cols-3"
        >
          {RISK_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.riskTolerance === option.value;
            return (
              <Label
                key={option.value}
                htmlFor={`risk-${option.value}`}
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all text-center ${
                  isSelected 
                    ? `border-${option.color}-500 bg-${option.color}-50/50` 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : ''}`}
              >
                <RadioGroupItem value={option.value} id={`risk-${option.value}`} className="sr-only" />
                <Icon className={`h-8 w-8 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Risk Profile Explanation */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800">¿Qué significa tu perfil de riesgo?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.riskTolerance === RiskTolerance.LOW && (
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="text-sm text-slate-700">
                <strong>Perfil conservador:</strong> Priorizamos hipotecas fijas que ofrecen cuota estable. 
                Ideal si prefieres saber exactamente cuánto pagarás cada mes.
              </div>
            </div>
          )}
          {formData.riskTolerance === RiskTolerance.MEDIUM && (
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-slate-700">
                <strong>Perfil equilibrado:</strong> Consideramos hipotecas mixtas y fijas. 
                Ofrecen estabilidad inicial con posibilidad de ahorro si el Euríbor baja.
              </div>
            </div>
          )}
          {formData.riskTolerance === RiskTolerance.HIGH && (
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-rose-600 mt-0.5" />
              <div className="text-sm text-slate-700">
                <strong>Perfil arriesgado:</strong> Incluimos hipotecas variables con potencial de ahorro 
                si el Euríbor se mantiene bajo. Recuerda que la cuota puede subir.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Linked Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold text-slate-900">Productos vinculados</Label>
            <p className="text-sm text-slate-500">¿Aceptas vinculaciones para obtener mejor tipo?</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="acceptLinked" className="text-sm text-slate-600">Aceptar vinculaciones</Label>
            <Switch
              id="acceptLinked"
              checked={formData.acceptLinkedProducts}
              onCheckedChange={(checked) => updateFormData({ acceptLinkedProducts: checked })}
            />
          </div>
        </div>

        {formData.acceptLinkedProducts && (
          <>
            {/* Products you already have */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Productos que ya tienes
                </CardTitle>
                <CardDescription className="text-emerald-700">
                  Marca los productos que ya tienes. Podrían servirte para conseguir bonificaciones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LINKED_PRODUCT_OPTIONS.map((product) => (
                    <Label
                      key={product.value}
                      htmlFor={`product-${product.value}`}
                      className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all ${
                        formData.existingProducts.includes(product.value)
                          ? 'border-emerald-500 bg-emerald-100'
                          : 'border-emerald-200 bg-white hover:bg-emerald-50'
                      }`}
                    >
                      <Checkbox
                        id={`product-${product.value}`}
                        checked={formData.existingProducts.includes(product.value)}
                        onCheckedChange={(checked) => 
                          handleExistingProductToggle(product.value, checked as boolean)
                        }
                      />
                      <span className="text-lg">{product.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{product.label}</span>
                    </Label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Additional Preferences */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">Otras preferencias</Label>
        
        <div className="space-y-4">
          {/* Prioritize Low Payment */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div>
              <p className="font-medium text-slate-900">Priorizar cuota baja</p>
              <p className="text-sm text-slate-500">Prefiero cuota mensual más baja aunque cueste más a largo plazo</p>
            </div>
            <Switch
              checked={formData.prioritizeLowPayment}
              onCheckedChange={(checked) => updateFormData({ prioritizeLowPayment: checked })}
            />
          </div>

          {/* Willing to Switch Bank */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
            <div>
              <p className="font-medium text-slate-900">Cambiar de banco</p>
              <p className="text-sm text-slate-500">Estoy dispuesto a cambiar la nómina a otro banco</p>
            </div>
            <Switch
              checked={formData.willingToSwitchBank}
              onCheckedChange={(checked) => updateFormData({ willingToSwitchBank: checked })}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-slate-100 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-800">Resumen de preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Tipo preferido</p>
              <p className="font-medium text-slate-900">
                {RATE_TYPE_OPTIONS.find(o => o.value === formData.rateTypePreference)?.label}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Perfil de riesgo</p>
              <p className="font-medium text-slate-900">
                {RISK_OPTIONS.find(o => o.value === formData.riskTolerance)?.label}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Vinculaciones</p>
              <p className="font-medium text-slate-900">
                {formData.acceptLinkedProducts 
                  ? `${formData.existingProducts.length} productos existentes`
                  : 'No acepta vinculaciones'}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Prioridad</p>
              <p className="font-medium text-slate-900">
                {formData.prioritizeLowPayment ? 'Cuota baja' : 'Coste total bajo'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
