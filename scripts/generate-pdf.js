import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dataPath = path.resolve(__dirname, '../src/data/products.json');
const outputPath = path.resolve(__dirname, '../public/catalog.pdf');

// Load Data
const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const categories = productsData.categories;

// Create PDF
const doc = new PDFDocument({ margin: 50, size: 'A4' });

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

doc.pipe(fs.createWriteStream(outputPath));

// Branding Colors
const clrDark = '#07070b';
const clrAccent = '#d4a853';
const clrTextLight = '#eae6e0';
const clrTextMuted = '#7a7682';

// Register Fonts if needed (Using standard for Node.js compat, but can be customized)
// Using standard Helvetica for clean industrial look

function printHeader() {
  doc
    .fillColor(clrAccent)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('YASHADA ENTERPRISES', { align: 'center' })
    .moveDown(0.2);

  doc
    .fillColor(clrTextMuted)
    .fontSize(10)
    .font('Helvetica')
    .text('Precision Industrial Tapes & Electrical Components', { align: 'center' })
    .moveDown(2);
    
  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor(clrAccent)
    .stroke()
    .moveDown(2);
}

// Cover Page
doc.rect(0, 0, doc.page.width, doc.page.height).fill(clrDark);
doc.y = doc.page.height / 2 - 50;
printHeader();
doc.addPage();

// Content Pages
let isFirstPage = true;

categories.forEach((category) => {
  if (!isFirstPage) doc.addPage();
  isFirstPage = false;
  
  // Reset Background for content
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
  
  // Category Title
  doc.y = 50;
  doc
    .fillColor(clrDark)
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(category.name.toUpperCase())
    .moveDown(0.5);

  doc
    .fillColor('#555555')
    .fontSize(12)
    .font('Helvetica')
    .text(category.description)
    .moveDown(2);

  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#dddddd').stroke().moveDown(2);

  // Products
  category.products.forEach((product, idx) => {
    // Check page overflow
    if (doc.y > 700) {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');
      doc.y = 50;
    }

    doc
      .fillColor(clrDark)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(product.name)
      .moveDown(0.3);
      
    if (product.specs?.Brand) {
      doc
        .fillColor(clrAccent)
        .fontSize(10)
        .text(`Brand: ${product.specs.Brand}`)
        .moveDown(0.5);
    } else {
      doc.moveDown(0.5);
    }

    doc
      .fillColor('#444444')
      .fontSize(11)
      .font('Helvetica')
      .text(product.description, { width: 495 })
      .moveDown(1.5);
      
    // Separator between products
    if (idx < category.products.length - 1) {
       doc.moveTo(50, doc.y).lineTo(300, doc.y).strokeColor('#eeeeee').stroke().moveDown(1.5);
    }
  });
});

// Finalize
doc.end();
console.log(`✅ PDF Catalog successfully generated at: ${outputPath}`);
