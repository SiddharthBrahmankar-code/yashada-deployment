import Link from 'next/link';
import Image from 'next/image';
import { getBrands } from '@/lib/data';
import { getDictionary } from '@/i18n/dictionaries';
import styles from './brands.module.css';

export const metadata = {
  title: 'Our Brands | Steelgrip, Abro, Woer | Yashada Enterprises',
  description: 'Authorized distributor for Steelgrip, Abro, and Woer — India\'s trusted industrial brands for electrical insulation tapes, packing tapes, and heat shrink sleeves.',
  keywords: ['Steelgrip distributor', 'Abro tape', 'Woer heat shrink', 'industrial brands nashik', 'Yashada Enterprises'],
  openGraph: {
    title: 'Our Brands | Yashada Enterprises',
    description: 'Direct distributors for India\'s leading industrial tape manufacturers.',
  }
};

export default async function BrandsPage({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);
  const brands = await getBrands();

  return (
    <>
      {/* Hero */}
      <section
        className="section--dark"
        style={{
          paddingTop: 'calc(var(--header-height) + 4rem)',
          paddingBottom: 'var(--space-xl)',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>Our Partners</div>
          <h1 className="ourstory__heading" style={{ marginBottom: '1.5rem' }}>
            BRANDS WE<br />
            <span className="accent">DISTRIBUTE</span>
          </h1>
          <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '1.125rem', color: 'var(--clr-text-muted)' }}>
            We are authorized distributors for India&apos;s most trusted industrial
            brands. Quality guaranteed, direct from source.
          </p>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section--dark" style={{ padding: 'var(--space-section) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={styles.brandCardHover}
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255,255,255,0.02)',
                  overflow: 'hidden',
                  transition: 'border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Brand image */}
                {brand.image ? (
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <Image
                      src={brand.image}
                      alt={`${brand.name} authorized distribution by Yashada`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--clr-dark-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, color: 'rgba(255,255,255,0.05)' }}>
                       {brand.name.charAt(0)}
                     </div>
                  </div>
                )}

                <div style={{ padding: '2rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(212,168,83,0.1)',
                      border: '1px solid rgba(212,168,83,0.2)',
                      color: 'var(--clr-accent)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      marginBottom: '1rem',
                    }}
                  >
                    {brand.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--clr-accent)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {brand.tagline}
                  </div>
                  <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                    {brand.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section--dark" style={{ padding: 'var(--space-section) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="ourstory__heading" style={{ marginBottom: '1.5rem' }}>
            NEED PRODUCTS FROM <span className="accent">THESE BRANDS</span>?
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: 500, margin: '0 auto 2rem' }}>
            As authorized distributors, we offer genuine products at
            competitive prices with prompt delivery.
          </p>
          <Link href={`/${lang}/contact`} className="btn btn--gold" style={{ display: 'inline-flex' }}>
            {t.cta?.inquiry || 'Send Inquiry'}
          </Link>
        </div>
      </section>
    </>
  );
}
