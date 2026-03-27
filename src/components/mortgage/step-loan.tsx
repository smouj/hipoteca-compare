'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData, OperationType } from '@/types/mortgage';
import { formatCurrency, calculateMinDownPayment, MAX_LTV_USUAL_RESIDENCE, MAX_LTV_SECOND_RESIDENCE } from '@/lib/calculations';
import { Calculator, Info, PiggyBank, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StepLoanProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const TERM_OPTIONS = [10, 15, 20, 25, 30, 35, 40];

export function StepLoan({ formData, updateFormData, errors }: StepLoanProps) {
  // Track if we're currently editing to avoid overwriting user input
  const isEditingRef = useRef(false);
  const [loanInput, setLoanInput] = useState(
    formData.loanAmount > 0 ? formData.loanAmount.toString() : ''
  );
  const [downPaymentInput, setDownPaymentInput] = useState(
    formData.downPayment > 0 ? formData.downPayment.toString() : ''
  );

  // Calculate max LTV based on property type
  const maxLtv = formData.propertyType === 'SEGUNDA_VIVIENDA' 
    ? MAX_LTV_SECOND_RESIDENCE 
    : MAX_LTV_USUAL_RESIDENCE;

  // Calculate LTV percentage
  const ltv = formData.propertyPrice > 0 
    ? Math.round((formData.loanAmount / formData.propertyPrice) * 100) 
    : 0;

  // Calculate minimum down payment required
  const minDownPayment = formData.propertyPrice > 0
    ? Math.round(formData.propertyPrice * (1 - maxLtv))
    : 0;

  // Calculate savings needed (down payment + costs ~10% of property price)
  const estimatedCosts = formData.propertyPrice * 0.10; // Taxes, notary, etc.
  const totalSavingsNeeded = formData.downPayment + estimatedCosts;

  // Handle loan amount change
  const handleLoanChange = (value: string) => {
    isEditingRef.current = true;
    const numericValue = value.replace(/[^\d.,]/g, '');
    setLoanInput(numericValue);
    
    const cleanValue = numericValue.replace(/\./g, '').replace(',', '.');
    const numberValue = parseFloat(cleanValue) || 0;
    
    // Cap loan at max LTV
    const maxLoan = Math.round(formData.propertyPrice * maxLtv);
    const cappedValue = Math.min(numberValue, maxLoan);
    
    updateFormData({ 
      loanAmount: cappedValue,
      downPayment: formData.propertyPrice - cappedValue
    });
    
    // Update down payment input to match
    setDownPaymentInput((formData.propertyPrice - cappedValue).toString());
    
    // Reset editing flag after a short delay
    setTimeout(() => {
      isEditingRef.current = false;
    }, 100);
  };

  // Handle down payment change
  const handleDownPaymentChange = (value: string) => {
    isEditingRef.current = true;
    const numericValue = value.replace(/[^\d.,]/g, '');
    setDownPaymentInput(numericValue);
    
    const cleanValue = numericValue.replace(/\./g, '').replace(',', '.');
    const numberValue = parseFloat(cleanValue) || 0;
    
    const loan = formData.propertyPrice - numberValue;
    const maxLoan = Math.round(formData.propertyPrice * maxLtv);
    
    updateFormData({ 
      downPayment: numberValue,
      loanAmount: Math.min(loan, maxLoan)
    });
    
    // Update loan input to match
    setLoanInput(Math.min(loan, maxLoan).toString());
    
    // Reset editing flag after a short delay
    setTimeout(() => {
      isEditingRef.current = false;
    }, 100);
  };

  // Slider handler for loan amount
  const handleLoanSlider = (value: number[]) => {
    const loanAmount = Math.round(formData.propertyPrice * (value[0] / 100));
    updateFormData({
      loanAmount,
      downPayment: formData.propertyPrice - loanAmount
    });
    setLoanInput(loanAmount.toString());
    setDownPaymentInput((formData.propertyPrice - loanAmount).toString());
  };

  const isPurchase = formData.operationType === OperationType.PURCHASE;
  const isLTVHigh = ltv > 80;
  const isLTVValid = ltv <= (maxLtv * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Datos del préstamo</h3>
        <p className="text-sm text-slate-500">Define el importe y plazo de tu hipoteca</p>
      </div>

      {/* Property value summary for non-purchase operations */}
      {!isPurchase && (
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Valor de tasación actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                type="text"
                value={formData.propertyPrice > 0 ? formData.propertyPrice.toString() : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  updateFormData({ propertyPrice: parseFloat(value) || 0 });
                }}
                placeholder="Introduce el valor de tasación"
                className="text-lg h-12 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loan Amount */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="loanAmount" className="text-base font-semibold text-slate-900">
            Importe del préstamo
          </Label>
          <p className="text-sm text-slate-500">
            Máximo {formatCurrency(formData.propertyPrice * maxLtv)} ({Math.round(maxLtv * 100)}% del valor)
          </p>
        </div>
        
        <div className="relative">
          <Input
            id="loanAmount"
            type="text"
            value={loanInput}
            onChange={(e) => handleLoanChange(e.target.value)}
            placeholder="200.000"
            className={`text-lg h-12 pr-16 ${errors.loanAmount ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
        </div>

        {/* LTV Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Financiación: <span className="font-medium">{ltv}%</span></span>
            <span className="text-slate-600">Máximo: <span className="font-medium">{Math.round(maxLtv * 100)}%</span></span>
          </div>
          <Slider
            value={[ltv]}
            onValueChange={handleLoanSlider}
            max={Math.round(maxLtv * 100)}
            min={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>10%</span>
            <span>{Math.round(maxLtv * 100)}%</span>
          </div>
        </div>

        {errors.loanAmount && (
          <p className="text-sm text-red-500">{errors.loanAmount}</p>
        )}
      </div>

      {/* Down Payment */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="downPayment" className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            Entrada disponible
          </Label>
          <p className="text-sm text-slate-500">
            Mínimo recomendado: {formatCurrency(minDownPayment)}
          </p>
        </div>
        
        <div className="relative">
          <Input
            id="downPayment"
            type="text"
            value={downPaymentInput}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            placeholder="50.000"
            className={`text-lg h-12 pr-16 ${errors.downPayment ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
        </div>

        {formData.downPayment > 0 && formData.downPayment < minDownPayment && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              La entrada es inferior al mínimo del {Math.round((1 - maxLtv) * 100)}% recomendado. 
              Podrías necesitar financiación adicional.
            </AlertDescription>
          </Alert>
        )}

        {errors.downPayment && (
          <p className="text-sm text-red-500">{errors.downPayment}</p>
        )}
      </div>

      {/* High LTV Warning */}
      {isLTVHigh && isPurchase && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Financiación superior al 80%:</strong> Es posible que necesites 
            contratar un seguro de impago o aval. Consulta con el banco.
          </AlertDescription>
        </Alert>
      )}

      {/* Loan Term */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-600" />
            Plazo del préstamo
          </Label>
          <p className="text-sm text-slate-500">
            Selecciona el número de años para devolver el préstamo
          </p>
        </div>
        
        <Select
          value={formData.termYears.toString()}
          onValueChange={(value) => updateFormData({ termYears: parseInt(value) })}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Selecciona el plazo" />
          </SelectTrigger>
          <SelectContent>
            {TERM_OPTIONS.map((years) => (
              <SelectItem key={years} value={years.toString()}>
                {years} años
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.termYears && (
          <p className="text-sm text-red-500">{errors.termYears}</p>
        )}
      </div>

      {/* Summary Card */}
      {formData.loanAmount > 0 && formData.propertyPrice > 0 && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-emerald-800 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Resumen del préstamo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-600">Importe solicitado</p>
                <p className="text-lg font-semibold text-emerald-900">{formatCurrency(formData.loanAmount)}</p>
              </div>
              <div>
                <p className="text-emerald-600">Entrada</p>
                <p className="text-lg font-semibold text-emerald-900">{formatCurrency(formData.downPayment)}</p>
              </div>
              <div>
                <p className="text-emerald-600">LTV (Financiación)</p>
                <p className="text-lg font-semibold text-emerald-900">{ltv}%</p>
              </div>
              <div>
                <p className="text-emerald-600">Plazo</p>
                <p className="text-lg font-semibold text-emerald-900">{formData.termYears} años</p>
              </div>
            </div>
            {isPurchase && (
              <div className="pt-3 border-t border-emerald-200">
                <p className="text-sm text-emerald-700">
                  <strong>Ahorro total recomendado:</strong>{' '}
                  {formatCurrency(totalSavingsNeeded)} (entrada + gastos aproximados)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
