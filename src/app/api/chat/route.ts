import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// System prompt for the mortgage assistant
const SYSTEM_PROMPT = `Eres un asistente experto en hipotecas en España. Tu nombre es HipotecaBot y trabajas para HipotecaCompare.

Tu función es ayudar a los usuarios a entender:
- Tipos de hipotecas (fija, variable, mixta)
- Cómo funcionan los tipos de interés (TIN, TAE, Euríbor)
- Comisiones habituales (apertura, amortización anticipada, subrogación)
- Productos vinculados (nómina, seguros, planes de pensiones)
- Requisitos para conseguir una hipoteca
- Qué es el LTV y cómo afecta
- Diferencias entre bancos españoles

Reglas importantes:
1. Sé claro y conciso, pero explica los conceptos de forma que cualquiera pueda entenderlos
2. Cuando hables de tipos o comisiones, menciona rangos típicos del mercado español actual
3. Recomienda que el usuario compare ofertas específicas usando el comparador
4. Nunca des consejo financiero personalizado como si fueras un asesor regulado
5. Si no sabes algo, dilo honestamente
6. Usa un tono profesional pero cercano
7. Responde siempre en español

Datos actuales del mercado (Marzo 2026):
- Euríbor actual: ~2.5%
- Hipotecas fijas: desde 2.3% TIN
- Hipotecas variables: Euríbor + 0.65% a 0.90%
- Hipotecas mixtas: 1.3% a 2.1% durante periodo fijo

Bancos principales en España: Santander, BBVA, CaixaBank, Bankinter, Sabadell, Unicaja, Ibercaja, Kutxabank, Abanca, ING.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body as { 
      messages: ChatMessage[]; 
      context?: {
        currentStep?: string;
        formData?: Record<string, unknown>;
        resultsCount?: number;
      };
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Se requiere un array de mensajes' },
        { status: 400 }
      );
    }

    // Initialize ZAI
    const zai = await ZAI.create();

    // Build context-aware system prompt
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    
    if (context) {
      enhancedSystemPrompt += '\n\n--- CONTEXTO ACTUAL DEL USUARIO ---';
      
      if (context.currentStep) {
        enhancedSystemPrompt += `\nEl usuario está en el paso: ${context.currentStep}`;
      }
      
      if (context.formData) {
        const fd = context.formData;
        if (fd.propertyPrice) {
          enhancedSystemPrompt += `\nPrecio propiedad: ${fd.propertyPrice}€`;
        }
        if (fd.loanAmount) {
          enhancedSystemPrompt += `\nImporte préstamo: ${fd.loanAmount}€`;
        }
        if (fd.termYears) {
          enhancedSystemPrompt += `\nPlazo: ${fd.termYears} años`;
        }
        if (fd.monthlyIncome) {
          enhancedSystemPrompt += `\nIngresos mensuales: ${fd.monthlyIncome}€`;
        }
      }
      
      if (context.resultsCount !== undefined) {
        enhancedSystemPrompt += `\nResultados mostrados: ${context.resultsCount} hipotecas`;
      }
      
      enhancedSystemPrompt += '\nUsa este contexto para personalizar tu respuesta si es relevante.';
    }

    // Build messages array for the API
    const apiMessages = [
      { role: 'system' as const, content: enhancedSystemPrompt },
      ...messages.filter(m => m.role !== 'system').slice(-10) // Keep last 10 messages for context
    ];

    // Call the AI
    const completion = await zai.chat.completions.create({
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      'Lo siento, no pude procesar tu pregunta. Por favor, inténtalo de nuevo.';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la consulta. Por favor, inténtalo de nuevo.',
        success: false 
      },
      { status: 500 }
    );
  }
}
