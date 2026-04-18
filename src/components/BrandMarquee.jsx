'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import brandsData from '@/data/brands.json';

gsap.registerPlugin(ScrollTrigger);

export default function BrandMarquee() {
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
    <section className="brand-marquee section--dark" ref={sectionRef}>
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

      <div className="brand-marquee__fade" style={{ marginTop: '3rem' }}>
        <div className="brand-marquee__track">
          {duplicatedBrands.map((brand, i) => (
            <Link href="/brands" className="brand-marquee__card" key={`${brand.id}-${i}`}>
              <div className="brand-marquee__img-wrap">
                {brand.image ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={280}
                    height={160}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-dark-elevated)' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, color: 'rgba(255,255,255,0.05)' }}>
                      {brand.name.charAt(0)}
                    </div>
                  </div>
                )}
              </div>
              <div className="brand-marquee__info">
                <div className="brand-marquee__name">{brand.name}</div>
                <div className="brand-marquee__tagline">{brand.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
