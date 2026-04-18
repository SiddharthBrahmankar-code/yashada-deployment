'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const wrapperRef = useRef(null);
  const lenisRef = useRef(null);
  const pathname = usePathname();

  // Handle route transitions gracefully
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Respect prefers-reduced-motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPref = (e) => {
      if (e.matches) {
        lenis.destroy();
      }
    };
    if (mql.matches) {
      lenis.destroy();
    }
    mql.addEventListener('change', handleMotionPref);

    return () => {
      mql.removeEventListener('change', handleMotionPref);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
