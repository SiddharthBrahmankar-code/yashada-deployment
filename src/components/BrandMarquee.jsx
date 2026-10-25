'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import brandsData from '@/data/brands.json';
import { useTranslation } from '@/providers/I18nProvider';
import styles from './BrandMarquee.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrandMarquee() {
  const { lang } = useTranslation();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const brands = brandsData.brands;
  // Duplicate 4x for a smoother, less repetitive marquee loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className={`${styles.brandMarquee} section--dark`} ref={sectionRef}>
      <div className="container" ref={headerRef}>
        <div className="label" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Authorized Distributor
        </div>
        <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Brands We Trust
        </h2>
        <p
          className="text-muted"
          style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}
        >
          Partnering with India&apos;s leading manufacturers to bring you the best.
        </p>
      </div>

      <div className={styles.fade} style={{ marginTop: '3rem' }}>
        <div className={styles.track}>
          {duplicatedBrands.map((brand, i) => (
            <Link href={`/${lang}/brands`} className={styles.card} key={`${brand.id}-${i}`}>
              <div className={styles.imgWrap}>
                {brand.logo || brand.image ? (
                  <Image
                    src={brand.logo || brand.image}
                    alt={`${brand.name} logo`}
                    width={220}
                    height={100}
                    style={{ objectFit: 'contain', maxHeight: '85px', maxWidth: '85%', width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--clr-accent)' }}>
                      {brand.name}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{brand.name}</div>
                <div className={styles.tagline}>{brand.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
