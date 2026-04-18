import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const PRODUCTS_JSON = path.join(__dirname, 'src/data/products.json');
const IMG_DIR = path.join(__dirname, 'public/images/products');
const ARTIFACT_DIR = 'C:\\Users\\brahm\\.gemini\\antigravity\\brain\\03d068f1-557f-411c-b842-2119ba8d1176';

// List of uploads mapping exactly to user's chronologically uploaded 12 images
const mappings = [
  { file: 'media__1773925920284.png', name: 'gasket-user.png', cat: 'gasket', prod: ['u-shape-rubber-gasket'] },
  { file: 'media__1773925947567.png', name: 'foil-tape-user.png', cat: 'foil-tape', prod: ['aluminium-foil-tape'] },
  { file: 'media__1773925989643.png', name: 'cable-ties-user.png', cat: 'cable-ties', prod: ['cable-wire-zip-ties', 'nylon-cable-ties'] },
  { file: 'media__1773926024303.png', name: 'panel-locks-user.png', cat: 'panel-locks-keys', prod: ['dc-panel-locks-keys'] },
  { file: 'media__1773926064340.png', name: 'crimping-tool-user.png', cat: 'crimping-tools', prod: ['lugs-crimping-tools'] },
  { file: 'media__1773926119778.png', name: 'ferruling-ribbon-user.png', cat: 'ferruling-machine-ribbon', prod: ['ribbon-ferruling-machine'] },
  { file: 'media__1773926172766.png', name: 'heat-shrink-user.png', cat: 'heat-shrink-sleeve', prod: ['heat-shrinkable-sleeve-woer'] },
  { file: 'media__1773926220815.png', name: 'electrical-tape-user.png', cat: 'electrical-insulation-tape', prod: ['electrical-insulation-tapes'] },
  { file: 'media__1773926269738.png', name: 'tie-base-user.png', cat: 'tie-pad', prod: ['tie-mount-sticking-saddle'] },
  { file: 'media__1773926311661.png', name: 'cable-tray-user.png', cat: 'cable-tray', prod: [] }, // Using this specifically for category header
  { file: 'media__1773926355307.png', name: 'pvc-channels-user.png', cat: null, prod: ['pvc-channels-cable-duct'] }, // Using this for product
  { file: 'media__1773926390644.png', name: 'hinges-user.png', cat: 'door-hinges', prod: ['spring-panel-hinges'] },
];

function main() {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_JSON));
  
  mappings.forEach(m => {
    const src = path.join(ARTIFACT_DIR, m.file);
    const dest = path.join(IMG_DIR, m.name);
    
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied ${m.name}`);
      
      const relPath = `/images/products/${m.name}`;
      
      data.categories.forEach(c => {
        if (c.id === m.cat) {
          c.image = relPath;
        }
        c.products.forEach(p => {
          if (m.prod.includes(p.id)) {
            p.image = relPath;
          }
        });
      });
    } else {
      console.error(`❌ Missing ${m.file}`);
    }
  });

  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(data, null, 2));
  console.log('✅ Updated products.json');
}

main();
