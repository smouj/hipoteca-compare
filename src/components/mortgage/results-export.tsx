'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FormData, 
  Borrower, 
  ScoredOffer, 
  ComparisonContext,
  MORTGAGE_TYPE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  MARITAL_STATUS_LABELS,
} from '@/types/mortgage';
import { formatCurrency } from '@/lib/calculations';
import { 
  Download, Copy, CheckCircle, FileText, Users, Building, 
  EuroIcon, Calendar, Briefcase, Sparkles, AlertCircle
} from 'lucide-react';

interface ResultsExportProps {
  formData: FormData;
  scoredOffers: ScoredOffer[];
  comparisonContext: ComparisonContext;
}

export function ResultsExport({ formData, scoredOffers, comparisonContext }: ResultsExportProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, scoredOffers, comparisonContext }),
      });

      if (!response.ok) throw new Error('Error generando PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe-hipoteca-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateAIPrompt = (): string => {
    const borrowers = formData.borrowers || [];
    const bestOffer = scoredOffers[0];
    
    let prompt = `# CONSULTA HIPOTECA - ESPAÑA\n\n`;
    prompt += `*Generado automáticamente desde HipotecaCompare el ${new Date().toLocaleDateString('es-ES')}*\n\n`;
    
    // === DATOS DE LA OPERACIÓN ===
    prompt += `## 1. DATOS DE LA OPERACIÓN\n\n`;
    prompt += `- **Tipo de operación:** ${formData.operationType === 'COMPRA' ? 'Compra de vivienda' : formData.operationType === 'REFINANCIACION' ? 'Refinanciación' : 'Subrogación'}\n`;
    prompt += `- **Precio de la vivienda:** ${formatCurrency(formData.propertyPrice)}\n`;
    prompt += `- **Importe del préstamo solicitado:** ${formatCurrency(formData.loanAmount)}\n`;
    prompt += `- **Entrada disponible:** ${formatCurrency(formData.downPayment)} (${((formData.downPayment / formData.propertyPrice) * 100).toFixed(1)}%)\n`;
    prompt += `- **Plazo solicitado:** ${formData.termYears} años\n`;
    prompt += `- **Tipo de vivienda:** ${formData.propertyType === 'VIVIENDA_HABITUAL' ? 'Vivienda habitual' : formData.propertyType === 'SEGUNDA_VIVIENDA' ? 'Segunda vivienda' : 'Obra nueva'}\n`;
    if (formData.propertyLocation) {
      prompt += `- **Ubicación:** ${formData.propertyLocation}\n`;
    }
    prompt += `\n`;
    
    // === DATOS DE LOS TITULARES ===
    prompt += `## 2. DATOS DE LOS TITULARES (${borrowers.length} ${borrowers.length === 1 ? 'titular' : 'titulares'})\n\n`;
    
    borrowers.forEach((borrower, index) => {
      const prefix = borrower.isPrincipal ? 'TITULAR PRINCIPAL' : `COTITULAR ${index}`;
      prompt += `### ${prefix}\n\n`;
      
      if (borrower.fullName) prompt += `- **Nombre:** ${borrower.fullName}\n`;
      if (borrower.age) prompt += `- **Edad:** ${borrower.age} años\n`;
      prompt += `- **Estado civil:** ${MARITAL_STATUS_LABELS[borrower.maritalStatus] || borrower.maritalStatus}\n`;
      if (borrower.dependents > 0) prompt += `- **Personas a cargo:** ${borrower.dependents}\n`;
      
      prompt += `\n**Situación laboral:**\n`;
      prompt += `- **Tipo:** ${EMPLOYMENT_TYPE_LABELS[borrower.employmentType] || borrower.employmentType}\n`;
      if (borrower.companyName) prompt += `- **Empresa:** ${borrower.companyName}\n`;
      if (borrower.jobTitle) prompt += `- **Cargo:** ${borrower.jobTitle}\n`;
      if (borrower.activitySector) prompt += `- **Sector:** ${borrower.activitySector}\n`;
      if (borrower.employmentMonths) prompt += `- **Antigüedad:** ${borrower.employmentMonths} meses\n`;
      
      if (borrower.employmentType === 'AUTONOMO' && borrower.selfEmployedYears) {
        prompt += `- **Años de actividad autónomo:** ${borrower.selfEmployedYears}\n`;
      }
      if (borrower.employmentType === 'FUNCIONARIO' && borrower.civilServantBody) {
        prompt += `- **Cuerpo/Escala:** ${borrower.civilServantBody}\n`;
      }
      
      prompt += `\n**Ingresos:**\n`;
      prompt += `- **Ingresos netos mensuales:** ${formatCurrency(borrower.monthlyNetIncome)}\n`;
      prompt += `- **Pagas extra:** ${borrower.extraPaymentsPerYear} al año\n`;
      prompt += `- **Ingresos anuales:** ${formatCurrency(borrower.annualIncome)}\n`;
      if (borrower.additionalMonthlyIncome > 0) {
        prompt += `- **Ingresos adicionales:** ${formatCurrency(borrower.additionalMonthlyIncome)}/mes`;
        if (borrower.additionalIncomeSource) prompt += ` (${borrower.additionalIncomeSource})`;
        prompt += `\n`;
      }
      
      if (borrower.monthlyDebtPayments > 0 || borrower.availableSavings > 0) {
        prompt += `\n**Situación financiera:**\n`;
        if (borrower.monthlyDebtPayments > 0) {
          prompt += `- **Cuotas de deudas actuales:** ${formatCurrency(borrower.monthlyDebtPayments)}/mes\n`;
        }
        prompt += `- **Ahorros disponibles:** ${formatCurrency(borrower.availableSavings)}\n`;
        if (borrower.otherAssets && borrower.otherAssets > 0) {
          prompt += `- **Otros patrimonios:** ${formatCurrency(borrower.otherAssets)}`;
          if (borrower.otherAssetsDescription) prompt += ` (${borrower.otherAssetsDescription})`;
          prompt += `\n`;
        }
      }
      prompt += `\n`;
    });
    
    // === RESUMEN FINANCIERO ===
    const totalIncome = borrowers.reduce((sum, b) => sum + b.monthlyNetIncome + b.additionalMonthlyIncome, 0);
    const totalDebt = borrowers.reduce((sum, b) => sum + b.monthlyDebtPayments, 0);
    const totalSavings = borrowers.reduce((sum, b) => sum + b.availableSavings, 0);
    
    prompt += `## 3. RESUMEN FINANCIERO\n\n`;
    prompt += `- **Ingresos mensuales totales:** ${formatCurrency(totalIncome)}\n`;
    prompt += `- **Ingresos anuales totales:** ${formatCurrency(totalIncome * 14)}\n`;
    prompt += `- **Cuotas de deudas actuales:** ${formatCurrency(totalDebt)}/mes\n`;
    prompt += `- **Ratio de endeudamiento actual:** ${((totalDebt / totalIncome) * 100).toFixed(1)}%\n`;
    prompt += `- **Ahorros totales:** ${formatCurrency(totalSavings)}\n`;
    prompt += `- **LTV solicitado:** ${((formData.loanAmount / formData.propertyPrice) * 100).toFixed(1)}%\n`;
    prompt += `\n`;
    
    // === PREFERENCIAS ===
    prompt += `## 4. PREFERENCIAS\n\n`;
    prompt += `- **Tipo de interés preferido:** `;
    switch (formData.rateTypePreference) {
      case 'SOLO_FIJA': prompt += `Solo fija\n`; break;
      case 'PREFERENCIA_MIXTA': prompt += `Preferencia mixta\n`; break;
      case 'PREFERENCIA_VARIABLE': prompt += `Preferencia variable\n`; break;
      default: prompt += `Sin preferencia\n`;
    }
    prompt += `- **Tolerancia al riesgo:** ${formData.riskTolerance === 'BAJO' ? 'Bajo' : formData.riskTolerance === 'MEDIO' ? 'Medio' : 'Alto'}\n`;
    prompt += `- **Acepta vinculaciones:** ${formData.acceptLinkedProducts ? 'Sí' : 'No'}\n`;
    prompt += `- **Disponible para cambiar de banco:** ${formData.willingToSwitchBank ? 'Sí' : 'No'}\n`;
    prompt += `\n`;
    
    // === MEJORES OFERTAS ENCONTRADAS ===
    if (scoredOffers.length > 0) {
      prompt += `## 5. MEJORES OFERTAS ENCONTRADAS\n\n`;
      
      scoredOffers.slice(0, 3).forEach((offer, index) => {
        prompt += `### ${index + 1}. ${offer.offer.productName}\n\n`;
        prompt += `- **Banco:** ${offer.offer.bankId.toUpperCase()}\n`;
        prompt += `- **Tipo:** ${MORTGAGE_TYPE_LABELS[offer.offer.mortgageType]}\n`;
        prompt += `- **TIN:** ${offer.offer.rateCondition.tin}%`;
        if (offer.offer.mortgageType === 'VARIABLE') {
          prompt += ` (Euríbor + ${offer.offer.rateCondition.spread}%)`;
        } else if (offer.offer.mortgageType === 'MIXTA') {
          prompt += `\n  - Periodo fijo: ${offer.offer.rateCondition.fixedPeriodYears} años al ${offer.offer.rateCondition.fixedPeriodTin}%`;
          prompt += `\n  - Después: Euríbor + ${offer.offer.rateCondition.variableSpread}%`;
        }
        prompt += `\n`;
        prompt += `- **Cuota mensual estimada:** ${formatCurrency(offer.calculation.monthlyPayment)}\n`;
        prompt += `- **TAE estimada:** ${offer.calculation.tae.toFixed(2)}%\n`;
        prompt += `- **Coste total:** ${formatCurrency(offer.calculation.totalCost)}\n`;
        prompt += `- **Puntuación:** ${offer.totalScore.toFixed(0)}/100\n`;
        if (offer.pros.length > 0) {
          prompt += `- **Ventajas:** ${offer.pros.slice(0, 3).join(', ')}\n`;
        }
        prompt += `\n`;
      });
    }
    
    // === SOLICITUD AL AGENTE ===
    prompt += `---\n\n`;
    prompt += `## CONSULTA PARA EL AGENTE\n\n`;
    prompt += `Por favor, actúa como experto hipotecario en España y ayúdame con:\n\n`;
    prompt += `1. **Análisis del perfil:** ¿Cómo ves mi perfil de solvencia? ¿Hay algún aspecto que pueda mejorar?\n\n`;
    prompt += `2. **Recomendación de hipotecas:** ¿Qué hipotecas del mercado español me recomiendas basándote en mi perfil? Compara con las ofertas que he encontrado.\n\n`;
    prompt += `3. **Negociación:** ¿Qué aspectos puedo negociar con los bancos? ¿Qué bonificaciones debería pedir?\n\n`;
    prompt += `4. **Documentación:** ¿Qué documentación necesito preparar para la solicitud?\n\n`;
    prompt += `5. **Consejos adicionales:** ¿Algún consejo específico para mi situación?\n\n`;
    
    return prompt;
  };

  const copyPromptToClipboard = async () => {
    setIsGeneratingPrompt(true);
    try {
      const prompt = generateAIPrompt();
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 3000);
    } catch (error) {
      console.error('Error copying prompt:', error);
      alert('Error al copiar el prompt. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const borrowers = formData.borrowers || [];
  const totalIncome = borrowers.reduce((sum, b) => sum + b.monthlyNetIncome + b.additionalMonthlyIncome, 0);
  const totalDebt = borrowers.reduce((sum, b) => sum + b.monthlyDebtPayments, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Exportar y compartir
        </CardTitle>
        <CardDescription>
          Genera un informe PDF completo o un prompt para consultar con un agente de IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{borrowers.length}</p>
            <p className="text-xs text-slate-500">Titulares</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <EuroIcon className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(formData.loanAmount)}</p>
            <p className="text-xs text-slate-500">Préstamo</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formData.termYears}</p>
            <p className="text-xs text-slate-500">Años</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Building className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{scoredOffers.length}</p>
            <p className="text-xs text-slate-500">Ofertas</p>
          </div>
        </div>

        <Separator />

        {/* Export Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* PDF Export */}
          <Card className="border-slate-200 hover:border-emerald-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Informe PDF</h4>
                  <p className="text-sm text-slate-500 mb-3">
                    Documento completo con todos los datos, ofertas y análisis
                  </p>
                  <Button 
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Prompt */}
          <Card className="border-slate-200 hover:border-blue-300 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">Prompt para IA</h4>
                  <p className="text-sm text-slate-500 mb-3">
                    Genera un prompt profesional con tus datos para consultar con cualquier IA
                  </p>
                  <Button 
                    onClick={copyPromptToClipboard}
                    disabled={isGeneratingPrompt}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {promptCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Nota:</strong> Los datos contenidos en estos documentos son informativos y basados en las condiciones de mercado en el momento de la consulta. 
            Las condiciones finales pueden variar según el análisis de riesgo de cada banco.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
