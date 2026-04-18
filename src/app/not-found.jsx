import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      className="section--dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'var(--header-height)',
      }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        {/* 404 Number */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(6rem, 15vw, 12rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #f0d060, var(--clr-accent), #c49230)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(212,168,83,0.2))',
            marginBottom: '1rem',
          }}
        >
          404
        </div>

        {/* Heading */}
        <h1
          className="ourstory__heading"
          style={{ fontSize: 'var(--fs-h2)', marginBottom: '1.5rem' }}
        >
          PAGE <span className="accent">NOT FOUND</span>
        </h1>

        {/* Description */}
        <p
          style={{
            color: 'var(--clr-text-muted)',
            fontSize: '1.125rem',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: 440,
            margin: '0 auto 2.5rem',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn--gold">
            Go Home
          </Link>
          <Link href="/products" className="btn btn--glass">
            Browse Products
          </Link>
          <Link href="/contact" className="btn btn--outline">
            Contact Us
          </Link>
        </div>

        {/* Decorative divider */}
        <div
          style={{
            marginTop: '4rem',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)',
          }}
        />
        <p
          style={{
            marginTop: '1.5rem',
            color: 'var(--clr-text-muted)',
            fontSize: 'var(--fs-small)',
          }}
        >
          Yashada Enterprises — Industrial Tapes & Electrical Components, Nashik
        </p>
      </div>
    </section>
  );
}
