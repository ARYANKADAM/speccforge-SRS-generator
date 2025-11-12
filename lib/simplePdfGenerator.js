import pkg from 'jspdf';
const { jsPDF } = pkg;
import fs from 'fs';
import path from 'path';
import os from 'os';

// Fallback simple PDF generator without Puppeteer
export async function generateSimplePDF(markdown, projectName = 'SRS-Document') {
  try {
    console.log('Using simple PDF generator as fallback');
    console.log('Markdown length:', markdown.length);
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title page
    doc.setFontSize(24);
    doc.text(projectName, 105, 100, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('Software Requirements Specification', 105, 120, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 140, { align: 'center' });
    
    // Add new page for content
    doc.addPage();
    
    // Add content with better formatting
    doc.setFontSize(10);
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;
    
    // Split markdown into lines and add to PDF
    const lines = markdown.split('\n');
    
    for (let line of lines) {
      // Handle headings
      if (line.startsWith('# ')) {
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        const text = line.substring(2);
        const wrappedText = doc.splitTextToSize(text, 170);
        
        // Add new page if needed
        if (yPosition + (wrappedText.length * 8) > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 8 + 5;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
      } else if (line.startsWith('## ')) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        const text = line.substring(3);
        const wrappedText = doc.splitTextToSize(text, 170);
        
        if (yPosition + (wrappedText.length * 7) > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 7 + 4;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
      } else if (line.startsWith('### ')) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const text = line.substring(4);
        const wrappedText = doc.splitTextToSize(text, 170);
        
        if (yPosition + (wrappedText.length * 6) > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 6 + 3;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
      } else if (line.trim() !== '') {
        // Regular text
        const wrappedText = doc.splitTextToSize(line, 170);
        
        if (yPosition + (wrappedText.length * 5) > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 5;
      } else {
        // Empty line - add small space
        yPosition += 3;
      }
    }
    
    // Generate PDF as Uint8Array instead of arraybuffer
    const pdfData = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfData);
    
    console.log('Simple PDF generated, size:', pdfBuffer.length, 'bytes');
    
    // Save to temp directory for debugging
    try {
      const tempPath = path.join(os.tmpdir(), `${projectName.replace(/[^a-z0-9]/gi, '_')}_debug.pdf`);
      fs.writeFileSync(tempPath, pdfBuffer);
      console.log('DEBUG: PDF saved locally at:', tempPath);
      console.log('DEBUG: You can open this file to verify PDF is valid');
    } catch (saveError) {
      console.error('Could not save debug PDF:', saveError.message);
    }
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Simple PDF generation error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
