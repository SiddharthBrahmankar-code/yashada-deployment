'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PinnedProducts.module.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    heading: 'Adhesive & Sealing Tapes',
    badge: 'Manufacturer',
    desc: 'We manufacture and supply a comprehensive range of industrial adhesive and sealing tapes for electrical, packaging, and surface protection applications.',
    image: '/images/products/adhesive_tapes.png',
    items: ['Surface Protection Tape', 'D Shape PU Foam Gasket', 'Anti Skid Tapes', 'Security Void Tape', 'Double Sided Tape', 'PVC Insulation Tape', 'Masking Tape (Abro)', 'Cross Filament Tape', 'HDPE Tarpaulin Tape', 'Aluminium Foil Tape', 'Polyester Tapes'],
  },
  {
    heading: 'Cable Management',
    badge: 'Distributor',
    desc: 'Complete cable management solutions — ties, glands, lugs, sleeves, and accessories for professional electrical installations.',
    image: '/images/products/nylon_cable_ties.png',
    items: ['Nylon Cable Ties', 'Cable Wire Zip Ties', 'Aluminium & Copper Lugs', 'Copper Insulated Lugs', 'Brass Cable Glands (D.C. & S.C.)', 'PVC Cable Glands', 'End Sealing Lugs (Bootlace)', 'Solar MC4 Connector'],
  },
  {
    heading: 'Panel Building Components',
    badge: 'Panel Hardware',
    desc: 'Complete range of electrical panel building components — supports, channels, sleeves, locks, hinges, and insulation materials.',
    image: '/images/products/busbar_support.png',
    items: ['Finger Type Busbar Support', 'Busbar Insulators', 'MCB Din Rail Channel', 'PVC Channels (Cable Duct)', 'DC Panel Locks & Keys', 'Spring Panel Hinges', 'Heat Shrinkable Sleeve (Woer)', 'Spiral Sleeve'],
  },
];

/* SVG icons to replace inconsistent emojis */
const DealIcon = ({ type }) => {
  const icons = {
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    target: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    pin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    printer: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
      </svg>
    ),
    wrench: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    circle: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    box: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    lock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    grid: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    zap: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    link: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    thermometer: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
      </svg>
    ),
  };
  return icons[type] || icons.circle;
};

const alsoDeals = [
  { name: 'PVC Sleeves', icon: 'shield', desc: 'Wire identification', slug: 'pvc-sleeves-product' },
  { name: 'White Ferruling Tube', icon: 'target', desc: 'Wire marking', slug: 'white-ferruling-tube' },
  { name: 'Tie Mount', icon: 'pin', desc: 'Cable routing bases', slug: 'tie-mount-sticking-saddle' },
  { name: 'Ferruling Ribbon', icon: 'printer', desc: 'Machine ribbon', slug: 'ribbon-ferruling-machine' },
  { name: 'Crimping Tools', icon: 'wrench', desc: 'Lug termination', slug: 'lugs-crimping-tools' },
  { name: 'U Shape Rubber Gasket', icon: 'circle', desc: 'Edge protection', slug: 'u-shape-rubber-gasket' },
  { name: 'Tissue Tape', icon: 'box', desc: 'Bonding tape', slug: 'tissue-tape' },
  { name: 'Security Tape', icon: 'lock', desc: 'Tamper evident', slug: 'security-void-tape' },
  { name: 'Adhesive Foam Gasket', icon: 'grid', desc: 'Sealing & cushioning', slug: 'adhesive-foam-gasket' },
  { name: 'Electrical Insulation Tape', icon: 'zap', desc: 'Multi-colour tapes', slug: 'electrical-insulation-tapes' },
  { name: 'Double Sided Tissue Tape', icon: 'link', desc: 'Lightweight bonding', slug: 'double-sided-tissue-tapes' },
  { name: 'Busbar Sleeve', icon: 'thermometer', desc: 'Heat shrink insulation', slug: 'busbar-sleeve-heat-shrink' },
];

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label reveal */
      gsap.from(sectionRef.current.querySelector('.product-showcase > .container > .label'), {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.5, ease: 'power3.out',
      });
      gsap.from(sectionRef.current.querySelector('.product-showcase > .container > .product-showcase__section-heading'), {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.6, ease: 'power3.out',
      });

      /* Each product item — stagger entrance */
      itemsRef.current.forEach((item) => {
        if (!item) return;
        const media = item.querySelector(`.${styles.media}`);
        const info = item.querySelector(`.${styles.info}`);

        gsap.from(media, {
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          x: -60, opacity: 0, duration: 0.8, ease: 'power3.out',
        });
        gsap.from(info, {
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          x: 60, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <section className={`${styles.productShowcase} section--dark`}>
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>What We Offer</div>
          <h2 className={styles.sectionHeading}>
            OUR <span className="accent">PRODUCT</span> RANGE
          </h2>

          {products.map((prod, i) => (
            <div
              className={styles.item}
              key={prod.heading}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <div className={styles.media}>
                <Image
                  src={prod.image}
                  alt={prod.heading}
                  width={640}
                  height={480}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <span className={styles.badge}>{prod.badge}</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.heading}>{prod.heading}</h3>
                <p className={styles.desc}>{prod.desc}</p>
                <ul className="amber-list">
                  {prod.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider" style={{ marginTop: 'var(--space-section)' }} />
      </section>

      {/* We Also Deal In */}
      <section className={`${styles.alsoDeal} section--dark`}>
        <div className="container">
          <div className="label" style={{ marginBottom: '1rem' }}>And More</div>
          <h2 className={styles.alsoDealHeading}>
            WE ALSO <span className="accent">DEAL IN</span>
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', maxWidth: '600px', marginBottom: 'var(--space-lg)', lineHeight: 1.7 }}>
            Beyond our core product lines, we supply a wide range of electrical and industrial components to meet every project need.
          </p>
          <div className={styles.alsoDealGrid}>
            {alsoDeals.map((item) => (
              <Link href={`/products/${item.slug}`} className={styles.alsoDealCard} key={item.name}>
                <span className={styles.alsoDealIcon}>
                  <DealIcon type={item.icon} />
                </span>
                <div>
                  <div className={styles.alsoDealName}>{item.name}</div>
                  <div className={styles.alsoDealDesc}>{item.desc}</div>
                </div>
                <span className={styles.alsoDealArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-divider" style={{ marginTop: 'var(--space-section)' }} />
      </section>
    </div>
  );
}
