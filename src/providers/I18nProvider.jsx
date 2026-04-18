'use client';

import { createContext, useContext } from 'react';

const I18nContext = createContext({ t: {}, lang: 'en' });

export function I18nProvider({ dictionary, lang, children }) {
  return (
    <I18nContext.Provider value={{ t: dictionary, lang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
