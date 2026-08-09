'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StatsCounter.module.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: 40, suffix: '+', label: 'Products' },
  { number: 3, suffix: '', label: 'Brand Partners' },
  { number: 18, suffix: '+', label: 'Years Experience' },
  { number: 500, suffix: '+', label: 'Clients Served' },
];

export default function StatsCounter() {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade in
      gsap.from(sectionRef.current.querySelector('.label'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
      });

      // Counter animations
      countersRef.current.forEach((counter, i) => {
        const target = stats[i].number;

        gsap.from(counter, {
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 30,
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          delay: i * 0.1,
          onStart: () => {
            gsap.to(
              { val: 0 },
              {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function () {
                  const numSpan = counter.querySelector('span'); // First span is the value
                  if (numSpan) {
                    numSpan.textContent = Math.round(this.targets()[0].val);
                  }
                },
              }
            );
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`${styles.stats} section--dark`} ref={sectionRef}>
      {/* Decorative orbital rings */}
      <div className={styles.orbitalContainer}>
        <div className={styles.orbital1} />
        <div className={styles.orbital2} />
        <div className={styles.dotGrid} />
      </div>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
          <div className="label" style={{ marginBottom: '1rem' }}>
            Trusted Across India
          </div>
          <h2 className="ourstory__heading">
            NUMBERS THAT <span className="accent">SPEAK</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, i) => (
            <div
              className={styles.item}
              key={stat.label}
              ref={(el) => (countersRef.current[i] = el)}
            >
              <div className={styles.numberGlow} />
              <div className={styles.number}>
                <span>0</span>
                <span>{stat.suffix}</span>
              </div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
