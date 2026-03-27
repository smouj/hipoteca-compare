'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData, EmploymentType, EMPLOYMENT_TYPE_LABELS } from '@/types/mortgage';
import { formatCurrency } from '@/lib/calculations';
import { User, Users, Briefcase, EuroIcon, Calendar, CreditCard, Wallet, PlusCircle } from 'lucide-react';

interface StepBorrowerProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const EMPLOYMENT_OPTIONS = [
  { 
    value: EmploymentType.INDEFINITE_CONTRACT, 
    label: 'Contrato indefinido',
    description: 'Trabajo estable con contrato fijo',
    icon: '📋'
  },
  { 
    value: EmploymentType.CIVIL_SERVANT, 
    label: 'Funcionario',
    description: 'Empleado público en propiedad',
    icon: '🏛️'
  },
  { 
    value: EmploymentType.SELF_EMPLOYED, 
    label: 'Autónomo',
    description: 'Trabajo por cuenta propia',
    icon: '💼'
  },
  { 
    value: EmploymentType.TEMPORARY_CONTRACT, 
    label: 'Contrato temporal',
    description: 'Trabajo con contrato de duración determinada',
    icon: '📄'
  },
  { 
    value: EmploymentType.RETIRED, 
    label: 'Jubilado/Pensionista',
    description: 'Ingresos por pensión',
    icon: '👴'
  },
];

const EXTRA_PAYMENT_OPTIONS = [
  { value: 0, label: 'Sin pagas extra' },
  { value: 1, label: '1 paga extra' },
  { value: 2, label: '2 pagas extra' },
  { value: 3, label: '3 pagas extra' },
  { value: 4, label: '4 pagas extra' },
];

export function StepBorrower({ formData, updateFormData, errors }: StepBorrowerProps) {
  // Local state for input fields - only used for display purposes
  // Values are derived from formData on each render
  const incomeInput = formData.monthlyIncome > 0 ? formData.monthlyIncome.toString() : '';
  const additionalIncomeInput = formData.additionalIncome > 0 ? formData.additionalIncome.toString() : '';
  const coBorrowerIncomeInput = formData.coBorrowerIncome > 0 ? formData.coBorrowerIncome.toString() : '';
  const debtInput = formData.monthlyDebtPayments > 0 ? formData.monthlyDebtPayments.toString() : '';
  const savingsInput = formData.availableSavings > 0 ? formData.availableSavings.toString() : '';

  // Calculate total monthly income
  const totalMonthlyIncome = formData.monthlyIncome + 
    formData.additionalIncome + 
    (formData.numberOfBorrowers > 1 ? formData.coBorrowerIncome : 0);

  // Calculate annual income
  const annualIncome = (formData.monthlyIncome + formData.additionalIncome) * 
    (12 + formData.extraPaymentsPerYear) +
    (formData.numberOfBorrowers > 1 ? formData.coBorrowerIncome * 12 : 0);

  // Handle income field changes
  const handleIncomeChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, '');
    const cleanValue = numericValue.replace(/\./g, '').replace(',', '.');
    const numberValue = parseFloat(cleanValue) || 0;
    updateFormData({ [field]: numberValue });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Perfil del solicitante</h3>
        <p className="text-sm text-slate-500">Información laboral y financiera</p>
      </div>

      {/* Number of Borrowers */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            Número de titulares
          </Label>
          <p className="text-sm text-slate-500">¿Cuántas personas firmarán la hipoteca?</p>
        </div>
        
        <div className="flex gap-4">
          <Label
            className={`flex-1 flex items-center justify-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
              formData.numberOfBorrowers === 1 
                ? 'border-emerald-500 bg-emerald-50/50' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <RadioGroup
              value={formData.numberOfBorrowers.toString()}
              onValueChange={(value) => updateFormData({ numberOfBorrowers: parseInt(value) })}
              className="sr-only"
            >
              <RadioGroupItem value="1" className="sr-only" />
            </RadioGroup>
            <User className="h-5 w-5 text-slate-600" />
            <div>
              <div className="font-medium">1 titular</div>
              <div className="text-xs text-slate-500">Solo tú</div>
            </div>
          </Label>
          
          <Label
            className={`flex-1 flex items-center justify-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
              formData.numberOfBorrowers === 2 
                ? 'border-emerald-500 bg-emerald-50/50' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <RadioGroup
              value={formData.numberOfBorrowers.toString()}
              onValueChange={(value) => updateFormData({ numberOfBorrowers: parseInt(value) })}
              className="sr-only"
            >
              <RadioGroupItem value="2" className="sr-only" />
            </RadioGroup>
            <Users className="h-5 w-5 text-slate-600" />
            <div>
              <div className="font-medium">2 titulares</div>
              <div className="text-xs text-slate-500">Pareja o familiar</div>
            </div>
          </Label>
        </div>
      </div>

      {/* Employment Type */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-slate-600" />
            Situación laboral
          </Label>
          <p className="text-sm text-slate-500">Selecciona tu situación laboral actual</p>
        </div>
        
        <RadioGroup
          value={formData.employmentType}
          onValueChange={(value) => updateFormData({ employmentType: value as EmploymentType })}
          className="grid gap-3 md:grid-cols-2"
        >
          {EMPLOYMENT_OPTIONS.map((option) => {
            const isSelected = formData.employmentType === option.value;
            return (
              <Label
                key={option.value}
                htmlFor={`emp-${option.value}`}
                className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <RadioGroupItem value={option.value} id={`emp-${option.value}`} className="sr-only" />
                <span className="text-xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-slate-900">{option.label}</div>
                  <div className="text-xs text-slate-500">{option.description}</div>
                </div>
              </Label>
            );
          })}
        </RadioGroup>
        {errors.employmentType && (
          <p className="text-sm text-red-500">{errors.employmentType}</p>
        )}
      </div>

      {/* Employment Months (if employed) */}
      {(formData.employmentType === EmploymentType.INDEFINITE_CONTRACT || 
        formData.employmentType === EmploymentType.TEMPORARY_CONTRACT) && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="employmentMonths" className="text-base font-semibold text-slate-900">
              Antigüedad en el empleo
            </Label>
            <p className="text-sm text-slate-500">Meses en tu trabajo actual</p>
          </div>
          <div className="relative">
            <Input
              id="employmentMonths"
              type="number"
              min={0}
              max={600}
              value={formData.employmentMonths || ''}
              onChange={(e) => updateFormData({ employmentMonths: parseInt(e.target.value) || 0 })}
              placeholder="24"
              className="h-12 pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">meses</span>
          </div>
        </div>
      )}

      {/* Monthly Income */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="monthlyIncome" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <EuroIcon className="h-5 w-5 text-emerald-600" />
            Ingresos netos mensuales
          </Label>
          <p className="text-sm text-slate-500">Tu salario neto mensual (sin pagas extra)</p>
        </div>
        <div className="relative">
          <Input
            id="monthlyIncome"
            type="text"
            value={incomeInput}
            onChange={(e) => handleIncomeChange('monthlyIncome', e.target.value)}
            placeholder="2.500"
            className={`text-lg h-12 pr-16 ${errors.monthlyIncome ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
        </div>
        {errors.monthlyIncome && (
          <p className="text-sm text-red-500">{errors.monthlyIncome}</p>
        )}
      </div>

      {/* Extra Payments */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900">Pagas extraordinarias</Label>
          <p className="text-sm text-slate-500">Número de pagas extra al año</p>
        </div>
        <Select
          value={formData.extraPaymentsPerYear.toString()}
          onValueChange={(value) => updateFormData({ extraPaymentsPerYear: parseInt(value) })}
        >
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXTRA_PAYMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Additional Income */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="additionalIncome" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-slate-600" />
            Ingresos adicionales
          </Label>
          <p className="text-sm text-slate-500">Alquileres, rentas, otros ingresos recurrentes</p>
        </div>
        <div className="relative">
          <Input
            id="additionalIncome"
            type="text"
            value={additionalIncomeInput}
            onChange={(e) => handleIncomeChange('additionalIncome', e.target.value)}
            placeholder="0"
            className="h-12 pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
        </div>
      </div>

      {/* Co-borrower Section */}
      {formData.numberOfBorrowers > 1 && (
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Segundo titular
            </CardTitle>
            <CardDescription>Datos del segundo solicitante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Co-borrower Employment */}
            <div className="space-y-2">
              <Label>Situación laboral</Label>
              <Select
                value={formData.coBorrowerEmploymentType}
                onValueChange={(value) => updateFormData({ coBorrowerEmploymentType: value as EmploymentType })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Co-borrower Income */}
            <div className="space-y-2">
              <Label htmlFor="coBorrowerIncome">Ingresos netos mensuales</Label>
              <div className="relative">
                <Input
                  id="coBorrowerIncome"
                  type="text"
                  value={coBorrowerIncomeInput}
                  onChange={(e) => handleIncomeChange('coBorrowerIncome', e.target.value)}
                  placeholder="2.000"
                  className="h-11 pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
              </div>
            </div>

            {/* Co-borrower Age */}
            <div className="space-y-2">
              <Label htmlFor="coBorrowerAge">Edad</Label>
              <div className="relative">
                <Input
                  id="coBorrowerAge"
                  type="number"
                  min={18}
                  max={80}
                  value={formData.coBorrowerAge || ''}
                  onChange={(e) => updateFormData({ coBorrowerAge: parseInt(e.target.value) || 0 })}
                  placeholder="35"
                  className="h-11 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">años</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Age */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="age" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-600" />
            Edad del titular principal
          </Label>
          <p className="text-sm text-slate-500">Tu edad actual</p>
        </div>
        <div className="relative">
          <Input
            id="age"
            type="number"
            min={18}
            max={80}
            value={formData.age || ''}
            onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 0 })}
            placeholder="35"
            className={`h-12 pr-12 ${errors.age ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">años</span>
        </div>
        {errors.age && (
          <p className="text-sm text-red-500">{errors.age}</p>
        )}
      </div>

      {/* Monthly Debt Payments */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="monthlyDebt" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            Deudas mensuales actuales
          </Label>
          <p className="text-sm text-slate-500">Préstamos personales, tarjetas, otras deudas</p>
        </div>
        <div className="relative">
          <Input
            id="monthlyDebt"
            type="text"
            value={debtInput}
            onChange={(e) => handleIncomeChange('monthlyDebtPayments', e.target.value)}
            placeholder="0"
            className="h-12 pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€/mes</span>
        </div>
      </div>

      {/* Available Savings */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="savings" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Ahorros disponibles
          </Label>
          <p className="text-sm text-slate-500">Para entrada, gastos y posibles imprevistos</p>
        </div>
        <div className="relative">
          <Input
            id="savings"
            type="text"
            value={savingsInput}
            onChange={(e) => handleIncomeChange('availableSavings', e.target.value)}
            placeholder="60.000"
            className={`h-12 pr-16 ${errors.availableSavings ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
        </div>
        {errors.availableSavings && (
          <p className="text-sm text-red-500">{errors.availableSavings}</p>
        )}
      </div>

      {/* Income Summary */}
      {totalMonthlyIncome > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-800">Resumen de ingresos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-600">Ingresos mensuales totales</p>
                <p className="text-lg font-semibold text-emerald-900">{formatCurrency(totalMonthlyIncome)}</p>
              </div>
              <div>
                <p className="text-emerald-600">Ingresos anuales estimados</p>
                <p className="text-lg font-semibold text-emerald-900">{formatCurrency(annualIncome)}</p>
              </div>
            </div>
            {formData.monthlyDebtPayments > 0 && (
              <div className="pt-2 border-t border-emerald-200 text-sm">
                <p className="text-emerald-700">
                  <strong>Ratio de endeudamiento actual:</strong>{' '}
                  {((formData.monthlyDebtPayments / totalMonthlyIncome) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
