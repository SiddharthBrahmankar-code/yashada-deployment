'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
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

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerSolid : styles.headerTransparent}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Yashada<span> Enterprises</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/products">Products</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link href="/contact" className={styles.cta}>
          Send Inquiry
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

      {/* Mobile Nav Overlay — animated */}
      {menuOpen && (
        <div
          className={`${styles.mobileNav} ${menuClosing ? styles.mobileNavClosing : ''}`}
          onClick={closeMenu}
        >
          <nav className={styles.mobileNavInner} onClick={(e) => e.stopPropagation()}>
            <button className={styles.mobileNavClose} onClick={closeMenu} aria-label="Close menu">✕</button>
            <Link href="/products" onClick={closeMenu}>Products</Link>
            <Link href="/brands" onClick={closeMenu}>Brands</Link>
            <Link href="/about" onClick={closeMenu}>About</Link>
            <Link href="/contact" onClick={closeMenu}>Contact</Link>
            <Link href="/contact" className="btn btn--primary" onClick={closeMenu}>
              Send Inquiry
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
