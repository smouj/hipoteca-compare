# 🏠 HipotecaCompare

[![GitHub stars](https://img.shields.io/github/stars/smouj/hipoteca-compare?style=social)](https://github.com/smouj/hipoteca-compare)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg)](https://tailwindcss.com/)

> **Comparador profesional de hipotecas en España con asistente AI integrado**

Una aplicación web completa para analizar y comparar ofertas hipotecarias de los principales bancos españoles, con un motor de cálculo financiero preciso y un sistema de scoring inteligente.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Demo](#demo)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Sistema de Scoring](#sistema-de-scoring)
- [Asistente AI](#asistente-ai-hipotecabot)
- [Bancos Incluidos](#bancos-incluidos)
- [API Endpoints](#api-endpoints)
- [Limitaciones](#limitaciones)
- [Aviso Legal](#aviso-legal)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## ✨ Características

### Motor de Cálculo Financiero
- **Sistema de amortización francés** - Cuota mensual precisa
- **Cálculo de TAE** - Siguiendo la normativa del Banco de España
- **Escenarios múltiples** - Base, conservador y adverso para hipotecas variables/mixtas
- **Proyección de costes totales** - Intereses, comisiones y coste total del préstamo

### Sistema de Scoring Inteligente
- **5 factores ponderados** - Coste económico, flexibilidad, transparencia, solidez y ajuste al perfil
- **Personalización dinámica** - Los pesos se ajustan según el perfil de riesgo del usuario
- **Explicabilidad completa** - Cada puntuación incluye justificación detallada

### Asistente AI (HipotecaBot)
- **Chat contextualizado** - Conoce el paso actual del formulario y los datos introducidos
- **Respuestas expertas** - Información sobre tipos de hipotecas, Euríbor, comisiones, requisitos
- **Preguntas frecuentes** - Acceso rápido a consultas habituales

### Interfaz de Usuario
- **Formulario multi-paso** - 5 pasos con validación en tiempo real
- **Persistencia local** - Los datos se guardan automáticamente en el navegador
- **Diseño responsive** - Optimizado para móvil, tablet y escritorio
- **Exportación CSV** - Descarga los resultados para análisis offline

---

## 🎮 Demo

La aplicación está disponible en el panel de preview. Puedes:

1. Completar el formulario de 5 pasos
2. Recibir resultados ordenados por puntuación
3. Expandir cada oferta para ver el desglose del scoring
4. Usar el chat AI para resolver dudas

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+ o Bun
- npm, yarn, pnpm o bun

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/smouj/hipoteca-compare.git
cd hipoteca-compare

# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
bun run dev      # Servidor de desarrollo
bun run build    # Build de producción
bun run lint     # Verificación de código
bun run start    # Servidor de producción
```

---

## 📖 Uso

### Flujo Principal

1. **Paso 1 - Operación**: Selecciona tipo de operación (compra, refinanciación, subrogación) y datos de la propiedad
2. **Paso 2 - Préstamo**: Define importe del préstamo, entrada y plazo (máx. 30 años)
3. **Paso 3 - Perfil**: Introduce situación laboral, ingresos, edad y ahorros
4. **Paso 4 - Preferencias**: Personaliza preferencias de tipo de interés y riesgo
5. **Paso 5 - Resumen**: Revisa y confirma los datos

### Resultados

- Ofertas ordenadas por puntuación total
- Desglose detallado de cada factor de scoring
- Pros y contras específicos para tu perfil
- Alertas y advertencias sobre condiciones
- Opción de exportar a CSV

### Diagnóstico de Rechazos

Si no hay resultados, la aplicación muestra:
- **Motivo principal** del rechazo
- **Sugerencias concretas** para ajustar los parámetros
- **Análisis detallado** de cuántas ofertas cayeron por cada razón

---

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── page.tsx                 # Página principal con formulario y resultados
│   ├── layout.tsx               # Layout raíz
│   └── api/
│       ├── compare/route.ts     # API de comparación con diagnóstico
│       └── chat/route.ts        # API del asistente AI
├── components/
│   ├── ui/                      # Componentes shadcn/ui (40+ componentes)
│   └── mortgage/
│       ├── form-wizard.tsx      # Wizard multi-paso
│       ├── step-operation.tsx   # Paso 1: Operación
│       ├── step-loan.tsx        # Paso 2: Préstamo
│       ├── step-borrower.tsx    # Paso 3: Perfil
│       ├── step-preferences.tsx # Paso 4: Preferencias
│       ├── step-summary.tsx     # Paso 5: Resumen
│       ├── offer-card.tsx       # Tarjeta de oferta
│       ├── results-list.tsx     # Lista de resultados
│       ├── score-breakdown.tsx  # Desglose de puntuación
│       ├── error-alert.tsx      # Alertas de error detalladas
│       └── chat-assistant.tsx   # Asistente AI
├── lib/
│   ├── calculations.ts          # Motor de cálculos financieros
│   ├── scoring.ts               # Sistema de scoring ponderado
│   ├── utils.ts                 # Utilidades generales
│   └── adapters/
│       ├── banks.ts             # Datos de 10 bancos españoles
│       └── offers.ts            # Catálogo de 20+ ofertas hipotecarias
└── types/
    └── mortgage.ts              # Definiciones TypeScript completas
```

---

## 📊 Sistema de Scoring

Cada oferta se puntúa según 5 factores ponderados:

| Factor | Peso Base | Descripción |
|--------|-----------|-------------|
| 💰 Coste económico | 40% | Cuota mensual, TAE, coste total relativo a otras ofertas |
| 🔄 Flexibilidad | 20% | Amortización anticipada, portabilidad, carencia |
| 🔍 Transparencia | 15% | Comisiones claras, productos vinculados, nivel de confianza |
| 🏦 Solidez del banco | 15% | Tamaño por activos, rating crediticio, red de oficinas |
| 👤 Ajuste al perfil | 10% | Coincidencia con preferencias personales del usuario |

### Ajustes Dinámicos

Los pesos se ajustan según:
- **Tolerancia al riesgo**: Perfiles conservadores priorizan coste; perfiles arriesgados priorizan flexibilidad
- **Preferencia de cuota baja**: Aumenta el peso del coste económico

---

## 🤖 Asistente AI (HipotecaBot)

### Capacidades
- Explicar tipos de hipotecas (fija, variable, mixta)
- Informar sobre el Euríbor y su impacto
- Aclarar términos financieros (TAE, TIN, LTV)
- Orientar sobre requisitos y comisiones
- Sugerir según el contexto del usuario

### Uso
Haz clic en el botón verde 💬 en la esquina inferior derecha para abrir el chat.

---

## 🏦 Bancos Incluidos

| Banco | Tipo | Ofertas | LTV Máx |
|-------|------|---------|---------|
| Banco Santander | Tradicional | Fija, Variable, Mixta, Sin Entrada | 90% |
| BBVA | Tradicional | Fija, Variable, Mixta, Sin Entrada | 95% |
| CaixaBank | Tradicional | Fija, Mixta, Hipoteca Joven | 95% |
| Bankinter | Tradicional | Fija, Variable, Mixta, Alto LTV | 90% |
| Banco Sabadell | Tradicional | Fija, Mixta | 80% |
| Unicaja Banco | Tradicional | Fija, Mixta | 80% |
| Ibercaja | Regional | Fija, Mixta | 80% |
| Kutxabank | Regional | - | 80% |
| Abanca | Regional | Fija | 80% |
| ING | Online | Fija, Mixta, Sin Entrada | 90% |

### Financiación Alta (LTV > 80%)

Disponemos de **5 ofertas específicas** para financiación superior al 80%:
- Hipotecas sin entrada (hasta 95% LTV)
- Hipoteca Joven para menores de 35 años (hasta 95%)
- Ofertas con seguro de impago obligatorio
- Tipos ligeramente superiores (+0.2-0.4%)

---

## 🔌 API Endpoints

### POST /api/compare
Compara hipotecas según el escenario del usuario.

**Request:**
```json
{
  "userScenario": {
    "loanAmount": 200000,
    "termYears": 25,
    "propertyDetails": { "price": 250000 },
    "borrowerProfile": {
      "monthlyIncome": 3000,
      "age": 35
    }
  }
}
```

**Response (éxito):**
```json
{
  "success": true,
  "data": {
    "scoredOffers": [...],
    "comparisonContext": {...}
  }
}
```

**Response (sin resultados):**
```json
{
  "success": false,
  "error": "Mensaje con motivo principal, sugerencias y análisis detallado"
}
```

### GET /api/compare
Obtiene información del catálogo y restricciones.

### POST /api/chat
Chat con el asistente AI.

---

## ⚠️ Limitaciones

### Datos
- Los tipos de interés son orientativos y pueden variar
- Las condiciones finales dependen del perfil completo del solicitante
- No se incluyen ofertas de todos los bancos del mercado español
- Las ofertas de alto LTV (>80%) están marcadas como ESTIMATED

### Técnico
- Plazo máximo soportado: 30 años (restricción del catálogo actual)
- LTV máximo: 100% permitido en el formulario, 95% en ofertas disponibles
- Sin autenticación de usuario (persistencia solo en localStorage)
- Ofertas alto LTV requieren perfil solvente (ingresos > 2500€/mes)

---

## ⚖️ Aviso Legal

**Importante**: Esta aplicación es una herramienta de información y análisis orientativo.

- No constituye asesoramiento financiero regulado
- Las condiciones mostradas pueden variar según:
  - Perfil financiero completo del solicitante
  - Políticas de riesgo de cada entidad
  - Negociación individual con el banco
  - Cambios en el mercado hipotecario

**Consulta con un profesional** (asesor financiero, gestor hipotecario) antes de tomar decisiones.

### Fuentes de Datos
- Webs oficiales de los bancos
- Banco de España
- Comparadores financieros autorizados

**Datos actualizados**: Marzo 2026

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Hecho con ❤️ para el mercado hipotecario español
</p>
