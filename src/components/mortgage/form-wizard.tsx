'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FormData, DEFAULT_FORM_DATA, UserScenario, PropertyDetails, BorrowerProfile, MortgagePreferences, OperationType, PropertyType, createDefaultBorrower } from '@/types/mortgage';
import { StepOperation } from './step-operation';
import { StepLoan } from './step-loan';
import { StepBorrower } from './step-borrower';
import { StepPreferences } from './step-preferences';
import { StepSummary } from './step-summary';
import { ChevronLeft, ChevronRight, Calculator, RotateCcw, Home, CreditCard, User, Settings, FileCheck } from 'lucide-react';

interface FormWizardProps {
  onSubmit: (scenario: UserScenario) => void;
  isLoading: boolean;
  onStepChange?: (step: number, formData: FormData) => void;
}

const STEPS = [
  { id: 'operation', title: 'Operación', description: 'Tipo y propiedad', icon: Home },
  { id: 'loan', title: 'Préstamo', description: 'Importe y plazo', icon: CreditCard },
  { id: 'borrower', title: 'Perfil', description: 'Datos personales', icon: User },
  { id: 'preferences', title: 'Preferencias', description: 'Personalización', icon: Settings },
  { id: 'summary', title: 'Resumen', description: 'Confirmar datos', icon: FileCheck },
];

const STORAGE_KEY = 'hipoteca-compare-form-data';

// Helper function to load saved form data
function loadSavedFormData(): FormData {
  if (typeof window === 'undefined') return { ...DEFAULT_FORM_DATA, borrowers: [createDefaultBorrower(1)] };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as FormData;
      if (parsed && typeof parsed.propertyPrice === 'number') {
        // Ensure borrowers array exists
        if (!parsed.borrowers || parsed.borrowers.length === 0) {
          parsed.borrowers = [createDefaultBorrower(1)];
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load saved form data:', e);
  }
  return { ...DEFAULT_FORM_DATA, borrowers: [createDefaultBorrower(1)] };
}

export function FormWizard({ onSubmit, isLoading, onStepChange }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(loadSavedFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Save to localStorage when formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save form data:', e);
    }
  }, [formData]);

  // Notify parent of step and data changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep, formData);
    }
  }, [currentStep, formData, onStepChange]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete clearedErrors[key];
    });
    setErrors(clearedErrors);
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Operation
        if (!formData.operationType) {
          newErrors.operationType = 'Selecciona el tipo de operación';
        }
        if (formData.propertyPrice <= 0) {
          newErrors.propertyPrice = 'Introduce el precio de la propiedad';
        }
        break;
      case 1: // Loan
        if (formData.loanAmount <= 0) {
          newErrors.loanAmount = 'Introduce el importe del préstamo';
        }
        if (formData.downPayment < 0) {
          newErrors.downPayment = 'La entrada no puede ser negativa';
        }
        if (formData.termYears <= 0 || formData.termYears > 40) {
          newErrors.termYears = 'Selecciona un plazo válido (1-40 años)';
        }
        break;
      case 2: // Borrower
        // Validate using borrowers array if available
        const borrowers = formData.borrowers || [];
        if (borrowers.length === 0) {
          newErrors.borrowers = 'Debes añadir al menos un titular';
        } else {
          const principalBorrower = borrowers.find(b => b.isPrincipal) || borrowers[0];
          if (!principalBorrower.employmentType) {
            newErrors.employmentType = 'Selecciona tu situación laboral';
          }
          if (principalBorrower.monthlyNetIncome <= 0) {
            newErrors.monthlyIncome = 'Introduce tus ingresos mensuales';
          }
          if (!principalBorrower.age || principalBorrower.age < 18 || principalBorrower.age > 80) {
            newErrors.age = 'La edad debe estar entre 18 y 80 años';
          }
          if (principalBorrower.availableSavings <= 0) {
            newErrors.availableSavings = 'Introduce tus ahorros disponibles';
          }
        }
        break;
      case 3: // Preferences
        // No required validation
        break;
      case 4: // Summary
        // All previous validations apply
        return validateStep(0) && validateStep(1) && validateStep(2);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Calculate totals from borrowers array
      const borrowers = formData.borrowers || [];
      const totalMonthlyIncome = borrowers.reduce((sum, b) => sum + b.monthlyNetIncome + (b.additionalMonthlyIncome || 0), 0);
      const totalAdditionalIncome = borrowers.reduce((sum, b) => sum + (b.additionalMonthlyIncome || 0), 0);
      const totalDebtPayments = borrowers.reduce((sum, b) => sum + b.monthlyDebtPayments, 0);
      const totalSavings = borrowers.reduce((sum, b) => sum + b.availableSavings, 0);
      const principalBorrower = borrowers.find(b => b.isPrincipal) || borrowers[0];
      const otherBorrowers = borrowers.filter(b => !b.isPrincipal);
      
      // Convert FormData to UserScenario
      const scenario: UserScenario = {
        operationType: formData.operationType,
        propertyDetails: {
          price: formData.propertyPrice,
          location: formData.propertyLocation,
          propertyType: formData.propertyType,
        } as PropertyDetails,
        borrowerProfile: {
          employmentType: principalBorrower?.employmentType || formData.employmentType,
          employmentMonths: principalBorrower?.employmentMonths || formData.employmentMonths,
          monthlyIncome: principalBorrower?.monthlyNetIncome || formData.monthlyIncome,
          additionalIncome: totalAdditionalIncome || formData.additionalIncome,
          extraPaymentsPerYear: principalBorrower?.extraPaymentsPerYear || formData.extraPaymentsPerYear,
          monthlyDebtPayments: totalDebtPayments || formData.monthlyDebtPayments,
          availableSavings: totalSavings || formData.availableSavings,
          age: principalBorrower?.age || formData.age,
          numberOfBorrowers: borrowers.length,
          coBorrowerIncome: otherBorrowers.reduce((sum, b) => sum + b.monthlyNetIncome, 0) || formData.coBorrowerIncome,
          coBorrowerAge: otherBorrowers[0]?.age || formData.coBorrowerAge,
          coBorrowerEmploymentType: otherBorrowers[0]?.employmentType || formData.coBorrowerEmploymentType,
          borrowers: borrowers,
        } as BorrowerProfile,
        preferences: {
          rateTypePreference: formData.rateTypePreference,
          riskTolerance: formData.riskTolerance,
          acceptLinkedProducts: formData.acceptLinkedProducts,
          existingProducts: formData.existingProducts,
          desiredTermYears: formData.desiredTermYears,
          prioritizeLowPayment: formData.prioritizeLowPayment,
          willingToSwitchBank: formData.willingToSwitchBank,
        } as MortgagePreferences,
        loanAmount: formData.loanAmount,
        termYears: formData.termYears,
        createdAt: new Date().toISOString(),
      };

      onSubmit(scenario);
    }
  };

  const handleReset = () => {
    const freshData = { ...DEFAULT_FORM_DATA, borrowers: [createDefaultBorrower(1)] };
    setFormData(freshData);
    setCurrentStep(0);
    setErrors({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepOperation
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 1:
        return (
          <StepLoan
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <StepBorrower
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <StepPreferences
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <StepSummary
            formData={formData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {STEPS[currentStep]?.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Empezar de nuevo
          </Button>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-2" />

        {/* Step indicators */}
        <div className="flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (index <= currentStep || validateStep(currentStep)) {
                    setCurrentStep(index);
                  }
                }}
                disabled={index > currentStep + 1}
                className={`flex flex-col items-center gap-1 transition-all ${
                  index > currentStep + 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-white border-emerald-500 text-emerald-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 min-w-[160px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Calculando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Calcular ofertas
              </>
            )}
          </Button>
        )}
      </div>

      {/* Step description */}
      <p className="text-center text-sm text-slate-500">
        Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep]?.description}
      </p>
    </div>
  );
}
