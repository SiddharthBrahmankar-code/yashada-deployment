'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useTranslation } from '@/providers/I18nProvider';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, lang } = useTranslation();
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 250); // match mobileNavOut duration
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setMenuClosing(false);
  }, []);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerSolid : styles.headerTransparent}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Yashada<span> Enterprises</span>
        </Link>

        <nav className={styles.nav}>
          <Link href={`/${lang}/products`}>{t.nav?.products || 'Products'}</Link>
          <Link href={`/${lang}/brands`}>{t.nav?.brands || 'Brands'}</Link>
          <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer">{t.nav?.catalog || 'Catalog'}</a>
          <Link href={`/${lang}/about`}>{t.nav?.about || 'About'}</Link>
          <Link href={`/${lang}/contact`}>{t.nav?.contact || 'Contact'}</Link>
        </nav>

        <div className={styles.actions}>
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme} 
            aria-label="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <Link href={`/${lang}/contact`} className={styles.cta}>
            {t.cta?.inquiry || 'Send Inquiry'}
          </Link>

          <button
            className={styles.toggle}
            onClick={openMenu}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay — animated */}
      {menuOpen && (
        <div
          className={`${styles.mobileNav} ${menuClosing ? styles.mobileNavClosing : ''}`}
          onClick={closeMenu}
          data-lenis-prevent="true"
        >
          <nav className={styles.mobileNavInner} onClick={(e) => e.stopPropagation()} data-lenis-prevent="true">
            <button className={styles.mobileNavClose} onClick={closeMenu} aria-label="Close menu">✕</button>
            <Link href={`/${lang}/products`} onClick={closeMenu}>{t.nav?.products || 'Products'}</Link>
            <Link href={`/${lang}/brands`} onClick={closeMenu}>{t.nav?.brands || 'Brands'}</Link>
            <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{t.nav?.catalog || 'Catalog'}</a>
            <Link href={`/${lang}/about`} onClick={closeMenu}>{t.nav?.about || 'About'}</Link>
            <Link href={`/${lang}/contact`} onClick={closeMenu}>{t.nav?.contact || 'Contact'}</Link>
            <Link href={`/${lang}/contact`} className="btn btn--primary" onClick={closeMenu}>
              {t.cta?.inquiry || 'Send Inquiry'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
