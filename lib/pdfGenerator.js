import puppeteer from 'puppeteer';
import { marked } from 'marked';

export async function generatePDF(markdown, projectName = 'SRS-Document') {
  let browser;
  
  try {
    console.log('Starting PDF generation for:', projectName);
    
    // Convert markdown to HTML
    const htmlContent = marked(markdown);
    console.log('Markdown converted to HTML successfully');
    
    // Create styled HTML document
    const styledHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${projectName} - Software Requirements Specification</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 2.5cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      font-size: 11pt;
      background: white;
    }
    
    /* Cover Page */
    .cover-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      text-align: center;
    }
    
    .cover-page h1 {
      font-size: 32pt;
      color: #2563eb;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .cover-page h2 {
      font-size: 24pt;
      color: #1e40af;
      margin-bottom: 40px;
      font-weight: 600;
    }
    
    .cover-page .subtitle {
      font-size: 14pt;
      color: #64748b;
      margin-bottom: 10px;
    }
    
    .cover-page .date {
      font-size: 12pt;
      color: #94a3b8;
      margin-top: 30px;
    }
    
    /* Headers */
    h1 {
      color: #1e40af;
      font-size: 24pt;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 3px solid #3b82f6;
      page-break-after: avoid;
    }
    
    h2 {
      color: #2563eb;
      font-size: 18pt;
      margin-top: 25px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    
    h3 {
      color: #3b82f6;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    
    h4 {
      color: #60a5fa;
      font-size: 12pt;
      margin-top: 15px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    
    /* Paragraphs */
    p {
      margin-bottom: 12px;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }
    
    /* Lists */
    ul, ol {
      margin-left: 25px;
      margin-bottom: 15px;
    }
    
    li {
      margin-bottom: 8px;
      line-height: 1.7;
    }
    
    ul li {
      list-style-type: disc;
    }
    
    ul ul li {
      list-style-type: circle;
    }
    
    /* Strong and emphasis */
    strong {
      color: #1e40af;
      font-weight: 600;
    }
    
    em {
      font-style: italic;
      color: #475569;
    }
    
    /* Code blocks */
    code {
      background-color: #f1f5f9;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      color: #be123c;
    }
    
    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 15px 0;
      page-break-inside: avoid;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: #334155;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px;
      text-align: left;
    }
    
    th {
      background-color: #3b82f6;
      color: white;
      font-weight: 600;
    }
    
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    /* Blockquotes */
    blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 20px;
      margin: 20px 0;
      color: #475569;
      font-style: italic;
      background-color: #f8fafc;
      padding: 15px 20px;
      border-radius: 0 5px 5px 0;
    }
    
    /* Page breaks */
    .page-break {
      page-break-after: always;
    }
    
    /* Section spacing */
    section {
      margin-bottom: 30px;
    }
    
    /* Footer styling for page numbers */
    @page {
      @bottom-center {
        content: counter(page) " of " counter(pages);
        font-size: 9pt;
        color: #64748b;
      }
    }
    
    /* Prevent orphans and widows */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
    
    /* Hyperlinks */
    a {
      color: #2563eb;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Print optimization */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="cover-page">
    <h1>${projectName}</h1>
    <h2>Software Requirements Specification</h2>
    <p class="subtitle">IEEE Standard Format</p>
    <p class="subtitle">Version 1.0</p>
    <p class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
    `;
    
    console.log('HTML template created, launching Puppeteer...');
    
    // Launch Puppeteer with better configuration
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      timeout: 60000, // 60 second timeout
    });
    
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('New page created');
    
    // Set content and wait for it to load
    await page.setContent(styledHTML, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('Content loaded, generating PDF...');
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '25mm',
        bottom: '20mm',
        left: '25mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 9pt; color: #64748b; width: 100%; text-align: center; margin: 0 25mm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
    });
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    
    await browser.close();
    console.log('Browser closed');
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error.stack);
    
    if (browser) {
      try {
        await browser.close();
        console.log('Browser closed after error');
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
