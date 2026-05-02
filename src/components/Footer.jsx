'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/providers/I18nProvider';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useTranslation();
  
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={`${styles.footer} section--dark`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.brandName}>
              Yashada<span> Enterprises</span>
            </div>
            <p>
              Converters of self-adhesive tapes and distributors of industrial
              electrical components. Serving the industry from Nashik since 2005.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Shop No 11 and 12, Sai Industrial Estate<br />
              Behind Ambad Substation, Near Patil Transport<br />
              Ambad Gaon, Nashik - 422010
            </p>
          </div>

          <div>
            <h4 className={styles.colTitle}>Products</h4>
            <div className={styles.links}>
              <Link href={`/${lang}/products#self-adhesive-tapes`}>Adhesive Tapes</Link>
              <Link href={`/${lang}/products#electrical-insulation-tapes`}>Insulation Tapes</Link>
              <Link href={`/${lang}/products#nylon-cable-ties`}>Cable Ties</Link>
              <Link href={`/${lang}/products#brass-cable-glands`}>Cable Glands</Link>
              <Link href={`/${lang}/products#busbar-support`}>Busbar Systems</Link>
              <Link href={`/${lang}/products#cable-tray`}>Channels & Hardware</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Brands</h4>
            <div className={styles.links}>
              <Link href={`/${lang}/brands`}>Surelock</Link>
              <Link href={`/${lang}/brands`}>Woer</Link>
              <Link href={`/${lang}/brands`}>Premium</Link>
              <Link href={`/${lang}/brands`}>Steelgrip</Link>
              <Link href={`/${lang}/brands`}>Haria</Link>
              <Link href={`/${lang}/brands`}>Jainson</Link>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <div className={styles.links}>
              <a href="tel:8208997234">+91 82089 97234</a>
              <a href="mailto:dilip.brahmankar@yahoo.com">dilip.brahmankar@yahoo.com</a>
            </div>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--clr-text-muted)', transition: 'color 0.3s' }} onMouseOver={e=>e.currentTarget.style.color='var(--clr-accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--clr-text-muted)'}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--clr-text-muted)', transition: 'color 0.3s' }} onMouseOver={e=>e.currentTarget.style.color='var(--clr-accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--clr-text-muted)'}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://wa.me/918208997234" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ color: 'var(--clr-text-muted)', transition: 'color 0.3s' }} onMouseOver={e=>e.currentTarget.style.color='var(--clr-accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--clr-text-muted)'}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Yashada Enterprises. All rights reserved.</span>
          <span>Nashik, Maharashtra, India</span>
        </div>
      </div>
    </footer>
  );
}
