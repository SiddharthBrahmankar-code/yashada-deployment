import Link from 'next/link';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | Yashada Enterprises',
  description: 'Learn about Yashada Enterprises — converters of self-adhesive tapes and distributors of industrial electrical components, based in Nashik since 2005.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className={`section--dark ${styles.hero}`}>
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>About Us</div>
          <h1 className="ourstory__heading" style={{ marginBottom: '1.5rem' }}>
            BUILT ON <span className="accent">TRUST</span>,<br />
            DRIVEN BY <span className="accent">QUALITY</span>
          </h1>
          <p
            style={{ maxWidth: 640, margin: '0 auto', fontSize: '1.125rem', color: 'var(--clr-text-muted)' }}
          >
            Since 2005, Yashada Enterprises has been a trusted name in industrial
            electrical components — manufacturing precision tapes and distributing
            premium brands from our facility in Nashik.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={`section--dark ${styles.section}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div>
              <div className="label" style={{ marginBottom: '1rem' }}>
                Our Story
              </div>
              <h2 className="ourstory__heading" style={{ fontSize: 'var(--fs-h2)', marginBottom: '1.5rem' }}>
                FROM A SMALL <span className="accent">WORKSHOP</span><br />
                TO A TRUSTED NAME
              </h2>
              <div style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '1rem' }}>
                  Founded by <strong style={{ color: 'var(--clr-text-light)' }}>Dilip Brahmankar</strong> in 2005, Yashada Enterprises
                  started as a small tape conversion unit in Ambad, Nashik. With a focus on
                  quality and customer relationships, the business quickly grew into a
                  comprehensive supplier of industrial electrical components.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Today, we operate from our facility at Shree Sai Industrial Estate, serving
                  panel builders, OEMs, and electrical contractors across Maharashtra and beyond.
                  We manufacture self-adhesive tapes in-house and are authorized distributors
                  for 8 leading brands.
                </p>
                <p>
                  Our philosophy is simple: provide the right product, at the right price,
                  delivered on time. Every time.
                </p>
              </div>
            </div>

            <div className={styles.image}>
              <img
                src="/images/about/facility.png"
                alt="Yashada Enterprises facility and workshop"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section--dark ${styles.section}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
            <h2 className="ourstory__heading">
              OUR <span className="accent">PROMISE</span>
            </h2>
          </div>

          <div className={styles.valuesGrid}>
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke="#d4a853" strokeWidth="1.5" />
                    <path d="M9 16l5 5 9-9" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Quality Assured',
                desc: 'Every product is tested and verified before delivery. We never compromise on quality.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4v14l6 6" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="13" stroke="#d4a853" strokeWidth="1.5" />
                  </svg>
                ),
                title: 'Fast Delivery',
                desc: 'Large inventory and efficient logistics mean your orders are dispatched quickly.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="10" width="24" height="16" rx="2" stroke="#d4a853" strokeWidth="1.5" />
                    <path d="M10 10V8a6 6 0 0 1 12 0v2" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Competitive Pricing',
                desc: 'Direct manufacturing and brand partnerships let us offer the best market rates.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="12" cy="10" r="5" stroke="#d4a853" strokeWidth="1.5" />
                    <path d="M4 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M22 12l2 2 4-4" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Expert Guidance',
                desc: '18+ years of experience — we help you choose the right product for your application.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className={styles.promiseCard}
              >
                <div className={styles.promiseIcon}>{value.icon}</div>
                <h3 className={styles.promiseTitle}>
                  {value.title}
                </h3>
                <p className={styles.promiseDesc}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Founder */}
      <section className={`section--dark ${styles.section}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.founderCard}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', opacity: 0.8 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--clr-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--clr-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Dilip Brahmankar
                </div>
                <div style={{ color: 'var(--clr-accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Founder & Proprietor</div>
              </div>
            </div>
            <div className={styles.founderInfo}>
              <div className="label" style={{ marginBottom: '1rem' }}>
                The Founder
              </div>
              <h2 className="ourstory__heading" style={{ fontSize: 'var(--fs-h2)', marginBottom: '1.5rem' }}>
                DILIP <span className="accent">BRAHMANKAR</span>
              </h2>
              <p style={{ color: 'var(--clr-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                With over 18 years in the industrial supply sector, Dilip built Yashada Enterprises
                on a foundation of genuine partnerships with customers and brands alike. His hands-on
                approach to quality and his understanding of panel-builders&apos; needs have made Yashada
                the go-to supplier in Nashik.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a
                  href="tel:8208997234"
                  className="btn btn--glass"
                >
                  +91 82089 97234
                </a>
                <a
                  href="https://wa.me/918208997234"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--gold"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section--dark ${styles.sectionCenter}`}>
        <div className="container">
          <h2 className="ourstory__heading" style={{ marginBottom: '1.5rem' }}>
            LET&apos;S <span className="accent">WORK TOGETHER</span>
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: 500, margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Whether you need a single roll of tape or a complete panel-building
            supply, we&apos;re here to help.
          </p>
          <Link href="/contact" className="btn btn--gold" style={{ display: 'inline-flex' }}>
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
