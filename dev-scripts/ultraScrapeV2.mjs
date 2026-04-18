import fs from 'fs';
import path from 'path';
import axios from 'axios';
import google from 'googlethis';
import sizeOf from 'image-size';

const __dirname = path.resolve();
const PRODUCTS_JSON_PATH = path.join(__dirname, 'src/data/products.json');
const IMAGES_DIR = path.join(__dirname, 'public/images/products');

const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
};

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 15000,
      headers
    });
    
    // Check content type
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/') || contentType.includes('svg') || contentType.includes('html')) {
        console.log(`⚠️ Invalid content type: ${contentType}`);
        return false;
    }

    fs.writeFileSync(filepath, response.data);
    return true;
  } catch (err) {
    console.log(`⚠️ Axios Error: ${err.message}`);
    return false;
  }
}

async function scrapeForQuery(query, basename) {
  console.log(`\n🔍 Searching for: "${query}"`);
  
  // Use a highly refined query targeting pristine product catalogs minus the watermarks
  const strictQuery = `${query} high resolution product photography -watermark -stock -alamy -shutterstock -istock -123rf -vector -indiamart -tradeindia -alibaba -aliexpress`;
  
  try {
    const images = await google.image(strictQuery, { safe: true });
    if (!images || images.length === 0) return null;

    let attempts = 0;
    for (let i = 0; i < images.length && attempts < 8; i++) {
        attempts++;
      const img = images[i];
      const ext = path.extname(new URL(img.url).pathname) || '.jpg';
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) continue;
      
      const filename = `${basename}-hq${ext}`;
      const filepath = path.join(IMAGES_DIR, filename);

      const lowerUrl = img.url.toLowerCase();
      if (lowerUrl.includes('indiamart') || lowerUrl.includes('shutterstock') || lowerUrl.includes('alamy') || lowerUrl.includes('istock')) {
          continue;
      }

      console.log(`⬇️ Downloading: ${img.url}`);
      const success = await downloadImage(img.url, filepath);
      
      if (success === false) {
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
          continue;
      }

      // Verify dimensions
      try {
        const dimensions = sizeOf(filepath);
        if (dimensions.width < 300 || dimensions.height < 300) {
            console.log(`❌ Image too small (${dimensions.width}x${dimensions.height}). Skipping.`);
            fs.unlinkSync(filepath);
            continue;
        }
        console.log(`✅ Success! High-quality image saved: ${dimensions.width}x${dimensions.height}`);
      } catch (e) {
         console.log(`⚠️ Unreadable header by image-size (likely WebP/AVIF). Keeping file anyway.`);
      }
      return `/images/products/${filename}`;
    }
  } catch (err) {
    console.error(`Error searching image for ${basename}:`, err.message);
  }
  return null;
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const category of data.categories) {
      if (category.image && category.image.includes('-hq')) {
          console.log(`⏩ ${category.name} already processed.`);
          continue;
      }

      const q = category.name.replace(/tapes?/i, 'tape');
      const newImagePath = await scrapeForQuery(q + " " + (category.brand || ""), category.id);
      
      if (newImagePath) {
          category.image = newImagePath;
          for (const product of category.products) {
              product.image = newImagePath; 
          }
      }
      
      fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(data, null, 2));
      await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('✅ Finished ultra-scraping all products!');
}

main();
