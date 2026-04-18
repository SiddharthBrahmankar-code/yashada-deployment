'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service or browser console
    console.error('Yashada App Global Error:', error);
  }, [error]);

  return (
    <section 
      className="section--dark" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'var(--header-height)'
      }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        {/* Error Graphic/Text */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ff7a7a, #e63946, #b00020)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 40px rgba(230,57,70,0.2))',
          marginBottom: '1rem',
        }}>
          ERROR
        </div>

        {/* Heading */}
        <h1 className="ourstory__heading" style={{ fontSize: 'var(--fs-h2)', marginBottom: '1.5rem' }}>
          SOMETHING WENT <span className="accent">WRONG</span>
        </h1>

        {/* Description */}
        <p style={{
          color: 'var(--clr-text-muted)',
          fontSize: '1.125rem',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: 440,
          margin: '0 auto 2.5rem'
        }}>
          We apologize for the inconvenience. An unexpected technical error has occurred in the browser. 
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => reset()} 
            className="btn btn--gold"
          >
            Try Again
          </button>
          <Link href="/" className="btn btn--glass">
            Go Home
          </Link>
        </div>

        {/* Decorative divider */}
        <div style={{
          marginTop: '4rem',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.2), transparent)'
        }} />
        <p style={{
          marginTop: '1.5rem',
          color: 'var(--clr-text-muted)',
          fontSize: 'var(--fs-small)'
        }}>
          Yashada Enterprises — System Failure Recovery
        </p>
      </div>
    </section>
  );
}
