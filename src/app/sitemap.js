import productsData from '@/data/products.json';

export const dynamic = 'force-static';

const BASE_URL = 'https://yashada.netlify.app';

export default function sitemap() {
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/brands`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Dynamic product pages
  const productPages = productsData.categories.flatMap((cat) =>
    cat.products.map((product) => ({
      url: `${BASE_URL}/products/${product.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );

  return [...staticPages, ...productPages];
}
