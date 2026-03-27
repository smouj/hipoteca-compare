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
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-main",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-secondary",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-terciary",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-quaternary",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-fifth",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // COVER PAGE
    {
      properties: {
        page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } }
      },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "AUDITORÍA PREVIA Y PROPUESTA DE VIABILIDAD", bold: true, size: 48, font: "Times New Roman", color: colors.primary })]
        }),
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Comparador Hipotecario Profesional para España", size: 36, font: "Times New Roman", color: colors.secondary })]
        }),
        new Paragraph({ spacing: { before: 800 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Análisis de fuentes públicas, limitaciones técnicas, riesgos y propuesta de arquitectura MVP", size: 24, font: "Times New Roman", color: colors.body })]
        }),
        new Paragraph({ spacing: { before: 2000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Documento de Trabajo - Fase 1", size: 22, font: "Times New Roman", color: colors.accent })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "27 de marzo de 2026", size: 22, font: "Times New Roman", color: colors.accent })]
        }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // MAIN CONTENT
    {
      properties: {
        page: { margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ 
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Auditoría Previa - Comparador Hipotecario España", size: 18, color: colors.accent })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ 
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Página ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " de ", size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })]
        })] })
      },
      children: [
        // TOC
        new TableOfContents("Índice de Contenidos", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Nota: Este índice se genera mediante códigos de campo. Para actualizar los números de página, haga clic derecho sobre el índice y seleccione \"Actualizar campo\".", size: 18, color: "999999" })]
        }),
        new Paragraph({ children: [new PageBreak()] }),
        
        // SECTION 1: EXECUTIVE SUMMARY
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Resumen Ejecutivo")] }),
        
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Este documento presenta los resultados de la auditoría técnica y funcional realizada para evaluar la viabilidad de construir un comparador hipotecario profesional para España utilizando exclusivamente fuentes públicas abiertas, sin depender de APIs de pago, autenticación de usuario, claves API, registro obligatorio ni integraciones cerradas. El objetivo principal es determinar qué datos pueden obtenerse de forma fiable y automatizada, cuáles requieren verificación manual, y cuáles son simplemente inaccesibles dentro de los parámetros establecidos.", size: 24, font: "Times New Roman", color: colors.body })]
        }),
        
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La investigación ha revelado un ecosistema de fuentes públicas más rico de lo inicialmente esperado, pero también con limitaciones significativas que condicionan el alcance del producto final. El Banco de España ofrece una API pública de estadísticas que proporciona tipos de interés oficiales, valores del Euríbor y tipos de referencia del mercado hipotecario. El Instituto Nacional de Estadística (INE) publica estadísticas mensuales de hipotecas con tipos medios iniciales. Sin embargo, las condiciones comerciales específicas de cada entidad (TIN, TAE, bonificaciones, comisiones) no están disponibles de forma estructurada y deben extraerse de las páginas web individuales de cada banco, con todas las limitaciones técnicas que esto implica.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El presente análisis concluye que es posible construir un comparador hipotecario útil y profesional, pero no un sistema completamente automatizado de actualización en tiempo real. La arquitectura propuesta combina una capa de datos estáticos verificables (tipos oficiales, estadísticas agregadas), una capa de ofertas normalizadas con actualización periódica mediante scraping supervisado, y un motor de cálculo y scoring completamente automatizado que opera sobre los datos disponibles. La transparencia sobre las limitaciones y la trazabilidad de cada dato serán elementos diferenciadores fundamentales del producto.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 2: OFFICIAL PUBLIC SOURCES
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Fuentes Públicas Oficiales Analizadas")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Banco de España (BdE)")] }),
        
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El Banco de España constituye la fuente primaria más relevante para datos oficiales del mercado hipotecario español. Tras el análisis detallado de su infraestructura de datos, se han identificado los siguientes recursos utilizables:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1.1 API de Estadísticas del Banco de España")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El Banco de España dispone de un servicio web (API) para la descarga de datos estadísticos, lanzado en abril de 2025 según la documentación oficial. Esta API permite integrar los datos de las estadísticas publicadas directamente en aplicaciones, sin necesidad de autenticación para consultas básicas. La URL base del servicio es https://www.bde.es/webbe/es/estadisticas/recursos/api-estadisticas-bde.html, donde se documenta el acceso a los diferentes conjuntos de datos. Los formatos disponibles incluyen JSON, CSV y Excel, lo que facilita la integración con cualquier stack tecnológico moderno.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1.2 Tabla de Tipos de Referencia Oficiales")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El Portal del Cliente Bancario del Banco de España publica mensualmente la tabla de tipos de referencia oficiales del mercado hipotecario. Esta tabla incluye el tipo medio de los préstamos hipotecarios a más de 3 años para adquisición de vivienda, el Euríbor a un año (índice más utilizado como referencia en préstamos hipotecarios variables), y otros índices de referencia como el IRPH de entidades, IRPH de bancos, y MIBOR. La tabla se actualiza mensualmente y constituye una fuente verificable y trazable para cualquier análisis hipotecario.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("2.1.3 Estadísticas de Tipos de Interés")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La sección de estadísticas del BdE incluye tipos de interés legales y otros tipos utilizados como referencia, así como estadísticas de tipos de interés aplicados por las entidades de crédito en España. Los datos están disponibles tanto a través de la API como en archivos CSV y Excel asociados a los cuadros estadísticos. Esta información permite obtener tipos medios del mercado, aunque no desagregados por entidad ni por producto específico.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Instituto Nacional de Estadística (INE)")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El INE publica mensualmente la Estadística de Hipotecas, elaborada a partir de la información registrada en los Registros de la Propiedad. Esta fuente proporciona datos agregados de gran utilidad para contextualizar el mercado, aunque no ofrece información a nivel de producto individual. Los datos más relevantes incluyen:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Número de hipotecas sobre viviendas inscritas en los registros de la propiedad (dato mensual y variación anual)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Importe medio de las hipotecas sobre viviendas (actualmente en torno a 165.677 euros según últimos datos)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Tipo de interés medio al inicio de las hipotecas constituidas, diferenciado entre fijas y variables", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Distribución por tipo de interés (fijo vs variable) de las nuevas hipotecas constituidas", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Plazo medio de las hipotecas constituidas", size: 24, font: "Times New Roman" })] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Los datos del INE son accesibles a través de su portal web (https://www.ine.es) y disponen de una API (PX-Web) que permite consultas programáticas. El sistema JAXI del INE permite descargar tablas en múltiples formatos. Estos datos son especialmente valiosos para construir escenarios de referencia y comparativas de mercado, aunque no sirven para obtener condiciones específicas de productos individuales.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Asociación Hipotecaria Española (AHE)")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La Asociación Hipotecaria Española publica un boletín estadístico trimestral que incluye datos agregados del mercado hipotecario español. El documento, disponible en formato PDF, contiene series históricas de producción hipotecaria, tipos de interés medios por plazo, y datos de morosidad. Aunque el formato PDF dificulta la extracción automatizada, los datos son verificables y constituyen una fuente secundaria de contraste para las estadísticas oficiales del BdE e INE.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 3: COMMERCIAL SOURCES
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Fuentes Comerciales: Webs de Entidades Bancarias")] }),
        
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El análisis de las páginas web de las principales entidades bancarias españolas ha revelado tanto oportunidades como limitaciones significativas. A continuación se presenta el detalle de la investigación realizada sobre cada entidad principal:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Banco Santander")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La página de hipotecas de Banco Santander (https://www.bancosantander.es/particulares/hipotecas) presenta una estructura moderna basada en Next.js, con datos embebidos en formato JSON dentro del HTML. El análisis del código fuente revela que la información de productos está estructurada de forma accesible, incluyendo enlaces a hipoteca fija, variable, mixta, puente, inversa, joven y para no residentes. Sin embargo, los tipos de interés específicos y condiciones detalladas no están expuestos directamente en el HTML estático, requiriendo interacción con el simulador para obtener cotizaciones personalizadas.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Según las fuentes secundarias analizadas (El Economista, HelpMyCash, Rankia), las condiciones actuales de Santander incluyen hipoteca fija bonificada con TIN desde 2,55%, hipoteca mixta con período fijo de 15 años al 2,75% TIN y posteriormente Euríbor + 0,90%, y comisión de apertura del 1% en la mayoría de productos. Estos datos, aunque publicados en fuentes secundarias, requieren verificación periódica con la fuente primaria.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 BBVA")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El intento de acceso a la página de hipotecas de BBVA devolvió una página de error 404, lo que indica que la estructura de URLs ha cambiado recientemente o que la página requiere un flujo de navegación específico. BBVA dispone de información sobre el Euríbor en su portal (https://www.bbva.es/finanzas-vistazo/ef/hipotecas/evolucion-euribor.html) con datos históricos actualizados mensualmente. Según fuentes secundarias, BBVA ofrece hipotecas fijas competitivas y mantiene presencia significativa en el mercado hipotecario español.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Bankinter")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Bankinter (https://www.bankinter.com/banca/hipotecas-prestamos/hipotecas) ofrece una de las páginas más informativas del sector. El contenido incluye descripción detallada de todos sus productos (hipoteca dual, variable, fija, mixta y joven), FAQ con información relevante sobre gastos asociados, comparativas y proceso de compra. Según fuentes secundarias contrastadas, la Hipoteca Vamos Mixta de Bankinter ofrece un TIN del 1,70% durante los primeros cinco años, uno de los más competitivos del mercado. La página incluye información sobre bonificaciones por domiciliación de nómina, contratación de seguros y planes de pensiones.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 CaixaBank")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "CaixaBank constituye uno de los principales actores del mercado hipotecario español. Según las fuentes secundarias analizadas, la entidad ofrece hipotecas fijas, variables y mixtas con condiciones competitivas. La Hipoteca Variable de CaixaBank figura entre las mejores valoradas según Rastreator (marzo 2026). No se ha realizado análisis técnico de la página web en esta fase, quedando pendiente para la siguiente etapa de investigación.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.5 Otras Entidades Relevantes")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El mercado hipotecario español incluye otras entidades significativas que deben considerarse en un comparador completo: Banco Sabadell (ofrece hipoteca mixta con TIN del 1% los primeros años según El Economista), Unicaja (Hipoteca Mixta Bonificada con TIN del 1,30% los primeros cinco años, la más barata según Rastreator), Ibercaja (Hipoteca Vamos a Tipo Fijo con TIN del 2,30% según El Economista), y Banca March (hipoteca fija con TIN del 2,65%). Adicionalmente, existen entidades especializadas como MyInvestor, EVO Banco, Openbank y diversos brokers hipotecarios que operan en el mercado español.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 4: COMPARATORS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Comparadores y Fuentes Secundarias")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El ecosistema español de comparadores hipotecarios está dominado por varios actores que pueden servir como fuentes de descubrimiento de entidades y contraste de información, aunque nunca como fuente primaria única:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Principales Comparadores Identificados")] }),

        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "iAhorro (www.iahorro.com): Comparador con equipo de expertos que ofrece asesoramiento gratuito. Publica informes mensuales sobre estadísticas del INE y mantiene rankings de hipotecas actualizados.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Kelisto (www.kelisto.es): Comparador del grupo Rastreator que ofrece calculadora de cuota y comparativa de hipotecas del mercado. Permite filtrar por tipo (fija, variable, mixta) y plazo.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Rastreator (www.rastreator.com): Uno de los comparadores más conocidos del mercado español. Publica guías con \"las mejores hipotecas\" mensualmente y mantiene información detallada de condiciones.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "HelpMyCash (www.helpmycash.com): Comparador con análisis detallados de productos bancarios. Publica rankings periódicos y ofrece información sobre bonificaciones y condiciones específicas.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Idealista Hipotecas (www.idealista.com/hipotecas): Portal inmobiliario que incluye comparador hipotecario con datos de Euríbor histórico y estadísticas del mercado.", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Fuentes Editoriales de Referencia")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Medios especializados como El Economista, Expansión, y Rankia publican periódicamente análisis comparativos de hipotecas con datos recopilados de diversas fuentes. Estos medios constituyen una fuente secundaria valiosa para descubrir nuevas ofertas y tendencias del mercado, aunque la información debe siempre contrastarse con fuentes primarias. Destaca especialmente El Economista, que publica mensualmente un ranking de \"las mejores hipotecas fijas, mixtas y variables\" con TIN específicos y condiciones detalladas.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 5: TECHNICAL LIMITATIONS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Limitaciones Técnicas Identificadas")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Restricciones CORS")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Las políticas CORS (Cross-Origin Resource Sharing) de los navegadores impiden que una aplicación web frontend realice peticiones directas a dominios de bancos desde el navegador del usuario. Esta restricción es especialmente relevante porque la mayoría de entidades bancarias no incluyen cabeceras CORS que permitan el acceso desde orígenes externos. La solución técnica necesaria implica implementar un backend proxy que actúe como intermediario en las peticiones de datos, manteniendo la experiencia de usuario final como una aplicación pública sin autenticación.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Robots.txt y Términos de Uso")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La mayoría de sitios web bancarios incluyen archivos robots.txt que restringen el acceso automatizado a ciertas secciones. Aunque la extracción de datos públicos de páginas accesibles sin autenticación generalmente se considera legal en España para uso informativo (siempre que no se sobrecarguen los servidores ni se vulneren medidas de seguridad), es necesario revisar los términos de uso de cada sitio y respetar las limitaciones establecidas. El enfoque recomendado incluye: implementar delays entre peticiones, identificar el bot con un user-agent descriptivo, y limitar la frecuencia de actualización a lo estrictamente necesario.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 Estructura HTML Cambiante")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Las páginas web de los bancos se actualizan frecuentemente, modificando clases CSS, estructura del DOM, e incluso la ubicación de los datos. Los scrapers basados en selectores específicos son frágiles y requieren mantenimiento continuo. La estrategia recomendada implica: combinar múltiples técnicas de extracción (selectores CSS, XPath, búsqueda de patrones en texto), implementar tests automáticos que detecten cambios de estructura, y diseñar el sistema de forma modular para facilitar las actualizaciones por entidad.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.4 Contenido Dinámico y JavaScript")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Muchas páginas bancarias modernas utilizan frameworks JavaScript (React, Next.js, Angular) que renderizan contenido dinámicamente. El scraping de HTML estático no captura este contenido. Las soluciones técnicas incluyen: usar herramientas como Puppeteer o Playwright para renderizar JavaScript (con mayor complejidad y consumo de recursos), analizar si los datos están embebidos en scripts JSON dentro del HTML (como se observó en Banco Santander), o buscar APIs internas no documentadas que las páginas consuman.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.5 Personalización Comercial")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Una limitación fundamental es que los tipos de interés hipotecarios no son fijos ni públicos en el sentido tradicional. Cada oferta depende del perfil del solicitante (ingresos, relación cuota/ingresos, ahorros, profesión, historial crediticio) y de las bonificaciones aceptadas (domiciliación de nómina, seguros, planes de pensiones). Los tipos publicitados en las páginas web suelen ser el \"precio de salida\" o el \"tipo mínimo\" con todas las bonificaciones, pero el tipo real que obtiene cada cliente puede variar significativamente. Esta realidad impide ofrecer comparativas exactas y exige comunicar claramente que los resultados son estimaciones basadas en escenarios típicos.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 6: VERIFIABLE VS NON-VERIFIABLE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Campos Verificables vs No Verificables")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Un aspecto crucial del diseño del comparador es distinguir claramente entre datos que pueden verificarse de forma automatizada, datos que requieren verificación manual, y datos que son inherentemente estimaciones o suposiciones:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Datos 100% Verificables Automáticamente")] }),

        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Valor del Euríbor histórico y actual (Banco de España, INE, fuentes oficiales)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Tipos de referencia oficiales del mercado hipotecario (Banco de España)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Estadísticas agregadas de hipotecas (INE): número, importe medio, tipos medios", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Existencia de productos hipotecarios en el catálogo de cada entidad", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Tipos de interés legales (interés legal del dinero, interés de demora)", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Datos Verificables con Actualización Periódica")] }),

        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, children: [new TextRun({ text: "TIN de salida publicado en páginas web de entidades (requiere scraping supervisado)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, children: [new TextRun({ text: "Diferencial sobre Euríbor en hipotecas variables (cuando está publicado)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, children: [new TextRun({ text: "Duración del tramo fijo en hipotecas mixtas", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, children: [new TextRun({ text: "Requisitos de bonificaciones publicados (domiciliación, seguros, etc.)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, children: [new TextRun({ text: "Comisiones de apertura, cancelación y amortización anticipada (cuando están publicadas)", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-quaternary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Plazos máximos de amortización ofertados", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 Datos No Verificables Automáticamente")] }),

        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, children: [new TextRun({ text: "TAE real: depende de comisiones específicas, gastos de tasación, seguros obligatorios y otros factores que varían por operación", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, children: [new TextRun({ text: "Tipo aplicable a un perfil concreto: los bancos aplican pricing interno no público basado en scoring crediticio", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, children: [new TextRun({ text: "Probabilidad de aprobación: depende de criterios internos no públicos de cada entidad", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, children: [new TextRun({ text: "Condiciones de bonificaciones completas: algunos requisitos solo se revelan tras iniciar el proceso de solicitud", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, children: [new TextRun({ text: "Ofertas especiales o campañas temporales no publicadas en web", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-fifth", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Costes de productos vinculados (seguros) cuando no están publicados", size: 24, font: "Times New Roman" })] }),

        // SECTION 7: PROPOSED ARCHITECTURE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Propuesta de Arquitectura Técnica")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La arquitectura propuesta está diseñada para maximizar la fiabilidad y transparencia de los datos, minimizando al mismo tiempo la fragilidad del sistema frente a cambios en fuentes externas. Se estructura en capas claramente diferenciadas:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Capa de Datos Oficiales (Automatizada)")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Esta capa consume datos de fuentes oficiales que ofrecen APIs públicas o formatos estructurados estables. Incluye el conector del Banco de España para tipos de interés oficiales, Euríbor y tipos de referencia; el conector del INE para estadísticas agregadas de hipotecas; y el conector de datos del Euríbor para valores históricos y actuales. Estos conectores se implementan como servicios backend que se actualizan automáticamente con frecuencia diaria o mensual según la fuente, sin requerir intervención manual. La trazabilidad es total: cada dato incluye fecha de obtención, fuente y nivel de confianza.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Capa de Ofertas Normalizadas (Supervisada)")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Esta capa gestiona la información de productos hipotecarios de cada entidad bancaria. Debido a la naturaleza cambiante y personalizada de estas ofertas, se propone un modelo híbrido: una base de datos de ofertas normalizadas que se actualiza mediante procesos de scraping supervisados, con validación humana de cambios significativos. Cada registro de oferta incluye: identificación de la entidad y producto, tipo de hipoteca (fija, variable, mixta), TIN de salida publicado, diferencial sobre Euríbor (si aplica), tramo fijo en años (si aplica), bonificaciones disponibles y su impacto en el tipo, comisiones publicadas, fecha de última verificación, nivel de confianza del dato, y URL de la fuente primaria.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 Motor de Cálculo y Simulación")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El motor de cálculo es completamente automatizado y opera sobre los datos disponibles en las capas anteriores. Implementa los siguientes cálculos: cuota mensual según sistema de amortización francés, coste total del préstamo (capital + intereses), cálculo de TAE estimada según fórmula oficial, simulación de escenarios para hipotecas variables y mixtas (base, conservador, adverso), cálculo de esfuerzo financiero (ratio cuota/ingresos), impacto de bonificaciones en el coste efectivo, y amortización anticipada y su efecto en el coste total. Este motor es determinista y trazable: dados los mismos inputs, produce siempre los mismos outputs, lo que permite auditar cualquier resultado.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.4 Sistema de Scoring y Ranking")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El sistema de scoring evalúa cada oferta según múltiples criterios ponderados, adaptándose al perfil del usuario. Los criterios incluyen: coste total del préstamo (peso alto), cuota mensual inicial (peso medio-alto), nivel de bonificaciones necesarias (penalización por exceso de vinculación), flexibilidad para amortización anticipada (peso medio), claridad y completitud de condiciones publicadas (peso medio-bajo), riesgo de tipo para variables y mixtas (penalización por incertidumbre), y confianza y frescura del dato (peso alto). El sistema genera una puntuación global y explicaciones detalladas de por qué cada oferta está posicionada donde está.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.5 Frontend y Capa de Presentación")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "El frontend se implementa como una aplicación Next.js 15 con TypeScript, utilizando componentes de shadcn/ui para la interfaz de usuario. El diseño sigue principios de sobriedad y profesionalidad: tipografía limpia, espaciado amplio, jerarquía visual clara, y uso disciplinado del color para indicar confianza y riesgo. La aplicación es completamente responsive, funcionando correctamente en dispositivos móviles y escritorio. Se implementa persistencia local para el perfil del usuario (localStorage), permitiendo que los usuarios completen el formulario en múltiples sesiones.", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        // SECTION 8: MVP SCOPE
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Propuesta de Alcance MVP")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Considerando las limitaciones identificadas y los recursos disponibles, se propone el siguiente alcance para el MVP del comparador hipotecario:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.1 Funcionalidades Incluidas en MVP")] }),

        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Formulario de perfil hipotecario detallado: wizard multi-paso con validación, guardado local, y todos los campos especificados en los requisitos (datos de operación, perfil económico, preferencias, hipoteca existente si aplica).", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Motor de cálculo completo: simulación de cuotas, coste total, escenarios para fija/variable/mixta, cálculo de esfuerzo financiero, y proyección de amortización.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Base de datos de ofertas: inicialmente con 8-10 entidades principales (Santander, BBVA, CaixaBank, Bankinter, Sabadell, Unicaja, Ibercaja, MyInvestor), actualizadas manualmente con verificación de fuente.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Sistema de ranking y puntuación: ordenación por coste total, cuota, flexibilidad y riesgo, con explicaciones claras de cada posición.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Comparador lado a lado: capacidad de seleccionar 2-4 ofertas y comparar sus condiciones en paralelo.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Ficha detallada de oferta: resumen ejecutivo, condiciones, bonificaciones, comisiones, riesgos, y trazabilidad completa de la fuente.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Módulo de mejora de hipoteca: análisis de subrogación y novación con cálculo de ahorro potencial.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Centro documental: explicación de términos hipotecarios clave (FEIN, FiAE, TIN, TAE, LTV, etc.) en lenguaje claro.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Panel de confianza: transparencia sobre fuentes, metodología de cálculo, limitaciones del sistema, y fecha de última actualización de cada dato.", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.2 Funcionalidades Diferidas a Versiones Posteriores")] }),

        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Actualización automática de ofertas mediante scraping: se implementará tras validar estabilidad del modelo de datos.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Integración con APIs de comparadores externos para descubrimiento automático de nuevas ofertas.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Módulo de usuarios registrados con histórico de simulaciones y alertas de cambios en condiciones.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, children: [new TextRun({ text: "Expansión a otros mercados (Portugal, Francia, etc.) cuando el modelo esté consolidado en España.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-main", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Integración con brokers para solicitud directa de ofertas personalizadas (requiere acuerdos comerciales).", size: 24, font: "Times New Roman" })] }),

        // SECTION 9: RISKS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("9. Riesgos Técnicos y de Producto")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.1 Riesgos Técnicos")] }),

        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Fragilidad del scraping: cambios en las páginas web de los bancos pueden romper los extractores de datos. Mitigación: diseño modular, tests automáticos, alertas de cambios.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Bloqueo de IPs: los bancos pueden bloquear peticiones automatizadas. Mitigación: usar proxies rotativos, delays generosos, y respetar robots.txt.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, children: [new TextRun({ text: "Datos desactualizados: en el peor caso, una oferta puede estar desactualizada semanas o meses. Mitigación: mostrar siempre fecha de última verificación y nivel de confianza.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-secondary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Precisión de cálculos: errores en fórmulas financieras pueden generar información incorrecta. Mitigación: tests exhaustivos del motor de cálculo, documentación de fórmulas, y validación contra calculadoras oficiales.", size: 24, font: "Times New Roman" })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.2 Riesgos de Producto")] }),

        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Expectativas irreales: los usuarios pueden esperar ofertas exactas y garantizadas. Mitigación: comunicación muy clara de limitaciones, \"estimaciones\" vs \"ofertas reales\".", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Competencia con comparadores establecidos: iAhorro, Kelisto, etc. tienen mayor cobertura y recursos. Mitigación: diferenciación por transparencia, profundidad de análisis, y ausencia de registro obligatorio.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, children: [new TextRun({ text: "Responsabilidad legal: la información financiera puede generar responsabilidad si es incorrecta. Mitigación: términos de uso claros, disclaimer visible, y presentación como \"herramienta de información\" no \"asesoramiento financiero\".", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "bullet-terciary", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Modelo de negocio: sin registro de usuarios ni APIs de pago, la monetización es limitada. Mitigación: evaluar modelo de leads cualificados, afiliación con brokers, o versión premium con más funcionalidades.", size: 24, font: "Times New Roman" })] }),

        // SECTION 10: RECOMMENDATIONS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("10. Recomendaciones y Próximos Pasos")] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Basándose en el análisis realizado, se recomienda proceder con el desarrollo del MVP siguiendo el enfoque pragmático descrito en este documento. Los próximos pasos específicos son:", size: 24, font: "Times New Roman", color: colors.body })]
        }),

        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Definir el modelo de datos completo: esquemas TypeScript para todas las entidades (UserScenario, MortgageOffer, OfferCondition, etc.).", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Diseñar el sistema de scoring detallado: ponderaciones, umbrales, y lógica de explicaciones.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Definir sitemap, flujos UX y wireframes de todas las pantallas principales.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Establecer la estructura de carpetas y arquitectura técnica definitiva.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Crear la base de datos inicial de ofertas: recopilación manual de condiciones actuales de 8-10 entidades principales.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Implementar el formulario de perfil y motor de cálculo.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Desarrollar el sistema de ranking y comparación.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [new TextRun({ text: "Implementar tests unitarios y de integración.", size: 24, font: "Times New Roman" })] }),
        new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Realizar revisión crítica final antes de lanzamiento.", size: 24, font: "Times New Roman" })] }),

        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "La auditoría concluye que el proyecto es viable dentro de los parámetros establecidos, siempre que se mantenga un enfoque pragmático que reconozca las limitaciones inherentes al no poder acceder a datos personalizados de cada entidad. El valor diferencial del comparador residirá en la transparencia radical sobre sus fuentes, la calidad del motor de cálculo y simulación, y la profundidad del análisis que ofrece al usuario para tomar decisiones informadas, más que en prometer ofertas exactas o coberturas completas del mercado.", size: 24, font: "Times New Roman", color: colors.body })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/auditoria_previa_viabilidad.docx", buffer);
  console.log("Document created successfully!");
});
