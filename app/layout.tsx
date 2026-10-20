import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Experience from '@/components/Experience';
import Consent from '@/components/Consent';
import { JsonLd } from '@/components/ui';
import { orgGraph } from '@/lib/schema';
import { SITE } from '@/lib/site';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.title} | GTM Consulting for B2B SaaS`, template: '%s' },
  description: 'Turn your product into a GTM engine. ICP, positioning, demand and AI automation for B2B SaaS, connected into one system. Book a Growth Strategy Call.',
  applicationName: SITE.title,
  authors: [{ name: 'Manika Gupta', url: `${SITE.url}/about` }],
  creator: 'Manika Gupta',
  openGraph: { type: 'website', siteName: SITE.title, locale: 'en_US', url: SITE.url},
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = { themeColor: '#0a0b0f', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="application/json" title="Dominize services catalog" href="/services.json" />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <JsonLd data={orgGraph()} />
        <Experience />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}
