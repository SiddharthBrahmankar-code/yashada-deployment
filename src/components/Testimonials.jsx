'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      'Yashada Enterprises has been our go-to supplier for cable ties and panel accessories. Their delivery is always on time and the product quality is consistent.',
    name: 'Rajesh Patil',
    role: 'Panel Builder, Nashik',
    initials: 'RP',
  },
  {
    quote:
      'We source all our insulation tapes from Yashada. Their Steelgrip and Abro range is genuine, and Dilip bhai always ensures we get the best rates in the market.',
    name: 'Suresh Kale',
    role: 'Electrical Contractor',
    initials: 'SK',
  },
  {
    quote:
      'Very professional operation. Whether we need 100 cable glands or 10,000 cable ties, they always have stock ready. The busbar supports are top quality.',
    name: 'Manoj Deshmukh',
    role: 'OEM Manufacturer',
    initials: 'MD',
  },
  {
    quote:
      'Been working with Yashada for over 5 years now. Their heat shrink sleeves from Woer are the best, and the pricing is unbeatable for wholesale orders.',
    name: 'Amit Sharma',
    role: 'Distributor, Pune',
    initials: 'AS',
  },
];

const clientTypes = [
  'Panel Builders',
  'OEM Manufacturers',
  'Electrical Contractors',
  'Government Projects',
  'Industrial Plants',
  'Solar Installers',
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });

      // Card stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials section--dark" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div className="label" style={{ marginBottom: '1rem' }}>
            What Our Clients Say
          </div>
          <h2 className="ourstory__heading">
            TRUSTED BY <span className="accent">INDUSTRY</span>
          </h2>
          <p
            className="text-muted"
            style={{ maxWidth: 520, margin: '1rem auto 0' }}
          >
            From panel builders to OEMs — here&apos;s what our partners say about
            working with Yashada Enterprises.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <p className="testimonial-card__quote">{t.quote}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client types strip */}
        <div className="client-logos">
          {clientTypes.map((type) => (
            <span key={type} className="client-logo">
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="section-divider" style={{ marginTop: 'var(--space-section)' }} />
    </section>
  );
}
