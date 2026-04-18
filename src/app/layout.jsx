import './globals.css';
import Script from 'next/script';
import { Outfit, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import NetlifyInit from '@/components/NetlifyInit';
import ThemeProvider from '@/providers/ThemeProvider';
import InquiryProvider from '@/providers/InquiryProvider';
import InquirySidebar from '@/components/InquirySidebar';
import { PostHogProvider } from '@/providers/PostHogProvider';

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {}
  })();
`;

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-outfit', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://yashada.netlify.app'),
  title: { default: 'Yashada Enterprises | Industrial Tapes & Electrical Components — Nashik', template: '%s | Yashada Enterprises' },
  description: 'Yashada Enterprises — Nashik-based converters of self-adhesive tapes and authorized distributors of industrial electrical components. Cable ties, heat shrink sleeves, cable glands, panel accessories, busbar systems, DIN rail channels.',
  keywords: ['Yashada Enterprises', 'Yashada Enterprises Nashik', 'self adhesive tape Nashik', 'PVC insulation tape', 'industrial tapes', 'cable ties', 'cable glands', 'panel accessories', 'busbar systems', 'heat shrink sleeves', 'DIN rail channels', 'electrical components Nashik', 'Surelock cable ties', 'Woer heat shrink', 'Steelgrip tape', 'Haria cable glands', 'BOPP tape', 'panel building materials'],
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: { title: 'Yashada Enterprises | Industrial Tapes & Electrical Components', description: 'Precision-converted self-adhesive tapes and premium industrial electrical components from Nashik, Maharashtra.', url: 'https://yashada.netlify.app', siteName: 'Yashada Enterprises', locale: 'en_IN', type: 'website', images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Yashada Enterprises — Industrial Tapes & Electrical Components, Nashik' }] },
  twitter: { card: 'summary_large_image', title: 'Yashada Enterprises | Industrial Tapes & Electrical Components', description: 'Self-adhesive tapes & electrical panel components — Nashik, Maharashtra.' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  other: { 'llms-txt': 'https://yashada.netlify.app/llms.txt', 'llms-full-txt': 'https://yashada.netlify.app/llms-full.txt' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Yashada Enterprises',
  description: 'Converters of self-adhesive tapes and authorized distributors of industrial electrical components including cable ties, cable glands, panel accessories, and busbar systems.',
  url: 'https://yashada.netlify.app',
  telephone: '+918208997234',
  email: 'yashadaenterprises@gmail.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Shop No 11 and 12, Sai Industrial Estate, Behind Ambad Substation, Near Patil Transport, Ambad Gaon', addressLocality: 'Nashik', addressRegion: 'Maharashtra', postalCode: '422010', addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: 20.0063, longitude: 73.7903 },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' }],
  founder: { '@type': 'Person', name: 'Dilip Brahmankar' },
  foundingDate: '2005',
  sameAs: ['https://www.google.com/maps/place/Yashada+Enterprises'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PostHogProvider>
          <ThemeProvider>
            <InquiryProvider>
              <SmoothScroll>
                <Header />
                <main>{children}</main>
                <Footer />
                <WhatsAppButton />
                <InquirySidebar />
              </SmoothScroll>
            </InquiryProvider>
          </ThemeProvider>
        </PostHogProvider>
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="lazyOnload" />
        <NetlifyInit />
      </body>
    </html>
  );
}
