import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../src/data/products.json');
const publicRoot = path.resolve(__dirname, '../public');
const outputPath = path.resolve(publicRoot, 'catalog.pdf');

// Colors
const clrDark = '#07070b';
const clrDarkSurface = '#111116';
const clrAccent = '#d4a853';
const clrTextLight = '#eae6e0';
const clrTextMuted = '#7a7682';

// Load Data
const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const categories = productsData.categories;

const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

// Listen for page adds to always fill dark background
doc.on('pageAdded', () => {
    const currY = doc.y;
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(clrDark);
    doc.y = currY; 
});

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
doc.pipe(fs.createWriteStream(outputPath));

// Draw initial cover page background
doc.rect(0, 0, doc.page.width, doc.page.height).fill(clrDark);

// Cover Page
doc.y = doc.page.height / 2 - 80;
doc.fillColor(clrAccent).fontSize(32).font('Helvetica-Bold').text('YASHADA ENTERPRISES', { align: 'center', characterSpacing: 2 });
doc.moveDown(0.5);
doc.fillColor(clrTextMuted).fontSize(12).font('Helvetica').text('Precision Industrial Tapes & Electrical Components', { align: 'center', characterSpacing: 1 });
doc.moveDown(2);
doc.fillColor(clrTextLight).fontSize(16).text('PRODUCT CATALOG 2026', { align: 'center', characterSpacing: 1.5 });

doc.addPage();

// Content Pages
function checkPageSpace(requiredSpace) {
    if (doc.y + requiredSpace > doc.page.height - 50) {
        doc.addPage();
        return true;
    }
    return false;
}

const drawBadge = (doc, text, x, y) => {
    doc.fontSize(8).font('Helvetica-Bold');
    const width = doc.widthOfString(text) + 12;
    const height = 16;
    doc.roundedRect(x, y, width, height, 8).fill(clrDarkSurface).lineWidth(0.5).stroke(clrAccent);
    doc.fillColor(clrAccent).text(text, x + 6, y + 4);
    return width;
};

categories.forEach((category) => {
    checkPageSpace(120);

    doc.moveDown(1);
    
    // Category Header Banner
    const startY = doc.y;
    doc.rect(50, startY, doc.page.width - 100, 3).fill(clrAccent);
    
    doc.y = startY + 15;
    doc.fillColor(clrTextLight).fontSize(20).font('Helvetica-Bold').text(category.name.toUpperCase(), 50, doc.y);
    doc.moveDown(0.3);
    doc.fillColor(clrTextMuted).fontSize(11).font('Helvetica').text(category.description, { width: doc.page.width - 100 });
    
    doc.moveDown(2);

    category.products.forEach((product) => {
        checkPageSpace(150);

        const prodY = doc.y;
        
        // Product Card BG
        doc.roundedRect(50, prodY - 10, doc.page.width - 100, 130, 8).fill(clrDarkSurface);
        // Card Border
        doc.roundedRect(50, prodY - 10, doc.page.width - 100, 130, 8).lineWidth(0.5).stroke('rgba(255,255,255,0.05)');

        // Left Col (Image)
        let imgWidth = 120;
        let imgHeight = 90;
        let imgX = 65;
        let imgY = prodY + 5;
        
        doc.rect(imgX, imgY, imgWidth, imgHeight).fill('#1a1a24'); // placeholder box
        
        if (product.image) {
            // Strip leading slash to prevent absolute path resolution issues
            const formattedImage = product.image.replace(/^\/+/, '');
            const imgPath = path.resolve(publicRoot, formattedImage);
            if (fs.existsSync(imgPath)) {
                try {
                     doc.image(imgPath, imgX, imgY, { fit: [imgWidth, imgHeight], align: 'center', valign: 'center' });
                } catch(e) { /* ignore */ }
            }
        }

        // Right Col (Text)
        let textX = 205;
        let textY = prodY + 5;
        
        doc.fillColor(clrTextLight).fontSize(14).font('Helvetica-Bold').text(product.name, textX, textY);
        let currTextY = doc.y + 5;
        
        // Badges
        if (product.specs) {
            let badgeX = textX;
            Object.entries(product.specs).forEach(([key, value]) => {
                if(value) {
                   let badgeW = drawBadge(doc, `${key}: ${value}`, badgeX, currTextY);
                   badgeX += badgeW + 8;
                }
            });
            currTextY += 25;
        } else {
             // Fallback badge if no specs
             let badgeW = drawBadge(doc, `Brand: Yashada`, textX, currTextY);
             currTextY += 25;
        }

        // Description
        // make sure it stays within standard padding
        doc.fillColor(clrTextMuted).fontSize(10).font('Helvetica').text(product.description, textX, currTextY, { width: doc.page.width - textX - 65, height: 40, ellipsis: true });
        
        doc.y = Math.max(imgY + imgHeight, doc.y) + 35; // reset y for next product
    });
});

doc.end();
console.log(`✅ Presentation-ready PDF Catalog successfully generated at: ${outputPath}`);
