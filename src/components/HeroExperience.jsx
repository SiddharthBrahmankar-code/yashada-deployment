'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/providers/I18nProvider';
import styles from './HeroExperience.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroExperience() {
  const heroRef = useRef(null);
  const { lang } = useTranslation();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      /* Badge — fade in first */
      tl.from(el.querySelector(`.${styles.badge}`), {
        y: 20, opacity: 0, scale: 0.9,
        duration: 0.6, ease: 'power3.out',
      });

      /* Title words — dramatic cascade */
      tl.from(el.querySelectorAll(`.${styles.word}`), {
        y: 140, rotateX: -60, opacity: 0,
        duration: 1.2, ease: 'power4.out', stagger: 0.12,
      }, '-=0.3');

      /* Subtitle */
      tl.from(el.querySelector(`.${styles.sub}`), {
        y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
      }, '-=0.5');

      /* CTA buttons */
      tl.from(el.querySelectorAll(`.${styles.ctas} > *`), {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
      }, '-=0.3');

      /* Scroll cue */
      tl.from(el.querySelector(`.${styles.scroll}`), {
        opacity: 0, y: 10, duration: 0.4,
      }, '-=0.1');

      /* Orbs — gentle entrance */
      tl.from(el.querySelectorAll(`.${styles.orb}`), {
        scale: 0, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out',
      }, '-=1.5');

      /* ── PARALLAX ON SCROLL ── */
      gsap.to(el.querySelector(`.${styles.contentCentered}`), {
        y: 100, opacity: 0,
        scrollTrigger: { trigger: el, start: '30% center', end: 'bottom top', scrub: 1 },
      });
      gsap.to(el.querySelector(`.${styles.bgImg}`), {
        y: 80, scale: 1.12,
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to(el.querySelectorAll(`.${styles.orb}`), {
        y: -60,
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      /* ── MOUSE PARALLAX (Antigravity) ── */
      const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        gsap.to(el.querySelector(`.${styles.contentCentered}`), {
          rotateY: x,
          rotateX: -y,
          transformPerspective: 1200,
          duration: 1,
          ease: 'power2.out'
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgOverlayCenter} />
        <div className={styles.bgGrid} />
        <div className={styles.bgVignette} />
      </div>

      {/* Floating Orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      <div className={styles.contentCentered}>
        {/* Glass Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Since 2005 • Nashik, India
        </div>

        <h1 className={`${styles.title} ${styles.titleCentered}`}>
          <span className={styles.wordWrap}>
            <span className={`${styles.word} ${styles.wordAccent}`}>YASHADA</span>
          </span>
          <br />
          <span className={styles.wordWrap}>
            <span className={styles.word}>ENTERPRISES</span>
          </span>
        </h1>

        <p className={`${styles.sub} ${styles.subCentered}`}>
          Converters &amp; Distributors of Electrical Insulation Materials,
          Adhesive Tapes &amp; Control Panel Accessories
        </p>

        <div className={styles.ctas}>
          <Link href={`/${lang}/products`} className={`btn btn--gold btn--lg ${styles.ctaBtn}`}>
            Explore Products
          </Link>
          <Link href={`/${lang}/contact`} className={`btn btn--glass btn--lg ${styles.ctaBtn}`}>
            Get a Quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      <div className={styles.scroll}>
        <span>SCROLL</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </section>
  );
}
