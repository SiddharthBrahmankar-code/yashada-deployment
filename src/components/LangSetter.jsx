'use client';

import { useEffect } from 'react';

export default function LangSetter({ lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
