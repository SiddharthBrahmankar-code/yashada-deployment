import './globals.css';
import Script from 'next/script';
import { Outfit, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SmoothScroll from '@/components/SmoothScroll';
import NetlifyInit from '@/components/NetlifyInit';
import ScrollToTop from '@/components/ScrollToTop';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://yashada.netlify.app'),
  title: {
    default: 'Yashada Enterprises | Industrial Tapes & Electrical Components — Nashik',
    template: '%s | Yashada Enterprises',
  },
  description:
    'Yashada Enterprises — Nashik-based converters of self-adhesive tapes and authorized distributors of industrial electrical components. Cable ties, heat shrink sleeves, cable glands, panel accessories, busbar systems, DIN rail channels.',
  keywords: [
    'Yashada Enterprises',
    'Yashada Enterprises Nashik',
    'self adhesive tape Nashik',
    'PVC insulation tape',
    'industrial tapes',
    'cable ties',
    'cable glands',
    'panel accessories',
    'busbar systems',
    'heat shrink sleeves',
    'DIN rail channels',
    'electrical components Nashik',
    'Surelock cable ties',
    'Woer heat shrink',
    'Steelgrip tape',
    'Haria cable glands',
    'BOPP tape',
    'panel building materials',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Yashada Enterprises | Industrial Tapes & Electrical Components',
    description:
      'Precision-converted self-adhesive tapes and premium industrial electrical components from Nashik, Maharashtra.',
    url: 'https://yashada.netlify.app',
    siteName: 'Yashada Enterprises',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yashada Enterprises — Industrial Tapes & Electrical Components, Nashik',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashada Enterprises | Industrial Tapes & Electrical Components',
    description: 'Self-adhesive tapes & electrical panel components — Nashik, Maharashtra.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code after deploying:
    // google: 'your-verification-code',
  },
  other: {
    // AI-optimized content index (llms.txt standard)
    'llms-txt': 'https://yashada.netlify.app/llms.txt',
    'llms-full-txt': 'https://yashada.netlify.app/llms-full.txt',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Yashada Enterprises',
  description: 'Converters of self-adhesive tapes and authorized distributors of industrial electrical components including cable ties, cable glands, panel accessories, and busbar systems.',
  url: 'https://yashada.netlify.app',
  telephone: '+918208997234',
  email: 'yashadaenterprises@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot No-28 B-14, Flatted Building, MIDC Satpur',
    addressLocality: 'Nashik',
    addressRegion: 'Maharashtra',
    postalCode: '422010',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 20.0063,
    longitude: 73.7903,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  founder: {
    '@type': 'Person',
    name: 'Dilip Brahmankar',
  },
  foundingDate: '2005',
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Self Adhesive Tapes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'PVC Insulation Tape' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Cable Ties & Accessories' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Cable Glands' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Heat Shrink Sleeves' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Panel Accessories' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Busbar Systems' } },
  ],
  sameAs: [
    'https://www.google.com/maps/place/Yashada+Enterprises',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <ScrollToTop />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>

        {/* Netlify Identity Widget */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="lazyOnload"
        />
        {/* Netlify Identity init — client-side only to avoid hydration mismatch */}
        <NetlifyInit />
      </body>
    </html>
  );
}
