'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserScenario, ScoredOffer, CompareMortgagesResponse, FormData, ComparisonContext } from '@/types/mortgage';
import { FormWizard } from '@/components/mortgage/form-wizard';
import { ResultsList } from '@/components/mortgage/results-list';
import { ResultsExport } from '@/components/mortgage/results-export';
import { ChatAssistant } from '@/components/mortgage/chat-assistant';
import { ErrorAlert } from '@/components/mortgage/error-alert';
import { CURRENT_EURIBOR } from '@/lib/calculations';
import { 
  Building2, 
  Calculator, 
  Shield, 
  TrendingUp, 
  ChevronLeft,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [results, setResults] = useState<ScoredOffer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [comparisonContext, setComparisonContext] = useState<ComparisonContext | null>(null);

  const handleSubmit = async (scenario: UserScenario) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userScenario: scenario }),
      });

      const data = await response.json() as CompareMortgagesResponse;

      if (!data.success) {
        setError(data.error || 'Error al procesar la solicitud');
        return;
      }

      if (data.data?.scoredOffers) {
        setResults(data.data.scoredOffers);
        setComparisonContext(data.data.comparisonContext);
        setFormData({
          ...scenario,
          borrowers: scenario.borrowerProfile.borrowers || [],
          propertyPrice: scenario.propertyDetails.price,
          propertyLocation: scenario.propertyDetails.location || '',
          propertyType: scenario.propertyDetails.propertyType,
          loanAmount: scenario.loanAmount,
          downPayment: scenario.propertyDetails.price - scenario.loanAmount,
          termYears: scenario.termYears,
          employmentType: scenario.borrowerProfile.employmentType,
          employmentMonths: scenario.borrowerProfile.employmentMonths || 0,
          monthlyIncome: scenario.borrowerProfile.monthlyIncome,
          additionalIncome: scenario.borrowerProfile.additionalIncome || 0,
          extraPaymentsPerYear: scenario.borrowerProfile.extraPaymentsPerYear,
          monthlyDebtPayments: scenario.borrowerProfile.monthlyDebtPayments,
          availableSavings: scenario.borrowerProfile.availableSavings,
          age: scenario.borrowerProfile.age,
          numberOfBorrowers: scenario.borrowerProfile.numberOfBorrowers,
          coBorrowerIncome: scenario.borrowerProfile.coBorrowerIncome || 0,
          coBorrowerAge: scenario.borrowerProfile.coBorrowerAge || 0,
          coBorrowerEmploymentType: scenario.borrowerProfile.coBorrowerEmploymentType || 'INDEFINIDO',
          rateTypePreference: scenario.preferences.rateTypePreference,
          riskTolerance: scenario.preferences.riskTolerance,
          acceptLinkedProducts: scenario.preferences.acceptLinkedProducts,
          existingProducts: scenario.preferences.existingProducts,
          desiredTermYears: scenario.preferences.desiredTermYears,
          prioritizeLowPayment: scenario.preferences.prioritizeLowPayment,
          willingToSwitchBank: scenario.preferences.willingToSwitchBank,
        } as FormData);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setComparisonContext(null);
  };

  const handleStepChange = (step: number, data: FormData) => {
    setCurrentStep(step);
    setFormData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">HipotecaCompare</h1>
                <p className="text-xs text-slate-500">Comparador de hipotecas en España</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Datos verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600" />
                <span>Cálculo preciso</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Asistente AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Results View */}
        {results && results.length > 0 && formData && comparisonContext ? (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver al formulario
            </Button>
            
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Exportar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="mt-6">
                <ResultsList 
                  scoredOffers={results} 
                  onReset={handleReset} 
                />
              </TabsContent>
              
              <TabsContent value="export" className="mt-6">
                <ResultsExport
                  formData={formData}
                  scoredOffers={results}
                  comparisonContext={comparisonContext}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Encuentra la mejor hipoteca para ti
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Compara las mejores hipotecas del mercado español. 
                Análisis personalizado con más de 20 ofertas de los principales bancos.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="border-slate-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <Calculator className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Cálculo preciso</h3>
                      <p className="text-xs text-slate-500">TAE real y escenarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Scoring inteligente</h3>
                      <p className="text-xs text-slate-500">Personalizado para ti</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Shield className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Datos verificados</h3>
                      <p className="text-xs text-slate-500">Fuentes oficiales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Asistente AI</h3>
                      <p className="text-xs text-slate-500">Resuelve tus dudas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Alert */}
            {error && (
              <ErrorAlert error={error} />
            )}

            {/* Form Wizard */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-6">
                <FormWizard 
                  onSubmit={handleSubmit} 
                  isLoading={isLoading}
                  onStepChange={handleStepChange}
                />
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-4">
                Comparamos ofertas de los principales bancos en España
              </p>
              <div className="flex flex-wrap justify-center gap-3 opacity-60">
                {['Santander', 'BBVA', 'CaixaBank', 'Bankinter', 'Sabadell', 'ING'].map((bank) => (
                  <div 
                    key={bank}
                    className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-600"
                  >
                    {bank}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    ¿Cómo funciona?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">1.</span>
                      Introduce los datos de tu operación y perfil financiero
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">2.</span>
                      Personaliza tus preferencias de tipo de interés
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">3.</span>
                      Recibe un análisis personalizado con puntuaciones
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">4.</span>
                      Compara y elige la mejor opción para ti
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-slate-50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    ¿Qué analizamos?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      Coste económico (cuota, TAE, coste total)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      Flexibilidad (amortización, portabilidad)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      Transparencia (comisiones, vinculaciones)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">✓</span>
                      Solidez del banco y ajuste a tu perfil
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-white">HipotecaCompare</span>
              </div>
              <p className="text-sm">
                Comparador independiente de hipotecas en España.
                Datos actualizados mensualmente.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Aviso legal</h4>
              <p className="text-sm">
                Los datos mostrados son informativos. Las condiciones finales
                pueden variar según el perfil del solicitante y las políticas
                de cada entidad bancaria.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Fuentes</h4>
              <p className="text-sm">
                Datos obtenidos de las webs oficiales de los bancos,
                Banco de España y comparadores financieros autorizados.
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm">
            <p>
              © {new Date().getFullYear()} HipotecaCompare. 
              Comparador de hipotecas en España.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat Assistant */}
      <ChatAssistant 
        currentStep={currentStep !== null ? `Paso ${currentStep + 1} de 5` : undefined}
        formData={formData as unknown as Record<string, unknown>}
        resultsCount={results?.length}
      />
    </div>
  );
}
