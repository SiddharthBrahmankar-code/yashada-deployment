'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { usePostHog } from 'posthog-js/react';
import productsData from '@/data/products.json';
import { useInquiry } from '@/providers/InquiryProvider';
import { useTranslation } from '@/providers/I18nProvider';
import styles from './products.module.css';

/* ── Custom Dropdown Component ─────────────────────────── */
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        className={`${styles.dropdownTrigger} ${open ? styles.dropdownTriggerOpen : ''}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={styles.dropdownLabel}>{label}</span>
        <span className={styles.dropdownValue}>{selectedLabel}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.dropdownOption} ${value === opt.value ? styles.dropdownOptionActive : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              type="button"
            >
              {opt.label}
              {opt.count !== undefined && (
                <span className={styles.dropdownCount}>{opt.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Products Page ─────────────────────────────────────── */
export default function ProductsPage() {
  const { addItem, items } = useInquiry();
  const categories = productsData.categories;
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const posthog = usePostHog();
  const { t, lang } = useTranslation();

  // Telemetry: Debounced Search Capture
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        posthog?.capture('Product_Search_Query', {
          query: searchQuery.trim(),
          activeCategory,
          activeBrand,
        });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeCategory, activeBrand, posthog]);

  // Extract all unique brands from product specs
  const allBrands = [...new Set(
    categories.flatMap(cat =>
      cat.products
        .map(p => p.specs?.Brand)
        .filter(Boolean)
    )
  )].sort();

  // Category dropdown options
  const categoryOptions = [
    { value: 'all', label: 'All Categories', count: categories.reduce((a, c) => a + c.products.length, 0) },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
      count: cat.products.length,
    })),
  ];

  // Brand dropdown options
  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    ...allBrands.map((brand) => ({ value: brand, label: brand })),
  ];

  // Filter by category
  const categoryFiltered = activeCategory === 'all'
    ? categories
    : categories.filter((c) => c.id === activeCategory);

  // Filter by brand within categories
  const brandFiltered = activeBrand === 'all'
    ? categoryFiltered
    : categoryFiltered
        .map(cat => ({
          ...cat,
          products: cat.products.filter(p =>
            p.specs?.Brand && p.specs.Brand.toLowerCase().includes(activeBrand.toLowerCase())
          ),
        }))
        .filter(cat => cat.products.length > 0);

  // Filter by search query — fuzzy/semantic using Fuse.js
  const filteredCategories = (() => {
    if (!searchQuery.trim()) return brandFiltered;

    // Build flat index with category context
    const allProducts = brandFiltered.flatMap(cat =>
      cat.products.map(p => ({
        ...p,
        _categoryName: cat.name,
        _categoryId: cat.id,
        _brandName: p.specs?.Brand || '',
      }))
    );

    const fuse = new Fuse(allProducts, {
      keys: [
        { name: 'name', weight: 1.0 },
        { name: '_brandName', weight: 0.8 },
        { name: '_categoryName', weight: 0.6 },
        { name: 'description', weight: 0.5 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });

    const results = fuse.search(searchQuery);
    const matchedIds = new Set(results.map(r => r.item.id));

    return brandFiltered
      .map(cat => ({
        ...cat,
        products: cat.products.filter(p => matchedIds.has(p.id)),
      }))
      .filter(cat => cat.products.length > 0);
  })();

  const totalProducts = filteredCategories.reduce((a, c) => a + c.products.length, 0);

  return (
    <>
      {/* Hero */}
      <section
        className="section--dark"
        style={{
          paddingTop: 'calc(var(--header-height) + 4rem)',
          paddingBottom: 'var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>Our Products</div>
          <h1 className="ourstory__heading" style={{ marginBottom: '1rem' }}>
            INDUSTRIAL <span className="accent">TAPES</span> &<br />
            ELECTRICAL <span className="accent">COMPONENTS</span>
          </h1>
          <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '1.125rem', color: 'var(--clr-text-muted)' }}>
            From precision-converted adhesive tapes to complete panel-building
            solutions — explore our full product range.
          </p>
        </div>
      </section>

      {/* ── Sleek Filter Bar ── */}
      <section className="section--dark" style={{ paddingTop: '0', paddingBottom: '0' }}>
        <div className="container">
          <div className={styles.filterBar}>
            {/* Search */}
            <div className={styles.search}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Dropdowns */}
            <div className={styles.dropdowns}>
              <FilterDropdown
                label="Category"
                value={activeCategory}
                options={categoryOptions}
                onChange={(v) => { setActiveCategory(v); setActiveBrand('all'); }}
              />
              <FilterDropdown
                label="Brand"
                value={activeBrand}
                options={brandOptions}
                onChange={setActiveBrand}
              />
            </div>

            {/* Result Count + Reset */}
            <div className={styles.meta}>
              <span className={styles.count}>
                {totalProducts} product{totalProducts !== 1 ? 's' : ''}
              </span>
              {(activeCategory !== 'all' || activeBrand !== 'all' || searchQuery) && (
                <button
                  className={styles.reset}
                  onClick={() => { setActiveCategory('all'); setActiveBrand('all'); setSearchQuery(''); }}
                  type="button"
                >
                  ✕ Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filtered Categories */}
      {filteredCategories.length === 0 ? (
        <section className="section--dark" style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
          <div className="container">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your filters or search query.
            </p>
            <button
              className="btn btn--glass"
              onClick={() => { setActiveCategory('all'); setActiveBrand('all'); setSearchQuery(''); }}
              type="button"
            >
              Clear all filters
            </button>
          </div>
        </section>
      ) : (
        filteredCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="section--dark"
            style={{ padding: 'var(--space-xl) 0' }}
          >
            <div className="container">
              {/* Category Header with image */}
              <div className={styles.categoryHeaderGrid} style={{ marginBottom: '2rem' }}>
                <div>
                  <div className="label" style={{ marginBottom: '0.75rem' }}>
                    {category.brand || 'Yashada Enterprises'}
                  </div>
                  <h2
                    className="ourstory__heading"
                    style={{ fontSize: 'var(--fs-h2)', marginBottom: '0.75rem' }}
                  >
                    {category.name.toUpperCase()}
                  </h2>
                  <p style={{
                    color: 'var(--clr-text-muted)',
                    maxWidth: 480,
                    fontSize: '1.0625rem',
                    lineHeight: 1.7,
                  }}>
                    {category.description}
                  </p>
                </div>
                {category.image && (
                  <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Image
                      src={category.image}
                      alt={`${category.name} - High-quality industrial manufacturing`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {category.products.map((product) => (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <Link href={`/${lang}/products/${product.id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} aria-label={`View ${product.name}`} />
                    <div className={styles.productImage} style={{ position: 'relative' }}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={`${product.name} - Yashada Enterprises premium industrial grade product`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
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
                            color: 'var(--clr-accent)',
                          }}
                        >
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09c-.658.003-1.25.396-1.51 1z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.productContent}>
                      <div className={styles.productCategory}>
                        {product.specs?.Brand || category.name}
                      </div>
                      <h3
                        className={styles.productName}
                        style={{ color: 'var(--clr-text-light)' }}
                      >
                        {product.name}
                      </h3>
                      <p className={styles.productCount} style={{ color: 'var(--clr-text-muted)' }}>
                        {product.description.substring(0, 80)}...
                      </p>
                    </div>
                    {/* WhatsApp Quick Enquiry */}
                    <a
                      href={`https://wa.me/918208997234?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} from your ${category.name} range. Please share details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsapp}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Enquire about ${product.name} on WhatsApp`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                    
                    {/* Add to Inquiry */}
                    <button
                      className={styles.inquiryBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(product);
                      }}
                      aria-label={`Add ${product.name} to Inquiry`}
                    >
                      {items.some(i => i.id === product.id) ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ADDED
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="14" y1="9" x2="14" y2="13"/></svg>
                          ADD TO LIST
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-divider" style={{ marginTop: 'var(--space-xl)' }} />
          </section>
        ))
      )}

      {/* Bottom CTA */}
      <section className="section--dark" style={{ padding: 'var(--space-section) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="ourstory__heading" style={{ marginBottom: '1.5rem' }}>
            CAN&apos;T FIND WHAT <span className="accent">YOU NEED</span>?
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: 500, margin: '0 auto 2rem' }}>
            Contact us directly — we source and supply a wide range of
            industrial components beyond what&apos;s listed here.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${lang}/contact`} className="btn btn--gold">
              {t.cta?.inquiry || 'Send Inquiry'}
            </Link>
            <a
              href="https://wa.me/918208997234?text=Hello%2C%20I%20need%20a%20product%20not%20listed%20on%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--glass"
            >
              {t.cta?.whatsapp || 'WhatsApp Us'}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
