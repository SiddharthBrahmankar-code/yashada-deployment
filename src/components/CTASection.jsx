'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CTASection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = sectionRef.current;

      /* Label + heading reveal */
      gsap.from(el.querySelector('.label'), {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        y: 20, opacity: 0, duration: 0.4, ease: 'power3.out',
      });
      gsap.from(el.querySelector(`.${styles.heading}`), {
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.6, ease: 'power3.out',
      });

      /* Cards stagger — from the bottom */
      el.querySelectorAll(`.${styles.card}`).forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none none' },
          y: 60, opacity: 0, scale: 0.94,
          duration: 0.7, delay: i * 0.12, ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`${styles.section} section--dark`} ref={sectionRef}>
      {/* Mesh gradient background */}
      <div className={styles.meshBg} />
      <div className={styles.meshOrb1} />
      <div className={styles.meshOrb2} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="label" style={{ marginBottom: '1rem' }}>Get In Touch</div>
        <h2 className={styles.heading}>
          LET&apos;S <span className="accent">CONNECT</span>
        </h2>

        <div className={styles.cards}>
          {/* Visit Us */}
          <a href="https://maps.google.com/?q=Yashada+Enterprises+Nashik" target="_blank" rel="noopener noreferrer" className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className={styles.title}>Visit Us</div>
            <div className={styles.detail}>
              Shop No 11 and 12, Sai Industrial Estate<br />
              Behind Ambad Substation, Near Patil Transport<br />
              Ambad Gaon, Nashik — 422010
            </div>
            <div className={styles.cardArrow}>→</div>
          </a>

          {/* Call Us */}
          <a href="tel:+918208997234" className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className={styles.title}>Call Us</div>
            <div className={styles.detail}>
              +91 82089 97234
            </div>
            <div className={styles.cardArrow}>→</div>
          </a>

          {/* Email Us */}
          <a href="mailto:dilip.brahmankar@yahoo.com" className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className={styles.title}>Email Us</div>
            <div className={styles.detail}>
              dilip.brahmankar@yahoo.com
            </div>
            <div className={styles.cardArrow}>→</div>
          </a>
        </div>
      </div>
    </section>
  );
}
