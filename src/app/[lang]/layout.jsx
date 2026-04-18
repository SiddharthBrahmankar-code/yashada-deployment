import LangSetter from '@/components/LangSetter';
import { getDictionary } from '@/i18n/dictionaries';
import { I18nProvider } from '@/providers/I18nProvider';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'mr' }, { lang: 'hi' }];
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <I18nProvider dictionary={dictionary} lang={lang}>
      <LangSetter lang={lang} />
      {children}
    </I18nProvider>
  );
}
