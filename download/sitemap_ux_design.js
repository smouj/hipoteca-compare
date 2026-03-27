const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, PageNumber, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, VerticalAlign, TableOfContents, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

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
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-main", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-secondary", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    {
      properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SITEMAP, FLUJOS UX Y PANTALLAS", bold: true, size: 48, font: "Times New Roman", color: colors.primary })] }),
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Comparador Hipotecario Profesional para España", size: 36, font: "Times New Roman", color: colors.secondary })] }),
        new Paragraph({ spacing: { before: 800 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Diseño de navegación, flujos de usuario y especificación de interfaces", size: 24, font: "Times New Roman", color: colors.body })] }),
        new Paragraph({ spacing: { before: 2000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Documento de Diseño UX - Fase 3", size: 22, font: "Times New Roman", color: colors.accent })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "27 de marzo de 2026", size: 22, font: "Times New Roman", color: colors.accent })] }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    {
      properties: { page: { margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Sitemap y UX - Comparador Hipotecario", size: 18, color: colors.accent })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Página ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " de ", size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })] })] }) },
      children: [
        new TableOfContents("Índice de Contenidos", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nota: Este índice se genera mediante códigos de campo. Para actualizar los números de página, haga clic derecho sobre el índice y seleccione \"Actualizar campo\".", size: 18, color: "999999" })] }),
        new Paragraph({ children: [new PageBreak()] }),

        // SECTION 1: SITEMAP
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Sitemap de la Aplicación")] }),
        
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sitemap define la estructura de navegación completa de la aplicación, organizando las diferentes secciones y su jerarquía. La navegación está diseñada para ser intuitiva, minimizando la profundidad de la jerarquía y permitiendo al usuario acceder a cualquier funcionalidad en máximo 3 clics desde la página de inicio.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Estructura Principal")] }),

        new Table({
          columnWidths: [3000, 3000, 3360],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ruta", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Título", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Inicio", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Página principal con propuesta de valor", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/perfil", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mi Perfil Hipotecario", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wizard de captura de datos del usuario", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/comparador", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Comparador de Ofertas", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Listado y comparación de ofertas hipotecarias", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/oferta/[id]", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Detalle de Oferta", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Ficha completa de una oferta específica", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/simulador", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Simulador Avanzado", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Simulación interactiva con gráficos", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/mejora", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mejora tu Hipoteca", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Análisis de subrogación/novación", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/documentacion", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Centro Documental", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Glosario y explicación de términos", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "/metodologia", size: 20, font: "Courier New" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Metodología y Fuentes", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Panel de confianza y transparencia", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 1: Sitemap principal de la aplicación", size: 18, italics: true, color: colors.secondary })] }),

        // SECTION 2: USER FLOWS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Flujos de Usuario Principales")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Flujo de Captura de Perfil")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El flujo de captura de perfil es el corazón de la aplicación. Permite recoger toda la información necesaria para personalizar las recomendaciones y realizar los cálculos de elegibilidad. El wizard está dividido en 4 pasos lógicos que guían al usuario de forma progresiva, con validación en tiempo real y guardado automático de su progreso.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Paso 1 - Datos de la Operación: Tipo de compra, ubicación, precio del inmueble, importe a financiar, plazo deseado, ahorros disponibles. Este paso establece el contexto financiero básico.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Paso 2 - Perfil Económico: Ingresos, tipo de contrato, antigüedad laboral, deudas existentes. Este paso determina la capacidad de pago y el ratio de endeudamiento.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Paso 3 - Preferencias: Tipo de hipoteca preferido, tolerancia al riesgo, disposición a vinculaciones. Este paso permite filtrar y ordenar las ofertas según las preferencias personales.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Paso 4 - Hipoteca Existente (opcional): Si el usuario ya tiene hipoteca, se recogen los datos para análisis de subrogación/novación. Este paso solo aparece si el usuario indica que busca mejorar su hipoteca actual.", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Flujo de Comparación de Ofertas")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Una vez completado el perfil, el usuario accede al comparador donde ve un listado ordenado de ofertas según el scoring calculado. El flujo permite múltiples interacciones: filtrar por tipo de hipoteca, ordenar por diferentes criterios, comparar 2-4 ofertas lado a lado en vista de tabla o fichas, y acceder al detalle completo de cada oferta.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Vista inicial: Lista de ofertas ordenadas por puntuación global, con indicadores clave visibles (TIN, cuota estimada, puntuación). Se muestran badges de nivel de confianza.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Filtros: Por tipo (fija/variable/mixta), por rango de TIN, por entidad, por nivel de vinculaciones. Los filtros se aplican en tiempo real sin recargar página.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [new TextRun({ text: "Modo comparación: Selección de 2-4 ofertas para vista lado a lado. Se destacan diferencias en verde (ventajas) y ámbar (desventajas) para cada oferta.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Acceso a detalle: Click en cualquier oferta abre la ficha completa con toda la información, escenarios, y trazabilidad de la fuente.", size: 24, font: "Times New Roman" })] }),

        // SECTION 3: SCREENS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Especificación de Pantallas Principales")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Pantalla de Inicio")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "La pantalla de inicio establece el tono profesional y transparente de la aplicación. No utiliza marketing agresivo ni promesas engañosas. Presenta claramente qué hace la herramienta y cuáles son sus limitaciones. Incluye un call-to-action principal (\"Comenzar análisis\") y accesos directos a las secciones principales.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Header limpio con logo y navegación a secciones principales", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Hero section con propuesta de valor clara y honesta", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Bloque \"Qué puedes hacer\" con 4-6 funcionalidades clave", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Bloque \"Lo que NO somos\" con limitaciones claras", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Indicador de última actualización de datos", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Footer con enlaces a documentación, metodología y aviso legal", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Pantalla de Wizard de Perfil")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El wizard de perfil es la interfaz más compleja de la aplicación. Debe ser intuitivo, con validación en tiempo real, y capacidad de guardar el progreso para continuar después. El diseño sigue el principio de \"progressive disclosure\", mostrando solo los campos necesarios en cada paso y evitando abrumar al usuario.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Indicador de progreso visual (pasos completados/total)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Navegación anterior/siguiente con guardado automático", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Validación en tiempo real con mensajes claros", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Tooltips/ayuda contextual en campos complejos", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Resumen final antes de confirmar", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Opción de editar cualquier paso desde el resumen", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Pantalla de Comparador")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El comparador es la pantalla donde el usuario pasa más tiempo analizando opciones. Debe ser altamente funcional con capacidades de filtrado, ordenación y comparación lado a lado. El diseño prioriza la densidad de información útil sobre elementos decorativos.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Barra de filtros con chips para filtros activos", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Selector de ordenación (coste total, cuota, puntuación)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Toggle entre vista de tarjetas y vista de tabla", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Tarjetas de oferta con información clave visible", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Indicador de confianza (color/badge) en cada tarjeta", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Checkbox para selección de comparación lado a lado", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Panel de comparación cuando hay ofertas seleccionadas", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Pantalla de Detalle de Oferta")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "La ficha de detalle de oferta presenta toda la información disponible sobre un producto hipotecario específico. Está organizada en secciones claramente diferenciadas que permiten al usuario entender tanto las condiciones como los riesgos y la fiabilidad del dato.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Header con nombre de entidad, producto, tipo y badge de confianza", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Resumen ejecutivo con puntuación y posición en ranking", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Sección de condiciones financieras (TIN, diferencial, plazo, LTV)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Sección de bonificaciones y productos vinculados", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Sección de comisiones (apertura, amortización, cancelación)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Sección de simulación con escenarios (para variables/mixtas)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Sección de riesgos y advertencias", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Sección de trazabilidad (fuente, fecha verificación, campos obtenidos)", size: 24, font: "Times New Roman" })] }),

        // SECTION 4: UI COMPONENTS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Componentes de UI Específicos")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Sistema de Confianza Visual")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "El sistema de confianza visual es crítico para la transparencia del comparador. Cada dato muestra su nivel de confianza mediante indicadores visuales consistentes que el usuario aprende rápidamente a interpretar.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Table({
          columnWidths: [2400, 2400, 4560],
          margins: { top: 100, bottom: 100, left: 180, right: 180 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nivel", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Color/Indicador", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Significado", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "ALTA", size: 20, bold: true, color: "16A34A" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Verde / Badge sólido", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Dato verificado directamente de fuente primaria, actualizado hace menos de 7 días", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "MEDIA", size: 20, bold: true, color: "CA8A04" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Ámbar / Badge medio", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Dato contrastado con fuente secundaria, o actualizado hace 7-30 días", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "BAJA", size: 20, bold: true, color: "DC2626" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Rojo / Badge alerta", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Dato con campos faltantes o actualizado hace más de 30 días", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "PENDIENTE", size: 20, bold: true, color: "6B7280" })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Gris / Badge pendiente", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Dato pendiente de verificación, usar con precaución", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Tabla 2: Sistema de indicadores visuales de confianza", size: 18, italics: true, color: colors.secondary })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Componentes de Riesgo")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Los indicadores de riesgo ayudan al usuario a entender la incertidumbre asociada a cada oferta, especialmente importante para hipotecas variables y mixtas. El diseño usa iconografía y colores consistentes con el sistema de confianza general.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Indicador de riesgo de tipo: Barra visual con nivel de riesgo (bajo/medio/alto)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Gráfico de escenarios: Líneas comparativas de evolución de cuota", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Badge de advertencia: Para condiciones restrictivas o comisiones altas", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Callout de información: Para aclaraciones sobre supuestos de cálculo", size: 24, font: "Times New Roman" })] }),

        // SECTION 5: RESPONSIVE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Consideraciones Responsive")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "La aplicación debe funcionar perfectamente en dispositivos móviles y escritorio. Dado el carácter financiero y la cantidad de información a mostrar, se prioriza la legibilidad sobre la densidad de información en móvil. Algunas vistas de tabla se convierten a lista en móvil, y las comparaciones lado a lado se vuelven secuenciales.", size: 24, font: "Times New Roman", color: colors.body })] }),

        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Wizard: Pasos se muestran uno a la vez con scroll vertical en móvil", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Comparador: Vista de tarjetas por defecto en móvil, tabla solo en escritorio", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Comparación lado a lado: Scroll horizontal o vista secuencial en móvil", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Gráficos de simulación: Versión simplificada en móvil con datos clave", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Filtros: Drawer modal en móvil, barra visible en escritorio", size: 24, font: "Times New Roman" })] }),

        // SECTION 6: CONCLUSIONS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Próximos Pasos")] }),

        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Con el sitemap, flujos de usuario y especificación de pantallas definidos, el siguiente paso es establecer la arquitectura técnica final y la estructura de carpetas del proyecto. Esto permitirá comenzar la implementación del MVP con una base sólida de diseño.", size: 24, font: "Times New Roman", color: colors.body })] })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/sitemap_ux_design.docx", buffer);
  console.log("Document created successfully!");
});
