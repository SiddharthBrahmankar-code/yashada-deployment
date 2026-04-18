'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhatWeDo.module.css';

gsap.registerPlugin(ScrollTrigger);

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

      /* Columns stagger */
      gsap.from(section.querySelectorAll(`.${styles.columns} p`), {
        scrollTrigger: { trigger: section.querySelector(`.${styles.columns}`), start: 'top 85%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      });

      /* Stats container */
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

        {/* Stats row (moved from hero for cleaner layout) */}
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
