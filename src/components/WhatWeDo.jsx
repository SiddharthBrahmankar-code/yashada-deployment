'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhatWeDo.module.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Manufacturing Hub',
    desc: 'In-house tape conversion facility producing precision self-adhesive tapes for electrical, packaging, and industrial applications.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'Distribution Network',
    desc: 'Authorized distributors for 8+ leading brands — ensuring genuine products and the best wholesale rates across Maharashtra.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: 'Technical Expertise',
    desc: '18+ years of hands-on experience — we help panel builders and contractors choose the exact right product for every application.',
  },
];

export default function OurStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      /* Label + heading reveal */
      gsap.from(section.querySelector('.label'), {
        scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.5, ease: 'power3.out',
      });
      gsap.from(section.querySelector(`.${styles.heading}`), {
        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none none' },
        y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      });

      /* Story columns */
      gsap.from(section.querySelectorAll(`.${styles.columns} p`), {
        scrollTrigger: { trigger: section.querySelector(`.${styles.columns}`), start: 'top 85%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      });

      /* Feature cards — staggered entrance */
      section.querySelectorAll(`.${styles.featureCard}`).forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          y: 60, opacity: 0, scale: 0.95,
          duration: 0.7, delay: i * 0.12, ease: 'power3.out',
        });
      });

      /* Stats — counter reveal */
      const statsBox = section.querySelector(`.${styles.stats}`);
      if (statsBox) {
        gsap.from(statsBox, {
          scrollTrigger: { trigger: statsBox, start: 'top 90%', toggleActions: 'play none none none' },
          y: 40, opacity: 0, scale: 0.98, duration: 0.7, ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`${styles.ourstory} section--dark`} ref={sectionRef}>
      <div className="container">
        <div className="label" style={{ marginBottom: '1rem' }}>Our Story</div>

        <div className={styles.header}>
          <h2 className={styles.heading}>
            BUILT ON <span className="accent">QUALITY</span>,<br />
            DRIVEN BY <span className="accent">TRUST</span>
          </h2>
        </div>

        <div className={styles.columns}>
          <p>
            Incorporated in the year 2005, Yashada Enterprises has successfully 
            carved a reliable niche by manufacturing and trading a supreme quality 
            range of Adhesive Tape, Foil Tape, Cable Lugs, Cable Glands, Sleeves, 
            and Panel Building Accessories.
          </p>
          <p>
            Based in Nashik, Maharashtra — we partner with brands like Steelgrip, 
            Abro, and Woer to supply everything from cable ties and heat shrink 
            sleeves to busbar supports and panel hardware — ensuring quality that 
            powers India&apos;s electrical infrastructure.
          </p>
        </div>

        {/* Bento Feature Cards */}
        <div className={styles.bentoGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <div className={styles.featureGlow} />
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className={styles.stats}>
          {[
            ['40+', 'Products'],
            ['500+', 'Clients'],
            ['3', 'Brand Partners'],
            ['2005', 'Established'],
          ].map(([num, label]) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider" style={{ marginTop: 'var(--space-section)' }} />
    </section>
  );
}
