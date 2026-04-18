import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/data';
import InquiryButton from '@/components/InquiryButton';
import styles from './productDetail.module.css';
import cardStyles from '../products.module.css';

export const dynamicParams = false;

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
  const { lang, slug } = await params;
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
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
            <ol className={styles.breadcrumb}>
              <li className={styles.breadcrumbItem}>
                <Link href={`/${lang}`} className={styles.breadcrumbLink}>Home</Link>
              </li>
              <li className={styles.breadcrumbSeparator} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </li>
              <li className={styles.breadcrumbItem}>
                <Link href={`/${lang}/products`} className={styles.breadcrumbLink}>Products</Link>
              </li>
              {category && (
                <>
                  <li className={styles.breadcrumbSeparator} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </li>
                  <li className={styles.breadcrumbItem}>
                    <Link href={`/${lang}/products#${category.id}`} className={styles.breadcrumbLink}>{category.name}</Link>
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
                  marginBottom: '1.5rem',
                }}
              >
                {product.description}
              </p>

              {/* Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
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
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <InquiryButton product={{ id: product.id, name: product.name }} className="btn btn--gold" />
                <a
                  href={`https://wa.me/918208997234?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20from%20your%20${encodeURIComponent(category?.name || '')}%20range.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--glass"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`https://wa.me/918208997234?text=Hello%2C%20I%20would%20like%20to%20request%20the%20datasheet%20for%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--glass"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Datasheet
                </a>
              </div>

              {/* Social Proof snippet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: 450 }}>
                 <div style={{display: 'flex'}}>
                    {[1,2,3].map((i) => <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,168,83,0.1)', border: '2px solid var(--clr-dark-surface)', marginLeft: i > 1 ? -12 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-accent)', zIndex: 4-i }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>)}
                 </div>
                 <div style={{fontSize: '0.85rem', color: 'var(--clr-text-muted)'}}>
                    <strong style={{color: 'var(--clr-text-light)', fontWeight: 600}}>Trusted Choice</strong><br/>
                    Supplied to 50+ industrial panel builders.
                 </div>
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
                    <div key={related.id} className={cardStyles.productCard}>
                      <Link href={`/${lang}/products/${related.id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${related.name}`} />
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
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
