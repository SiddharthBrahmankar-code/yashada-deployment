import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/data';
import styles from './productDetail.module.css';
import cardStyles from '../products.module.css';

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const title = `${product.name} | Yashada Enterprises`;
  const description = product.description || `Buy ${product.name} from Yashada Enterprises, Nashik. Quality industrial tapes and electrical components.`;
  const url = `https://yashada.netlify.app/products/${slug}`;
  
  const keywords = [
    product.name,
    product.category?.name,
    product.specs?.Brand,
    'Yashada Enterprises',
    'Nashik',
    'Industrial Tapes',
    'Electrical Components',
    'buy online',
    'dealer',
    'distributor'
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Yashada Enterprises',
      images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const category = product.category;

  // JSON-LD structured data — use IndividualProduct (no pricing data available)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Buy ${product.name} from Yashada Enterprises.`,
    image: product.image ? [`https://yashada.netlify.app${product.image}`] : [],
    category: category?.name,
    brand: {
      '@type': 'Brand',
      name: product.specs?.Brand || 'Yashada Enterprises',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Yashada Enterprises',
      url: 'https://yashada.netlify.app',
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://yashada.netlify.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://yashada.netlify.app/products',
      },
      ...(category ? [{
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://yashada.netlify.app/products#${category.id}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: product.name,
      },
    ],
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section
        className="section--dark"
        style={{
          paddingTop: 'calc(var(--header-height) + 3rem)',
          paddingBottom: 'var(--space-xl)',
          minHeight: '90vh',
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
            <ol className={styles.breadcrumb}>
              <li className={styles.breadcrumbItem}>
                <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </li>
              <li className={styles.breadcrumbItem}>
                <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
              </li>
              {category && (
                <>
                  <li className={styles.breadcrumbSeparator} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </li>
                  <li className={styles.breadcrumbItem}>
                    <Link href={`/products#${category.id}`} className={styles.breadcrumbLink}>{category.name}</Link>
                  </li>
                </>
              )}
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </li>
              <li className={`${styles.breadcrumbItem} ${styles.breadcrumbCurrent}`} aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className={styles.grid}>
            {/* Product Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--clr-border-dark)',
                background: 'var(--clr-dark-elevated)',
              }}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`${product.name} - high-performance industrial product by Yashada`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--clr-dark-elevated) 0%, rgba(212,168,83,0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    color: 'var(--clr-accent)',
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="label" style={{ marginBottom: '1rem' }}>
                {category?.name || 'Yashada Enterprises'} · {product.specs?.Brand || 'Yashada'}
              </div>

              <h1 className="heading-1" style={{ marginBottom: '1.5rem' }}>
                {product.name}
              </h1>

              <p
                style={{
                  color: 'var(--clr-text-muted)',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                }}
              >
                {product.description}
              </p>

              {/* Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3
                    className="heading-3"
                    style={{ marginBottom: '1rem', fontSize: '1.125rem' }}
                  >
                    Specifications
                  </h3>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                    }}
                  >
                    <tbody>
                      {Object.entries(product.specs).map(([key, value]) => (
                        <tr
                          key={key}
                          style={{
                            borderBottom: '1px solid var(--clr-border-dark)',
                          }}
                        >
                          <td
                            style={{
                              padding: '0.75rem 0',
                              color: 'var(--clr-text-muted)',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              width: '40%',
                            }}
                          >
                            {key}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem 0',
                              color: 'var(--clr-text-light)',
                              fontSize: '0.875rem',
                            }}
                          >
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn--gold">
                  Inquire About This Product
                </Link>
                <a
                  href={`https://wa.me/918208997234?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20from%20your%20${encodeURIComponent(category?.name || '')}%20range.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--glass"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {category && category.products && (
            <div style={{ marginTop: 'var(--space-2xl)' }}>
              <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>
                More from {category.name}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {category.products
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((related) => (
                    <Link href={`/products/${related.id}`} key={related.id} className={cardStyles.productCard}>
                      <div className={cardStyles.productImage} style={{ position: 'relative' }}>
                        {related.image ? (
                          <Image
                            src={related.image}
                            alt={related.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            style={{ objectFit: 'cover' }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, var(--clr-dark-elevated) 0%, var(--clr-dark-surface) 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2rem',
                              color: 'var(--clr-accent)',
                            }}
                          >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09c-.658.003-1.25.396-1.51 1z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={cardStyles.productContent}>
                        <div className={cardStyles.productCategory}>
                          {related.specs?.Brand || category.name}
                        </div>
                        <h4 className={cardStyles.productName}>{related.name}</h4>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
