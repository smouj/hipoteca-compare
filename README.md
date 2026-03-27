# HipotecaCompare

[![GitHub stars](https://img.shields.io/github/stars/smouj/hipoteca-compare?style=social)](https://github.com/smouj/hipoteca-compare)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Comparador profesional de hipotecas en España con asistente AI integrado. Aplicación web para analizar y comparar ofertas hipotecarias de los principales bancos españoles.

## Características

- **Motor de cálculos financieros**: Sistema de amortización francés, cálculo de TAE, escenarios variables
- **Scoring inteligente**: Puntuación compuesta con factores ponderados (coste, flexibilidad, transparencia, solidez)
- **Asistente AI (HipotecaBot)**: Chat integrado para resolver dudas sobre hipotecas en tiempo real
- **Formulario multi-paso**: Wizard interactivo con validación y persistencia local
- **20+ ofertas hipotecarias**: Datos de 10 bancos españoles principales
- **Análisis de escenarios**: Proyecciones para hipotecas variables y mixtas (base, conservador, adverso)
- **Diseño responsive**: Optimizado para móvil, tablet y escritorio

## Bancos incluidos

- Banco Santander
- BBVA
- CaixaBank
- Bankinter
- Banco Sabadell
- Unicaja Banco
- Ibercaja
- Kutxabank
- Abanca
- ING

## Stack tecnológico

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Estado**: React hooks + localStorage

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                 # Página principal
│   ├── layout.tsx               # Layout raíz
│   └── api/compare/route.ts     # API de comparación
├── components/
│   ├── ui/                      # Componentes shadcn/ui
│   └── mortgage/                # Componentes específicos
│       ├── form-wizard.tsx      # Wizard multi-paso
│       ├── step-operation.tsx   # Paso 1: Operación
│       ├── step-loan.tsx        # Paso 2: Préstamo
│       ├── step-borrower.tsx    # Paso 3: Perfil
│       ├── step-preferences.tsx # Paso 4: Preferencias
│       ├── step-summary.tsx     # Paso 5: Resumen
│       ├── offer-card.tsx       # Tarjeta de oferta
│       ├── results-list.tsx     # Lista de resultados
│       ├── score-breakdown.tsx  # Desglose de puntuación
│       └── chat-assistant.tsx   # Asistente AI
├── lib/
│   ├── calculations.ts          # Motor de cálculos
│   ├── scoring.ts               # Sistema de scoring
│   └── adapters/
│       ├── banks.ts             # Datos de bancos
│       └── offers.ts            # Ofertas hipotecarias
└── types/
    └── mortgage.ts              # Definiciones de tipos
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/smouj/hipoteca-compare.git
cd hipoteca-compare

# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev
```

## Uso

1. Accede a la aplicación en `http://localhost:3000`
2. Completa el formulario de 5 pasos:
   - Tipo de operación y propiedad
   - Importe y plazo del préstamo
   - Perfil del solicitante
   - Preferencias de tipo de interés
   - Revisión y cálculo
3. Revisa los resultados ordenados por puntuación
4. Filtra y compara las ofertas
5. Exporta los resultados a CSV si lo deseas

## Asistente AI (HipotecaBot)

La aplicación incluye un asistente AI integrado que puede ayudarte con:

- Explicaciones sobre tipos de hipotecas (fija, variable, mixta)
- Información sobre el Euríbor y cómo afecta a tu hipoteca
- Dudas sobre comisiones y productos vinculados
- Requisitos para conseguir una hipoteca en España
- Qué es el LTV, TAE y otros términos financieros

El asistente está contextualizado y conoce:
- El paso actual del formulario donde estás
- Los datos que has introducido
- Los resultados de la comparación

Para usarlo, haz clic en el botón verde de chat en la esquina inferior derecha.

## Sistema de scoring

Cada oferta se puntúa según 5 factores:

| Factor | Peso | Descripción |
|--------|------|-------------|
| Coste económico | 40% | Cuota mensual, TAE, coste total |
| Flexibilidad | 20% | Amortización anticipada, portabilidad |
| Transparencia | 15% | Comisiones claras, vinculaciones |
| Solidez del banco | 15% | Tamaño, rating, red de oficinas |
| Ajuste al perfil | 10% | Preferencias personales del usuario |

## Aviso legal

Esta aplicación es una herramienta de información y análisis. Los datos mostrados son orientativos y pueden variar. Las condiciones finales dependen de:
- Perfil financiero del solicitante
- Políticas de riesgo de cada entidad
- Negociación individual
- Cambios en el mercado

**No constituye asesoramiento financiero regulado.** Consulta con un profesional antes de tomar decisiones.

## Fuentes de datos

- Webs oficiales de los bancos
- Banco de España
- Comparadores financieros autorizados

Datos actualizados: Marzo 2026

## Licencia

MIT License - Ver archivo LICENSE para más detalles.
