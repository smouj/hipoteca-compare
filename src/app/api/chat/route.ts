import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    currentStep?: string;
    formData?: Record<string, unknown>;
    resultsCount?: number;
  };
}

// System prompt for the mortgage assistant
const SYSTEM_PROMPT = `Eres HipotecaBot, un asistente experto en hipotecas en España. Tu objetivo es ayudar a los usuarios a entender mejor las opciones de financiación hipotecaria.

Conocimientos clave:
- Tipos de hipotecas: fija, variable, mixta
- TAE (Tasa Anual Equivalente) y TIN (Tipo de Interés Nominal)
- Euríbor y su impacto en hipotecas variables
- LTV (Loan to Value) - ratio préstamo/valor
- Vinculaciones típicas: nómina, seguros, plan de pensiones
- Comisiones: apertura, amortización anticipada, subrogación
- Gastos de compraventa: ITP, IVA, notaría, registro
- Requisitos típicos: ingresos, estabilidad laboral, ahorros

Normas de comportamiento:
- Responde de forma clara y concisa en español
- Usa ejemplos numéricos cuando sea útil
- Sé honesto sobre las limitaciones de la información
- Recomienda consultar con entidades financieras para condiciones específicas
- Si el contexto del usuario está disponible, personaliza la respuesta

El contexto actual del usuario puede incluir:
- Paso actual del formulario
- Datos introducidos (importes, plazos, ingresos, etc.)
- Número de resultados de comparación obtenidos`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest;
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Initialize ZAI
    const zai = await ZAI.create();

    // Build context message
    let contextMessage = '';
    if (context) {
      contextMessage = '\n\nContexto del usuario:\n';
      if (context.currentStep) {
        contextMessage += `- Paso actual: ${context.currentStep}\n`;
      }
      if (context.resultsCount !== undefined) {
        contextMessage += `- Ofertas encontradas: ${context.resultsCount}\n`;
      }
      if (context.formData) {
        const fd = context.formData as Record<string, unknown>;
        if (fd.propertyPrice) contextMessage += `- Precio vivienda: ${fd.propertyPrice}€\n`;
        if (fd.loanAmount) contextMessage += `- Importe préstamo: ${fd.loanAmount}€\n`;
        if (fd.termYears) contextMessage += `- Plazo: ${fd.termYears} años\n`;
        if (fd.numberOfBorrowers) contextMessage += `- Titulares: ${fd.numberOfBorrowers}\n`;
      }
    }

    // Build messages for the chat
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT + contextMessage },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Call the AI
    const completion = await zai.chat.completions.create({
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({
      success: true,
      message: responseContent,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la consulta. Por favor, inténtalo de nuevo.' 
      },
      { status: 500 }
    );
  }
}
