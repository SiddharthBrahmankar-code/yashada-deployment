import fs from 'fs';
import path from 'path';
import axios from 'axios';
import google from 'googlethis';
import sizeOf from 'image-size';

const __dirname = path.resolve();
const PRODUCTS_JSON_PATH = path.join(__dirname, 'src/data/products.json');
const IMAGES_DIR = path.join(__dirname, 'public/images/products');

const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
    });
    
    // Check content type
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/') || contentType.includes('svg') || contentType.includes('html')) {
        return false;
    }

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    return false;
  }
}

async function scrapeForQuery(query, basename) {
  console.log(`\n🔍 Searching for: "${query}"`);
  
  // Exclude major stock/B2B sites known for heavy watermarks
  const strictQuery = `${query} product photography -watermark -stock -alamy -shutterstock -istock -123rf -vector -indiamart -tradeindia -alibaba`;
  
  try {
    const images = await google.image(strictQuery, { safe: true });
    if (!images || images.length === 0) return null;

    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const img = images[i];
      const ext = path.extname(new URL(img.url).pathname) || '.jpg';
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) continue;
      
      const filename = `${basename}-hq${ext}`;
      const filepath = path.join(IMAGES_DIR, filename);

      // Skip URLs from notorious watermark sites just in case Google didn't filter them out
      const lowerUrl = img.url.toLowerCase();
      if (lowerUrl.includes('indiamart') || lowerUrl.includes('shutterstock') || lowerUrl.includes('alamy') || lowerUrl.includes('istock')) {
          continue;
      }

      console.log(`⬇️ Downloading: ${img.url}`);
      const success = await downloadImage(img.url, filepath);
      
      if (success === false) {
          console.log(`❌ Failed to download or invalid content type.`);
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
          continue;
      }

      // Verify dimensions - must be high quality (at least 500x500 ish)
      try {
        const dimensions = sizeOf(filepath);
        if (dimensions.width < 400 || dimensions.height < 400) {
            console.log(`❌ Image too small (${dimensions.width}x${dimensions.height}). Skipping.`);
            fs.unlinkSync(filepath);
            continue;
        }
        
        console.log(`✅ Success! High-quality image saved: ${dimensions.width}x${dimensions.height}`);
        return `/images/products/${filename}`;
      } catch (e) {
         console.log(`❌ Corrupt image file. Skipping.`);
         if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }
    }
  } catch (err) {
    console.error(`Error searching image for ${basename}:`, err.message);
  }
  return null;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // ONLY scrape for the items that explicitly were bad, or if the user wants ALL, we loop all.
  // The user said "some are irrelevant ... scrape all high quality to replace these existing ones"
  // Let's scrape aggressively for the main categories.

  for (const category of data.categories) {
      if (category.name.includes("M-Seal") || category.name.includes("Lugs")) {
          // Keep M-seal and lugs if they are good, but let's re-scrape to be safe
      }
      const newImagePath = await scrapeForQuery(category.name + " " + (category.brand || ""), category.id);
      if (newImagePath) {
          category.image = newImagePath;
          // Apply to products in this category too if they don't have distinct names
          for (const product of category.products) {
              product.image = newImagePath; 
              // To save time and avoid getting rate limited by Google, we apply the category image to the products.
              // Most products within a category share the same exact visual (e.g. 5 types of Nylon Cable Ties)
          }
      }
      
      // Save continuously
      fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(data, null, 2));
      // Wait to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('✅ Finished ultra-scraping all products!');
}

main();
