import { SITE } from './site';
import type { Faq } from './content';

const ORG_ID = `${SITE.url}/#org`;
const PERSON_ID = `${SITE.url}/about#manika`;

export const orgGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: SITE.name,
      alternateName: 'Dominize',
      url: `${SITE.url}/`,
      logo: `${SITE.url}/icon.svg`,
      description: SITE.description,
      founder: { '@id': PERSON_ID },
      areaServed: 'Worldwide',
      address: { '@type': 'PostalAddress', addressLocality: 'Gurugram', addressRegion: 'Haryana', addressCountry: 'IN' },
      email: SITE.email,
      sameAs: [SITE.linkedin],
      knowsAbout: ['Go-to-market strategy', 'Product marketing', 'Ideal customer profile', 'Competitive intelligence', 'B2B positioning', 'Demand generation', 'Generative engine optimization', 'Marketing analytics', 'GTM engineering', 'AI agents for marketing'],
      potentialAction: {
        '@type': 'ReserveAction',
        name: 'Book a GTM Diagnostic',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/book`, actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] },
      },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Manika Gupta',
      jobTitle: 'Founder & AI GTM and Growth Consultant',
      worksFor: { '@id': ORG_ID },
      sameAs: [SITE.linkedin, SITE.ciHub],
      alumniOf: 'Amity University',
      knowsAbout: ['Product marketing', 'Go-to-market strategy', 'Banking technology', 'AI workflow automation'],
    },
    { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name, publisher: { '@id': ORG_ID } },
  ],
});

export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
});

export const serviceSchema = (s: { name: string; description: string; slug: string; audience: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.name,
  serviceType: s.name,
  provider: { '@id': ORG_ID },
  areaServed: 'Worldwide',
  audience: { '@type': 'BusinessAudience', audienceType: s.audience },
  description: s.description,
  url: `${SITE.url}/services/${s.slug}`,
  potentialAction: { '@type': 'ReserveAction', name: 'Book a GTM Diagnostic', target: `${SITE.url}/book?service=${s.slug}` },
});

export const articleSchema = (a: { title: string; description: string; slug: string; published: string; updated: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.description,
  url: `${SITE.url}/insights/${a.slug}`,
  datePublished: a.published,
  dateModified: a.updated || a.published,
  author: { '@id': PERSON_ID, '@type': 'Person', name: 'Manika Gupta' },
  publisher: { '@id': ORG_ID },
  mainEntityOfPage: `${SITE.url}/insights/${a.slug}`,
});
