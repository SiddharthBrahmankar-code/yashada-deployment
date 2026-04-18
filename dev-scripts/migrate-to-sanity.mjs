/**
 * Migration script: Seed Sanity with data from products.json and brands.json
 * 
 * Usage: 
 *   1. First, create a write token at https://www.sanity.io/manage/project/5sqj40tg/api#tokens
 *      - Name: "Migration"
 *      - Permissions: "Editor"
 *   2. Run: SANITY_API_TOKEN=your_token_here node scripts/migrate-to-sanity.mjs
 *      Or on Windows PowerShell:
 *      $env:SANITY_API_TOKEN="your_token_here"; node scripts/migrate-to-sanity.mjs
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: '5sqj40tg',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('\n❌ Missing SANITY_API_TOKEN environment variable.');
  console.error('Create a token at: https://www.sanity.io/manage/project/5sqj40tg/api#tokens');
  console.error('Then run: $env:SANITY_API_TOKEN="your_token"; node scripts/migrate-to-sanity.mjs\n');
  process.exit(1);
}

// Read JSON data
const productsData = JSON.parse(readFileSync(join(__dirname, '../src/data/products.json'), 'utf8'));
const brandsData = JSON.parse(readFileSync(join(__dirname, '../src/data/brands.json'), 'utf8'));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function migrate() {
  console.log('🚀 Starting migration to Sanity...\n');
  
  // Track created category IDs for product references
  const categoryIds = {};

  // ─── 1. Create Categories ────────────────────────────
  console.log('📁 Creating categories...');
  for (let i = 0; i < productsData.categories.length; i++) {
    const cat = productsData.categories[i];
    const catId = `category-${cat.id}`;
    
    const doc = {
      _id: catId,
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: cat.id },
      tagline: cat.tagline || '',
      description: cat.description || '',
      brand: cat.brand || '',
      featured: cat.featured || false,
      order: i + 1,
    };

    try {
      await client.createOrReplace(doc);
      categoryIds[cat.id] = catId;
      console.log(`  ✅ ${cat.name}`);
    } catch (err) {
      console.error(`  ❌ ${cat.name}: ${err.message}`);
    }
  }

  // ─── 2. Create Products ──────────────────────────────
  console.log('\n📦 Creating products...');
  for (const cat of productsData.categories) {
    for (let j = 0; j < cat.products.length; j++) {
      const product = cat.products[j];
      const productId = `product-${product.id}`;

      const specs = product.specs
        ? Object.entries(product.specs).map(([key, value]) => ({
            _type: 'spec',
            _key: slugify(key),
            key,
            value,
          }))
        : [];

      const doc = {
        _id: productId,
        _type: 'product',
        name: product.name,
        slug: { _type: 'slug', current: product.id },
        description: product.description || '',
        category: {
          _type: 'reference',
          _ref: categoryIds[cat.id],
        },
        specs,
        order: j + 1,
      };

      try {
        await client.createOrReplace(doc);
        console.log(`  ✅ ${product.name} (${cat.name})`);
      } catch (err) {
        console.error(`  ❌ ${product.name}: ${err.message}`);
      }
    }
  }

  // ─── 3. Create Brands ────────────────────────────────
  console.log('\n🏷️  Creating brands...');
  for (let k = 0; k < brandsData.brands.length; k++) {
    const brand = brandsData.brands[k];
    const brandId = `brand-${brand.id}`;

    const doc = {
      _id: brandId,
      _type: 'brand',
      name: brand.name,
      slug: { _type: 'slug', current: brand.id },
      tagline: brand.tagline || '',
      description: brand.description || '',
      order: k + 1,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`  ✅ ${brand.name}`);
    } catch (err) {
      console.error(`  ❌ ${brand.name}: ${err.message}`);
    }
  }

  console.log('\n✨ Migration complete!');
  console.log('   Categories:', productsData.categories.length);
  console.log('   Products:', productsData.categories.reduce((sum, c) => sum + c.products.length, 0));
  console.log('   Brands:', brandsData.brands.length);
  console.log('\n📝 Note: Images need to be uploaded manually through Sanity Studio.');
  console.log('   Open: https://yashada-enterprises.sanity.studio\n');
}

migrate().catch(console.error);
