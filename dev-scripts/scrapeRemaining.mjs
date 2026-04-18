import fs from 'fs';
import path from 'path';
import axios from 'axios';
import google from 'googlethis';

const __dirname = path.resolve();
const PRODUCTS_JSON = path.join(__dirname, 'src/data/products.json');
const IMG_DIR = path.join(__dirname, 'public/images/products');

// Products that still need unique per-product images
const targets = [
  { id: 'nylon-cable-ties',            q: 'nylon cable ties bundle white black zip ties' },
  { id: 'spring-panel-hinges',         q: 'stainless steel spring loaded panel hinge electrical enclosure' },
  { id: 'pvc-channels-cable-duct',     q: 'grey PVC wiring channel cable duct slotted' },
  { id: 'double-compression-glands',   q: 'brass double compression cable gland IP68' },
  { id: 'cable-glands-sc',             q: 'brass single compression cable gland' },
  { id: 'busbar-sleeve-heat-shrink',   q: 'heat shrink busbar sleeve red yellow blue' },
  { id: 'spiral-sleeve-product',       q: 'polyethylene spiral cable wrap sleeve' },
  { id: 'tie-mount-sticking-saddle',   q: 'self adhesive cable tie mount base white' },
  { id: 'solar-mc4-connector',         q: 'MC4 solar panel connector male female pair' },
  { id: 'electrical-insulation-tapes', q: 'electrical insulation tape rolls colorful PVC' },
  { id: 'pvc-cable-glands',            q: 'PVC nylon cable gland white IP68' },
  { id: 'cable-glands-product',        q: 'cable glands assorted sizes brass' },
  { id: 'heat-shrinkable-sleeve-woer', q: 'heat shrink tubing assorted colors' },
  { id: 'end-sealing-lugs-bootlace',   q: 'bootlace ferrule insulated wire end terminal' },
  { id: 'ribbon-ferruling-machine',    q: 'hot stamping ribbon cassette ferruling machine' },
  { id: 'finger-type-busbar-support',  q: 'DMC finger type busbar support insulator' },
  { id: 'mcb-din-rail-channel',        q: 'DIN rail TS35 steel channel for MCB mounting' },
  { id: 'lugs-crimping-tools',         q: 'hydraulic cable lug crimping tool plier' },
  { id: 'dc-panel-locks-keys',         q: 'panel lock quarter turn cam lock key electrical' },
  { id: 'cable-wire-zip-ties',         q: 'cable wire zip ties nylon bundle' },
  { id: 'aluminium-foil-tape',         q: 'aluminium foil adhesive tape roll HVAC' },
  { id: 'u-shape-rubber-gasket',       q: 'U shape rubber gasket edge protection seal' },
  { id: 'busbar-insulators',           q: 'DMC busbar insulator support standoff' },
  { id: 'polyester-tapes',             q: 'polyester film tape roll yellow electrical insulation' },
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/*,*/*;q=0.8',
};

const BLACKLIST = ['indiamart','shutterstock','alamy','istock','123rf','alibaba','aliexpress','tradeindia','vectorstock','dreamstime'];

async function download(url, filepath) {
  try {
    const res = await axios({ url, method: 'GET', responseType: 'arraybuffer', timeout: 12000, headers });
    const ct = res.headers['content-type'] || '';
    if (!ct.startsWith('image/') || ct.includes('svg') || ct.includes('html')) return false;
    if (res.data.length < 5000) return false; // too small = likely a placeholder
    fs.writeFileSync(filepath, res.data);
    return true;
  } catch { return false; }
}

async function scrape(query, productId) {
  console.log(`\n🔍 [${productId}] Searching: "${query}"`);
  const fullQ = `${query} product photo -watermark -stock -logo -text -banner`;
  try {
    const imgs = await google.image(fullQ, { safe: true });
    if (!imgs?.length) { console.log('   ❌ No results'); return null; }

    for (let i = 0; i < Math.min(imgs.length, 12); i++) {
      const url = imgs[i].url;
      const lo = url.toLowerCase();
      if (BLACKLIST.some(b => lo.includes(b))) continue;

      const ext = (path.extname(new URL(url).pathname) || '.jpg').split('?')[0];
      if (!['.jpg','.jpeg','.png','.webp'].includes(ext.toLowerCase())) continue;

      const fname = `${productId}-scraped${ext}`;
      const fpath = path.join(IMG_DIR, fname);

      console.log(`   ⬇️  Attempt ${i+1}: ${url.slice(0,80)}...`);
      const ok = await download(url, fpath);
      if (!ok) { if (fs.existsSync(fpath)) fs.unlinkSync(fpath); continue; }

      console.log(`   ✅ Saved ${fname} (${(fs.statSync(fpath).size/1024).toFixed(0)}KB)`);
      return `/images/products/${fname}`;
    }
    console.log('   ❌ All attempts failed');
  } catch (e) { console.error(`   Error: ${e.message}`); }
  return null;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON));
  let success = 0, fail = 0;

  for (const t of targets) {
    const newPath = await scrape(t.q, t.id);
    if (newPath) {
      // Update the product AND its parent category
      data.categories.forEach(cat => {
        cat.products.forEach(p => {
          if (p.id === t.id) p.image = newPath;
        });
        // If the category only has this one product, update category image too
        if (cat.products.length === 1 && cat.products[0].id === t.id) {
          cat.image = newPath;
        }
      });
      success++;
    } else { fail++; }

    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2));
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\n🏁 Done! ${success} scraped, ${fail} failed.`);
}

main();
