/**
 * Data layer — reads directly from local JSON files.
 * To add/edit products, simply update products.json and brands.json.
 */

import productsJson from '@/data/products.json';
import brandsJson from '@/data/brands.json';

// ─── Public API ──────────────────────────────────────────

/**
 * Get all categories with their products
 */
export function getCategories() {
  return productsJson.categories;
}

/**
 * Get a single product by slug, including its parent category
 */
export function getProductBySlug(slug) {
  let product = null;
  let category = null;

  for (const cat of productsJson.categories) {
    const found = cat.products.find((p) => p.id === slug);
    if (found) {
      product = found;
      category = cat;
      break;
    }
  }

  return product ? { ...product, category } : null;
}

/**
 * Get all product slugs (for static page generation)
 */
export function getAllProductSlugs() {
  const slugs = [];
  productsJson.categories.forEach((cat) => {
    cat.products.forEach((p) => slugs.push(p.id));
  });
  return slugs;
}

/**
 * Get all brands
 */
export function getBrands() {
  return brandsJson.brands;
}

/**
 * Get featured categories for homepage (max 3)
 */
export function getFeaturedCategories() {
  return productsJson.categories.filter((c) => c.featured).slice(0, 3);
}
