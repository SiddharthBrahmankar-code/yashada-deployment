'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

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
    <header className={`header ${scrolled ? 'header--solid' : 'header--transparent'}`}>
      <div className="header__inner">
        <Link href="/" className="header__logo">
          Yashada<span> Enterprises</span>
        </Link>

        <nav className="header__nav">
          <Link href="/products">Products</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <Link href="/contact" className="header__cta">
          Send Inquiry
        </Link>

        <button
          className="header__toggle"
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
          className={`mobile-nav ${menuClosing ? 'mobile-nav--closing' : ''}`}
          onClick={closeMenu}
        >
          <nav className="mobile-nav__inner" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-nav__close" onClick={closeMenu} aria-label="Close menu">✕</button>
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
