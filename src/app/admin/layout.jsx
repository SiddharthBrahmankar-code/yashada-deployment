'use client';

import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  useEffect(() => {
    // Hide the main site header, footer, scroll-to-top, and whatsapp button on admin pages
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const whatsapp = document.querySelector('.whatsapp-float, .whatsapp-btn');
    const scrollTop = document.querySelector('.scroll-to-top');

    const elements = [header, footer, whatsapp, scrollTop].filter(Boolean);
    elements.forEach(el => el.style.display = 'none');

    return () => {
      elements.forEach(el => el.style.display = '');
    };
  }, []);

  return <>{children}</>;
}
