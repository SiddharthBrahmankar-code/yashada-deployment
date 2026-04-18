'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroExperience() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      /* Title words — dramatic cascade */
      tl.from(el.querySelectorAll('.hero__word'), {
        y: 120, rotateX: -45, opacity: 0,
        duration: 1, ease: 'power4.out', stagger: 0.1,
      }, '-=0.15');

      /* Subtitle & location */
      tl.from(el.querySelector('.hero__sub'), {
        y: 30, opacity: 0, duration: 0.6, ease: 'power2.out',
      }, '-=0.4');
      tl.from(el.querySelector('.hero__location'), {
        y: 20, opacity: 0, duration: 0.4, ease: 'power2.out',
      }, '-=0.3');

      /* Scroll cue */
      tl.from(el.querySelector('.hero__scroll'), {
        opacity: 0, y: 10, duration: 0.3,
      }, '-=0.1');

      /* ── PARALLAX ON SCROLL ── */
      gsap.to(el.querySelector('.hero__content'), {
        y: 80, opacity: 0,
        scrollTrigger: { trigger: el, start: '40% center', end: 'bottom top', scrub: 1 },
      });
      gsap.to(el.querySelector('.hero__bg-img'), {
        y: 50, scale: 1.08,
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero hero--centered" ref={heroRef}>
      {/* Background */}
      <div className="hero__bg">
        <Image
          className="hero__bg-img"
          src="/images/hero/hero-bg.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
        <div className="hero__bg-overlay hero__bg-overlay--center" />
        <div className="hero__bg-grid" />
      </div>

      <div className="hero__content hero__content--centered">
        <h1 className="hero__title hero__title--centered">
          <span className="hero__word-wrap">
            <span className="hero__word hero__word--accent">YASHADA</span>
          </span>
          <br />
          <span className="hero__word-wrap">
            <span className="hero__word">ENTERPRISES</span>
          </span>
        </h1>

        <p className="hero__sub hero__sub--centered">
          Converters &amp; Distributors of Electrical Insulation Materials,
          Adhesive Tapes &amp; Control Panel Accessories
        </p>

        <div className="hero__location">
          NASHIK, MAHARASHTRA — INDIA
        </div>
      </div>

      <div className="hero__scroll">
        <span>SCROLL</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--clr-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </section>
  );
}
