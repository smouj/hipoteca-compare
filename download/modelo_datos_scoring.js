const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, PageNumber, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, VerticalAlign, TableOfContents, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

// Color palette - "Midnight Code" for fintech/document style
const colors = {
  primary: "020617",
  body: "1E293B",
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F8FAFC",
  tableHeader: "E2E8F0"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 12, color: colors.secondary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
      { id: "CodeBlock", name: "Code Block", basedOn: "Normal",
        run: { size: 18, font: "Courier New", color: colors.body },
        paragraph: { spacing: { before: 100, after: 100 } } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-main", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-secondary", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-terciary", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-quaternary", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-fifth", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // COVER PAGE
    {
      properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "MODELO DE DATOS Y SISTEMA DE SCORING", bold: true, size: 48, font: "Times New Roman", color: colors.primary })] }),
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Comparador Hipotecario Profesional para España", size: 36, font: "Times New Roman", color: colors.secondary })] }),
        new Paragraph({ spacing: { before: 800 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Definición de entidades TypeScript, esquemas de validación, y algoritmos de puntuación", size: 24, font: "Times New Roman", color: colors.body })] }),
        new Paragraph({ spacing: { before: 2000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Documento de Diseño - Fase 2", size: 22, font: "Times New Roman", color: colors.accent })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "27 de marzo de 2026", size: 22, font: "Times New Roman", color: colors.accent })] }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // MAIN CONTENT
    {
      properties: { page: { margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Modelo de Datos y Scoring - Comparador Hipotecario", size: 18, color: colors.accent })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Página ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " de ", size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })] })] }) },
      children: [
        // TOC
        new TableOfContents("Índice de Contenidos", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nota: Este índice se genera mediante códigos de campo. Para actualizar los números de página, haga clic derecho sobre el índice y seleccione \"Actualizar campo\".", size: 18, color: "999999" })] }),
        new Paragraph({ children: [new PageBreak()] }),
        
        // SECTION 1: INTRODUCTION
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Introducción y Principios de Diseño")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Este documento define el modelo de datos completo y el sistema de scoring para el comparador hipotecario profesional. El diseño sigue principios fundamentales que garantizan la calidad, trazabilidad y mantenibilidad del sistema. En primer lugar, cada entidad debe tener una responsabilidad única y bien definida, evitando la duplicación de información. En segundo lugar, todos los campos que representan datos externos deben incluir metadatos de trazabilidad: fecha de obtención, fuente original y nivel de confianza. En tercer lugar, el modelo debe ser extensible para incorporar nuevas entidades bancarias, productos hipotecarios y criterios de evaluación sin alterar la estructura existente.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El modelo se estructura en cuatro dominios principales que reflejan las diferentes fases del proceso de comparación hipotecaria. El dominio de Perfil de Usuario captura la información del solicitante y sus preferencias. El dominio de Ofertas gestiona los productos hipotecarios disponibles y sus condiciones. El dominio de Cálculo implementa la lógica financiera y simulaciones. Finalmente, el dominio de Resultados almacena las comparaciones y recomendaciones generadas por el sistema.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 2: USER PROFILE DOMAIN
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Dominio de Perfil de Usuario")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Entidad Principal: UserScenario")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "UserScenario representa el caso de uso completo del usuario: quién es, qué busca financiar, y qué preferencias tiene. Esta entidad actúa como aggregate root del dominio de usuario, agrupando todas las entidades relacionadas. El escenario de usuario es inmutable una vez creado; las modificaciones generan una nueva versión con timestamp de actualización. Esto permite mantener un historial de cambios y facilita auditorías.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // UserScenario table
        new Table({
          columnWidths: [2500, 1800, 5060],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "id", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string (UUID)", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Identificador único del escenario", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "operationType", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "COMPRA_HABITUAL, SEGUNDA_RESIDENCIA, INVERSION", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "propertyType", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "NUEVA, USADA", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "province", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Provincia donde se ubica el inmueble", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "propertyPrice", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Precio de compraventa en euros", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "loanAmount", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Importe a financiar solicitado", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "termYears", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Plazo de amortización en años", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "borrowerProfile", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "BorrowerProfile", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Perfil económico del solicitante", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "preferences", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "MortgagePreferences", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Preferencias de tipo de hipoteca", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "existingMortgage", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "ExistingMortgage?", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Hipoteca existente (si aplica)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "createdAt", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Date", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Fecha de creación del escenario", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 1: Campos de la entidad UserScenario", size: 18, italics: true, color: colors.secondary })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Perfil Económico: BorrowerProfile")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "BorrowerProfile captura toda la información económica y personal del solicitante que influye en su elegibilidad y las condiciones que puede obtener. Esta entidad soporta tanto solicitantes individuales como múltiples cotitulares, siendo crucial para calcular el ratio de endeudamiento y la capacidad de pago. La entidad incluye validaciones que garantizan la coherencia de los datos: por ejemplo, la suma de ingresos de todos los titulares debe ser positiva, y las deudas existentes no pueden superar el 100% de los ingresos disponibles.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // BorrowerProfile table
        new Table({
          columnWidths: [2500, 1800, 5060],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "numberOfBorrowers", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number (1-2)", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Número de titulares", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "employmentType", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "ASALARIADO_FIJO, ASALARIADO_TEMPORAL, AUTONOMO, FUNCIONARIO", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "monthlyIncome", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Ingresos netos mensuales totales", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "variableIncome", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Ingresos variables anuales (pagas, bonus)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "seniorityYears", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Años de antigüedad laboral", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "monthlyDebts", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Deudas mensuales existentes", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "availableSavings", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Ahorros disponibles tras la compra", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "hasOtherDebts", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Indica si tiene otras deudas", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "taxResidency", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "RESIDENTE_ESPANA, NO_RESIDENTE", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 2: Campos de la entidad BorrowerProfile", size: 18, italics: true, color: colors.secondary })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Preferencias Hipotecarias: MortgagePreferences")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "MortgagePreferences captura las preferencias del usuario respecto al tipo de hipoteca, su tolerancia al riesgo y su disposición a aceptar vinculaciones. Esta información es crucial para filtrar y ordenar las ofertas de manera relevante. Los campos de tolerancia al riesgo se utilizan para ponderar las hipotecas variables y mixtas en el scoring, mientras que las preferencias de vinculación permiten filtrar ofertas que requieren demasiados productos asociados.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Table({
          columnWidths: [2800, 1800, 4760],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "rateTypePreference", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "FIJA, VARIABLE, MIXTA, INDIFERENTE", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "maxMonthlyPayment", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number?", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Cuota máxima que se siente cómodo pagando", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "riskTolerance", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "BAJO, MEDIO, ALTO", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "prefersLowerInitialPayment", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Prefiere menor cuota inicial sobre menor coste total", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "acceptsPayrollDomicile", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Disposición a domiciliar nómina", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "acceptsInsurance", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Disposición a contratar seguros vinculados", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "acceptsPensionPlan", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Disposición a aportar a plan de pensiones", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "plansEarlyAmortization", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "boolean", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Planea amortizar anticipadamente", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 3: Campos de la entidad MortgagePreferences", size: 18, italics: true, color: colors.secondary })] }),

        // SECTION 3: OFFERS DOMAIN
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Dominio de Ofertas Hipotecarias")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Entidad Principal: MortgageOffer")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "MortgageOffer representa un producto hipotecario específico ofrecido por una entidad financiera. Esta entidad normaliza las condiciones de diferentes bancos en un formato unificado, permitiendo comparaciones objetivas. Cada oferta incluye metadatos de trazabilidad que indican cuándo se obtuvieron los datos y con qué nivel de confianza. Las ofertas son inmutables una vez creadas; las actualizaciones generan nuevas versiones con timestamp actualizado.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Table({
          columnWidths: [2500, 1800, 5060],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "id", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Identificador único de la oferta", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "bankId", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Referencia a la entidad bancaria", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "productName", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Nombre comercial del producto", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "mortgageType", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "FIJA, VARIABLE, MIXTA", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "baseRate", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "RateCondition", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "TIN base sin bonificaciones", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "bonifiedRate", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "RateCondition?", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "TIN con bonificaciones máximas", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "linkedProducts", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "LinkedProduct[]", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Productos vinculados requeridos para bonificación", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "maxLTV", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Financiación máxima (% valor tasación)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "maxTermYears", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "number", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Plazo máximo de amortización", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "commissions", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Commission[]", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Comisiones aplicables", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "source", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "OfferSource", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Metadatos de trazabilidad", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 4: Campos principales de MortgageOffer", size: 18, italics: true, color: colors.secondary })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Condiciones de Tipo: RateCondition")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "RateCondition encapsula las condiciones de tipo de interés, que varían significativamente entre hipotecas fijas, variables y mixtas. Esta entidad permite modelar de forma unificada escenarios como: hipoteca fija al 2,5% durante toda la vida; hipoteca variable Euríbor + 0,75%; o hipoteca mixta con tramo fijo de 5 años al 1,7% y posteriormente Euríbor + 0,65%. La entidad es versátil para representar todos estos casos manteniendo una estructura coherente.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Trazabilidad: OfferSource")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "OfferSource es quizás la entidad más importante para garantizar la transparencia del sistema. Registra el origen de cada dato, cuándo se obtuvo, y con qué nivel de confianza. Esta información se muestra al usuario final, permitiéndole evaluar la fiabilidad de cada oferta. Los niveles de confianza permiten comunicar claramente qué datos han sido verificados directamente, cuáles provienen de fuentes secundarias, y cuáles podrían estar desactualizados.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Table({
          columnWidths: [2800, 1800, 4760],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "primaryUrl", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "URL de la fuente primaria (web del banco)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "secondarySource", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string?", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Fuente secundaria de contraste (comparador)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "verifiedAt", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Date", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Fecha y hora de última verificación", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "confidenceLevel", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "enum", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "ALTA, MEDIA, BAJA, PENDIENTE_REVISION", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "fieldsObtained", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string[]", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Campos que pudieron obtenerse de la fuente", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "fieldsMissing", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "string[]", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Campos que no pudieron obtenerse", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 5: Campos de la entidad OfferSource para trazabilidad", size: 18, italics: true, color: colors.secondary })] }),

        // SECTION 4: SCORING SYSTEM
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Sistema de Scoring y Ranking")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Filosofía del Scoring")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sistema de scoring está diseñado para proporcionar ordenaciones significativas y explicables, evitando los problemas comunes de otros comparadores que priorizan únicamente la cuota mensual inicial o el TIN. La puntuación final de cada oferta es una combinación ponderada de múltiples factores que reflejan diferentes aspectos de la calidad de una hipoteca. Los pesos de cada factor pueden ajustarse según el perfil del usuario: alguien con alta tolerancia al riesgo valorará más la cuota inicial de una variable, mientras que alguien conservador priorizará la estabilidad de una fija.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Factores de Puntuación")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sistema evalúa ocho factores principales que capturan los aspectos más relevantes de una hipoteca. Cada factor se puntúa de 0 a 100, y la puntuación final es una media ponderada que depende del perfil del usuario. Los factores han sido diseñados para ser mutuamente independientes en la medida de lo posible, evitando la doble penalización o recompensa por el mismo concepto.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Table({
          columnWidths: [2400, 1600, 2000, 3360],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Factor", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Peso Base", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Rango Puntos", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Qué Evalúa", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Coste Total", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "25%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Intereses totales + comisiones + gastos", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Cuota Inicial", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "15%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Cuota mensual inicial en relación a ingresos", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Vinculaciones", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "15%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Número y coste de productos asociados", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Flexibilidad", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "10%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Facilidad de amortización anticipada", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Riesgo de Tipo", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "10%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Incertidumbre en la evolución del tipo", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Claridad", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "10%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Transparencia de condiciones publicadas", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Confianza", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "10%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Fiabilidad y frescura de la fuente", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Adecuación", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5%", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "0-100", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Compatibilidad con preferencias del usuario", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 6: Factores de puntuación y sus pesos base", size: 18, italics: true, color: colors.secondary })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Algoritmos de Puntuación por Factor")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.3.1 Puntuación de Coste Total")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El coste total se calcula como la suma del capital prestado, los intereses totales durante la vida del préstamo, y todas las comisiones aplicables. Para hipotecas variables y mixtas, se utiliza el escenario base (Euríbor actual) para el cálculo. La puntuación se asigna mediante normalización relativa: la oferta con menor coste total recibe 100 puntos, y las demás reciben puntos proporcionalmente inversos a su coste. Este enfoque permite comparar objetivamente ofertas de diferente cuantía y plazo.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.3.2 Puntuación de Vinculaciones")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El factor de vinculaciones evalúa tanto el número de productos requeridos como su coste estimado. Una hipoteca sin bonificaciones recibe 100 puntos. Por cada producto vinculado, se restan puntos según una escala: domiciliación de nómina (-5 puntos), seguro de hogar (-10 puntos), seguro de vida (-10 puntos), plan de pensiones (-15 puntos), uso de tarjeta (-5 puntos). Adicionalmente, se penaliza el coste estimado de estos productos: por cada 100€ anuales de coste, se restan 5 puntos adicionales. Este algoritmo premia las hipotecas con bonificaciones fáciles de conseguir y penaliza aquellas que requieren un gasto significativo en productos asociados.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.3.3 Puntuación de Riesgo de Tipo")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Este factor es especialmente importante para hipotecas variables y mixtas. Las hipotecas fijas reciben automáticamente 100 puntos por estabilidad. Las variables se puntúan según el diferencial sobre Euríbor: a menor diferencial, menor riesgo de que las subidas de tipos impacten severamente. Las mixtas reciben una puntuación intermedia proporcional a la duración del tramo fijo: 5 años de tramo fijo podrían recibir 60 puntos, 10 años 80 puntos, 15 años 90 puntos. El cálculo considera también el escenario adverso proyectado: se simula un incremento del Euríbor de 2 puntos porcentuales y se evalúa el impacto en la cuota.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.4 Ajuste de Pesos por Perfil")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Los pesos base se ajustan según las características del usuario para personalizar el ranking. Los principales ajustes incluyen: si el usuario tiene tolerancia al riesgo ALTA, el peso de Riesgo de Tipo se reduce al 5% y el de Cuota Inicial aumenta al 20%; si el usuario prefiere menor cuota inicial sobre menor coste total, el peso de Cuota Inicial aumenta al 25% y Coste Total se reduce al 15%; si el usuario no acepta vinculaciones, el peso de Vinculaciones aumenta al 25% y se filtran ofertas que las requieren; y si el usuario planea amortizar anticipadamente, el peso de Flexibilidad aumenta al 20% y se evalúan las comisiones de amortización parcial.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 5: CALCULATION ENGINE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Motor de Cálculo Financiero")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Fórmulas Principales")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El motor de cálculo implementa las fórmulas financieras estándar del sistema de amortización francés, que es el predominante en hipotecas españolas. La cuota mensual se calcula mediante la fórmula de anualidad, donde P es el principal, r es el tipo de interés mensual y n es el número de pagos. Para el cálculo de intereses de cada período, se aplica la fórmula de interés sobre capital vivo. El capital amortizado es la diferencia entre la cuota y los intereses del período.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Cálculo de TAE Estimada")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "La Tasa Anual Equivalente (TAE) se calcula según la normativa europea, utilizando la fórmula de la Tasa Interna de Retorno (TIR) que iguala el valor presente de todos los flujos de caja con el importe prestado. Los flujos incluyen: cuotas mensuales, comisiones de apertura (pagadas al inicio), y gastos de tasación y otros costes iniciales. Para hipotecas variables, la TAE se calcula asumiendo que los tipos de referencia se mantienen constantes durante la vida del préstamo, lo cual es un supuesto regulatorio estándar pero debe comunicarse como una estimación.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 Simulación de Escenarios")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Para hipotecas variables y mixtas, el motor genera tres escenarios que permiten al usuario evaluar el riesgo de tipo. El escenario base utiliza el Euríbor actual publicado por el Banco de España. El escenario conservador asume un incremento del Euríbor de 1 punto porcentual durante los primeros 3 años, estabilizándose después. El escenario adverso asume un incremento de 2 puntos porcentuales durante los primeros 5 años. Para cada escenario, se calcula la evolución de la cuota, el coste total, y se generan alertas si el ratio cuota/ingresos supera el 35% en algún momento.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 6: VALIDATION
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Sistema de Validación y Reglas de Negocio")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Validaciones de Elegibilidad")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sistema implementa un conjunto de validaciones que determinan si el usuario es elegible para una oferta específica. Las validaciones principales incluyen: ratio de endeudamiento máximo (cuota + deudas existentes no debe superar el 35-40% de ingresos netos), LTV máximo permitido por la oferta (el porcentaje de financiación solicitado no puede exceder el máximo de la oferta), ahorro mínimo necesario (el usuario debe tener al menos el 20% del valor de compra no financiado más un 10-12% para gastos), y requisitos de antigüedad laboral (mínimo 6 meses para asalariados fijos, 2 años para autónomos). Cada validación genera un mensaje de error o advertencia específico que se muestra al usuario.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Mensajes y Advertencias")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sistema genera mensajes informativos y advertencias que ayudan al usuario a entender las limitaciones y riesgos de cada oferta. Los tipos de mensaje incluyen: errores de elegibilidad (el usuario no cumple requisitos mínimos), advertencias de riesgo (el ratio cuota/ingresos es alto, la oferta tiene comisiones significativas, el dato está desactualizado), sugerencias de optimización (convendría más entrada, podría reducir plazo), e información sobre alternativas (otras ofertas con mejor puntuación en algún factor específico). Todos los mensajes son contextuales y específicos al perfil del usuario.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 7: CONCLUSIONS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Conclusiones y Consideraciones de Implementación")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El modelo de datos y el sistema de scoring propuestos constituyen una base sólida para implementar un comparador hipotecario profesional y transparente. La arquitectura de entidades permite representar de forma unificada la diversidad de productos hipotecarios del mercado español, mientras que el sistema de scoring ofrece ordenaciones significativas y explicables. La inclusión de metadatos de trazabilidad en cada dato garantiza la transparencia que diferencia a este comparador de otros en el mercado.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Las consideraciones clave para la implementación incluyen: utilizar Zod o un esquema similar para validación en tiempo de ejecución, implementar el motor de cálculo como funciones puras para facilitar los tests, cachear los resultados de cálculos costosos (amortización completa), y diseñar la UI para mostrar siempre la trazabilidad de cada dato. El siguiente paso es definir los flujos UX y las pantallas que permitirán al usuario interactuar con este modelo de datos de forma intuitiva y eficiente.", size: 24, font: "Times New Roman", color: colors.body })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/modelo_datos_scoring.docx", buffer);
  console.log("Document created successfully!");
});
