export const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  mr: () => import('./mr.json').then((module) => module.default),
  hi: () => import('./hi.json').then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
