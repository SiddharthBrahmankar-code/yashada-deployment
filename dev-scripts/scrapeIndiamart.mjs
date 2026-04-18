import fs from 'fs';
import path from 'path';
import axios from 'axios';
import google from 'googlethis';

const __dirname = path.resolve();
const PRODUCTS_JSON = path.join(__dirname, 'src/data/products.json');
const IMG_DIR = path.join(__dirname, 'public/images/products');

const targets = [
  { id: 'spring-panel-hinges',         catId: 'door-hinges',        q: 'site:indiamart.com spring loaded panel door hinge electrical' },
  { id: 'pvc-channels-cable-duct',     catId: 'cable-tray',         q: 'site:indiamart.com pvc wiring channel cable duct' },
  { id: 'spiral-sleeve-product',       catId: 'spiral-sleeve',      q: 'site:indiamart.com polyethylene spiral cable sleeve wrapping' },
  { id: 'tie-mount-sticking-saddle',   catId: 'tie-pad',            q: 'site:indiamart.com self adhesive cable tie mount pad sticking saddle' },
  { id: 'finger-type-busbar-support',  catId: 'busbar-support',     q: 'site:indiamart.com SMC DMC finger type busbar support' },
  { id: 'aluminium-foil-tape',         catId: 'foil-tape',          q: 'site:indiamart.com aluminium foil adhesive tape' },
  { id: 'u-shape-rubber-gasket',       catId: 'gasket',             q: 'site:indiamart.com u shape rubber beading gasket edge protection' },
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/*,*/*;q=0.8',
};

async function download(url, filepath) {
  try {
    const res = await axios({ url, method: 'GET', responseType: 'arraybuffer', timeout: 8000, headers });
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/')) return false;
    if (res.data.length < 3000) return false;
    fs.writeFileSync(filepath, res.data);
    return true;
  } catch { return false; }
}

async function scrape(query, productId) {
  console.log(`\n🔍 [${productId}] Searching: "${query}"`);
  try {
    const imgs = await google.image(query, { safe: true });
    if (!imgs?.length) { console.log('   ❌ No results'); return null; }

    for (let i = 0; i < Math.min(imgs.length, 10); i++) {
      const url = imgs[i].url;
      const ext = (path.extname(new URL(url).pathname) || '.jpg').split('?')[0];
      if (!['.jpg','.jpeg','.png','.webp'].includes(ext.toLowerCase())) continue;

      const fname = `${productId}-indiamart${ext}`;
      const fpath = path.join(IMG_DIR, fname);

      console.log(`   ⬇️  Attempt ${i+1}: ${url.slice(0,70)}...`);
      const ok = await download(url, fpath);
      if (!ok) { if (fs.existsSync(fpath)) fs.unlinkSync(fpath); continue; }

      console.log(`   ✅ Saved ${fname} (${(fs.statSync(fpath).size/1024).toFixed(0)}KB)`);
      return `/images/products/${fname}`;
    }
  } catch (e) { console.error(`   Error: ${e.message}`); }
  return null;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON));
  let success = 0;

  for (const t of targets) {
    const newPath = await scrape(t.q, t.id);
    if (newPath) {
      data.categories.forEach(cat => {
        if (cat.id === t.catId) cat.image = newPath;
        cat.products.forEach(p => {
          if (p.id === t.id) p.image = newPath;
        });
      });
      success++;
    }
    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2));
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\n🏁 Done! ${success}/${targets.length} fetched from IndiaMART.`);
}

main();
