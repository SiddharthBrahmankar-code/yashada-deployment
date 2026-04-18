import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const PRODUCTS_JSON = path.join(__dirname, 'src/data/products.json');
const IMG_DIR = path.join(__dirname, 'public/images/products');
// The folder is actually at "d:\Yashada Enterprises website\images_to_label"
const LABELED_DIR = path.join(__dirname, '..', 'images_to_label');

const mappings = [
  { file: 'cable ties.png',                 new: 'cable-ties-user.png',                 cat: 'cable-ties',                 prod: ['cable-wire-zip-ties', 'nylon-cable-ties'] },
  { file: 'cable tray.png',                 new: 'cable-tray-user.png',                 cat: 'cable-tray',                 prod: [] },
  { file: 'crimping tool.png',              new: 'crimping-tool-user.png',              cat: 'crimping-tools',             prod: ['lugs-crimping-tools'] },
  { file: 'ferulling machine ribbon.png',   new: 'ferruling-ribbon-user.png',           cat: 'ferruling-machine-ribbon',   prod: ['ribbon-ferruling-machine'] },
  { file: 'foil tape.png',                  new: 'foil-tape-user.png',                  cat: 'foil-tape',                  prod: ['aluminium-foil-tape'] },
  { file: 'gasket.png',                     new: 'gasket-cat-user.png',                 cat: 'gasket',                     prod: ['d-shape-pu-foam-gasket'] },
  { file: 'heat shrinkable sleeve.png',     new: 'heat-shrink-user.png',                cat: 'heat-shrink-sleeve',         prod: ['heat-shrinkable-sleeve-woer'] },
  { file: 'panel lock and key.png',         new: 'panel-locks-user.png',                cat: 'panel-locks-keys',           prod: ['dc-panel-locks-keys'] },
  { file: 'pvc channel.png',                new: 'pvc-channels-user.png',               cat: null,                         prod: ['pvc-channels-cable-duct'] },
  { file: 'pvc insulation tape.png',        new: 'electrical-tape-user.png',            cat: 'electrical-insulation-tape', prod: ['electrical-insulation-tapes'] },
  { file: 'tie mount.png',                  new: 'tie-base-user.png',                   cat: 'tie-pad',                    prod: ['tie-mount-sticking-saddle'] },
  { file: 'u shaped rubber gasket.png',     new: 'u-shape-gasket-user.png',             cat: null,                         prod: ['u-shape-rubber-gasket'] }
];

function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON));
  let copied = 0;
  
  mappings.forEach(m => {
    const src = path.join(LABELED_DIR, m.file);
    const dest = path.join(IMG_DIR, m.new);
    
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${m.new}`);
      copied++;
      
      const relPath = `/images/products/${m.new}`;
      
      data.categories.forEach(c => {
        if (c.id === m.cat) c.image = relPath;
        c.products.forEach(p => {
          if (m.prod.includes(p.id)) p.image = relPath;
        });
      });
    } else {
      console.error(`❌ Missing ${m.file} at ${src}`);
    }
  });

  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2));
  console.log(`\n🏁 Done! Successfully mapped ${copied}/${mappings.length} labeled images.`);
}

main();
