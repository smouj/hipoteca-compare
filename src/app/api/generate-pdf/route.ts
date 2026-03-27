import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, scoredOffers, comparisonContext } = body;

    if (!formData || !scoredOffers) {
      return NextResponse.json(
        { error: 'Datos incompletos para generar el PDF' },
        { status: 400 }
      );
    }

    const borrowers = formData.borrowers || [];
    const totalIncome = borrowers.reduce((sum: number, b: any) => sum + b.monthlyNetIncome + (b.additionalMonthlyIncome || 0), 0);
    const totalDebt = borrowers.reduce((sum: number, b: any) => sum + b.monthlyDebtPayments, 0);
    const totalSavings = borrowers.reduce((sum: number, b: any) => sum + b.availableSavings, 0);

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.setTitle('Informe de Hipoteca');
    pdfDoc.setAuthor('Z.ai');
    pdfDoc.setCreator('HipotecaCompare');
    pdfDoc.setSubject('Informe de comparación de hipotecas');

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    const lineHeight = 18;

    // Helper functions
    const drawTitle = (text: string, size: number = 24) => {
      page.drawText(text, {
        x: margin,
        y: y,
        size: size,
        font: fontBold,
        color: rgb(0.12, 0.31, 0.47), // #1F4E79
      });
      y -= lineHeight * 1.5;
    };

    const drawSubtitle = (text: string) => {
      page.drawText(text, {
        x: margin,
        y: y,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= lineHeight * 1.5;
    };

    const drawHeading = (text: string) => {
      y -= 10;
      if (y < margin + 100) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(text, {
        x: margin,
        y: y,
        size: 14,
        font: fontBold,
        color: rgb(0.12, 0.31, 0.47),
      });
      y -= lineHeight * 1.2;
    };

    const drawText = (text: string, indent: number = 0) => {
      if (y < margin + 20) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(text, {
        x: margin + indent,
        y: y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    };

    const drawKeyValue = (key: string, value: string) => {
      if (y < margin + 20) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(key + ':', {
        x: margin,
        y: y,
        size: 10,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.2),
      });
      page.drawText(value, {
        x: margin + 180,
        y: y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    };

    const drawLine = () => {
      if (y < margin + 20) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: pageWidth - margin, y: y },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
      y -= lineHeight;
    };

    // === COVER PAGE ===
    y = pageHeight - 150;
    
    drawTitle('INFORME DE COMPARACION', 28);
    drawTitle('DE HIPOTECAS', 28);
    y -= 20;
    
    drawSubtitle('Documento generado automaticamente por HipotecaCompare');
    drawSubtitle(`Fecha: ${formatDate(new Date())}`);
    
    y -= 50;
    
    // Quick stats box
    page.drawRectangle({
      x: margin,
      y: y - 80,
      width: contentWidth,
      height: 100,
      color: rgb(0.94, 0.97, 0.95),
      borderColor: rgb(0.18, 0.49, 0.29),
      borderWidth: 1,
    });
    
    const stats = [
      { label: 'Titulares', value: borrowers.length.toString() },
      { label: 'Prestamo', value: formatCurrency(formData.loanAmount) },
      { label: 'Plazo', value: `${formData.termYears} anos` },
      { label: 'Ofertas', value: scoredOffers.length.toString() },
    ];
    
    const statWidth = contentWidth / 4;
    stats.forEach((stat, i) => {
      const x = margin + i * statWidth + statWidth / 2;
      page.drawText(stat.value, {
        x: x - 30,
        y: y - 35,
        size: 14,
        font: fontBold,
        color: rgb(0.18, 0.49, 0.29),
      });
      page.drawText(stat.label, {
        x: x - 25,
        y: y - 55,
        size: 9,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
    });
    
    y -= 120;

    // === SECTION 1: OPERATION DATA ===
    drawHeading('1. DATOS DE LA OPERACION');
    
    const operationTypeLabel = formData.operationType === 'COMPRA' ? 'Compra de vivienda' : 
                               formData.operationType === 'REFINANCIACION' ? 'Refinanciacion' : 'Subrogacion';
    const propertyTypeLabel = formData.propertyType === 'VIVIENDA_HABITUAL' ? 'Vivienda habitual' :
                              formData.propertyType === 'SEGUNDA_VIVIENDA' ? 'Segunda vivienda' : 'Obra nueva';
    
    drawKeyValue('Tipo de operacion', operationTypeLabel);
    drawKeyValue('Precio de la vivienda', formatCurrency(formData.propertyPrice));
    drawKeyValue('Importe del prestamo', formatCurrency(formData.loanAmount));
    drawKeyValue('Entrada disponible', `${formatCurrency(formData.downPayment)} (${((formData.downPayment / formData.propertyPrice) * 100).toFixed(1)}%)`);
    drawKeyValue('Plazo solicitado', `${formData.termYears} anos`);
    drawKeyValue('Tipo de vivienda', propertyTypeLabel);
    if (formData.propertyLocation) {
      drawKeyValue('Ubicacion', formData.propertyLocation);
    }
    
    drawLine();

    // === SECTION 2: BORROWERS ===
    drawHeading('2. DATOS DE LOS TITULARES');
    
    borrowers.forEach((borrower: any, index: number) => {
      const label = borrower.isPrincipal ? 'TITULAR PRINCIPAL' : `COTITULAR ${index}`;
      
      page.drawRectangle({
        x: margin,
        y: y - 10,
        width: contentWidth,
        height: 180,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 1,
      });
      y -= 5;
      
      page.drawText(label, {
        x: margin + 10,
        y: y,
        size: 11,
        font: fontBold,
        color: rgb(0.12, 0.31, 0.47),
      });
      y -= lineHeight;
      
      const maritalLabels: Record<string, string> = {
        'SOLTERO': 'Soltero/a',
        'CASADO': 'Casado/a',
        'DIVORCIADO': 'Divorciado/a',
        'VIUDO': 'Viudo/a',
        'PAREJA_HECHO': 'Pareja de hecho',
      };
      
      const employmentLabels: Record<string, string> = {
        'INDEFINIDO': 'Contrato indefinido',
        'TEMPORAL': 'Contrato temporal',
        'AUTONOMO': 'Autonomo',
        'FUNCIONARIO': 'Funcionario',
        'JUBILADO': 'Jubilado',
        'DESEMPLEADO': 'En paro',
      };
      
      page.drawText(`Nombre: ${borrower.fullName || 'No especificado'}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`Edad: ${borrower.age} anos`, {
        x: margin + 250,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Estado civil: ${maritalLabels[borrower.maritalStatus] || borrower.maritalStatus}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Empleo: ${employmentLabels[borrower.employmentType] || borrower.employmentType}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Ingresos mensuales: ${formatCurrency(borrower.monthlyNetIncome)}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`Ingresos anuales: ${formatCurrency(borrower.annualIncome)}`, {
        x: margin + 250,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Cuotas de deudas: ${formatCurrency(borrower.monthlyDebtPayments)}/mes`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`Ahorros: ${formatCurrency(borrower.availableSavings)}`, {
        x: margin + 250,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight * 2.5;
    });
    
    drawLine();

    // === SECTION 3: FINANCIAL SUMMARY ===
    drawHeading('3. RESUMEN FINANCIERO');
    
    drawKeyValue('Ingresos mensuales totales', formatCurrency(totalIncome));
    drawKeyValue('Ingresos anuales totales', formatCurrency(totalIncome * 14));
    drawKeyValue('Cuotas de deudas actuales', `${formatCurrency(totalDebt)}/mes`);
    drawKeyValue('Ratio de endeudamiento', `${((totalDebt / totalIncome) * 100).toFixed(1)}%`);
    drawKeyValue('Ahorros totales', formatCurrency(totalSavings));
    drawKeyValue('LTV solicitado', `${((formData.loanAmount / formData.propertyPrice) * 100).toFixed(1)}%`);
    
    drawLine();

    // === SECTION 4: OFFERS ===
    drawHeading('4. OFERTAS RECOMENDADAS');
    
    drawText(`Se han encontrado ${scoredOffers.length} ofertas compatibles con tu perfil:`);
    y -= 10;
    
    const mortgageTypeLabels: Record<string, string> = {
      'FIJA': 'Fija',
      'VARIABLE': 'Variable',
      'MIXTA': 'Mixta',
    };
    
    scoredOffers.slice(0, 5).forEach((offer: any, index: number) => {
      if (y < margin + 150) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      
      // Offer card
      const cardHeight = 120;
      const isBest = index === 0;
      
      page.drawRectangle({
        x: margin,
        y: y - cardHeight + 15,
        width: contentWidth,
        height: cardHeight,
        color: isBest ? rgb(0.91, 0.96, 0.91) : rgb(0.97, 0.97, 0.97),
        borderColor: isBest ? rgb(0.18, 0.49, 0.29) : rgb(0.85, 0.85, 0.85),
        borderWidth: isBest ? 2 : 1,
      });
      
      if (isBest) {
        page.drawText('MEJOR OPCION', {
          x: pageWidth - margin - 80,
          y: y + 5,
          size: 8,
          font: fontBold,
          color: rgb(0.18, 0.49, 0.29),
        });
      }
      
      y -= 5;
      
      page.drawText(`${index + 1}. ${offer.offer.productName}`, {
        x: margin + 10,
        y: y,
        size: 11,
        font: fontBold,
        color: rgb(0.12, 0.31, 0.47),
      });
      y -= lineHeight;
      
      page.drawText(`Banco: ${offer.offer.bankId.toUpperCase()}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`Tipo: ${mortgageTypeLabels[offer.offer.mortgageType] || offer.offer.mortgageType}`, {
        x: margin + 200,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`TIN: ${offer.offer.rateCondition.tin}%`, {
        x: margin + 350,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Cuota mensual: ${formatCurrency(offer.calculation.monthlyPayment)}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`TAE: ${offer.calculation.tae.toFixed(2)}%`, {
        x: margin + 200,
        y: y,
        size: 9,
        font: font,
      });
      y -= lineHeight;
      
      page.drawText(`Coste total: ${formatCurrency(offer.calculation.totalCost)}`, {
        x: margin + 10,
        y: y,
        size: 9,
        font: font,
      });
      page.drawText(`Puntuacion: ${offer.totalScore.toFixed(0)}/100`, {
        x: margin + 200,
        y: y,
        size: 9,
        font: fontBold,
        color: rgb(0.18, 0.49, 0.29),
      });
      y -= lineHeight * 2;
    });
    
    // === FOOTER NOTE ===
    y -= 20;
    if (y < margin + 100) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    
    drawLine();
    
    page.drawText('NOTA IMPORTANTE:', {
      x: margin,
      y: y,
      size: 9,
      font: fontBold,
      color: rgb(0.5, 0.3, 0.1),
    });
    y -= lineHeight;
    
    const note = 'Este informe es orientativo y se basa en las condiciones de mercado en el momento de la consulta.';
    page.drawText(note, {
      x: margin,
      y: y,
      size: 8,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= lineHeight;
    
    const note2 = 'Las condiciones finales pueden variar segun el analisis de riesgo de cada banco.';
    page.drawText(note2, {
      x: margin,
      y: y,
      size: 8,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= lineHeight * 2;
    
    page.drawText('Documento generado por HipotecaCompare - Comparador de Hipotecas Espana', {
      x: margin,
      y: y,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="informe-hipoteca-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF' },
      { status: 500 }
    );
  }
}
