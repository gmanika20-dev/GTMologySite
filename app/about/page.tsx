import type { Metadata } from 'next';
import Link from 'next/link';
import { Crumbs, JsonLd } from '@/components/ui';
import { breadcrumbs } from '@/lib/schema';
import { SITE, KNOWN_FOR } from '@/lib/site';
import Icon from '@/components/icons';
const FACT_ICONS = ['layers', 'users', 'globe'];
const KNOWN_ICONS = ['globe', 'growth', 'search', 'compass'];

export const metadata: Metadata = {
  title: 'Manika Gupta: AI GTM & Growth Consultant | Dominize',
  description: 'Product marketing, GTM, demand gen, analytics and AI automation across banking-tech and SaaS. Meet the consultant behind Dominize.',
  alternates: { canonical: '/about' },
};

// Fast facts: keep this wording identical to LinkedIn and directory profiles (GEO entity consistency).
const FACTS = {
  name: 'Manika Gupta',
  role: 'Founder, Dominize Consultancy · AI GTM & Growth Consultant',
  specialism: 'AI-enabled GTM transformation for B2B SaaS & fintech',
  details: [
    { label: 'Experience', value: 'Product marketing, GTM, demand generation, analytics and AI automation' },
    { label: 'Industries', value: 'B2B SaaS, banking technology & fintech, healthcare, D2C' },
    { label: 'Based in', value: 'Gurugram (Delhi NCR), India · works globally' },
  ],

};

export default function About() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@id': `${SITE.url}/about#manika` }, url: `${SITE.url}/about` }} />
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />

      <section className="svc-hero">
        <div className="wrap about-hero">
          <div className="stack">
            <h1 className="h1" data-reveal>{FACTS.name}</h1>
            <p className="lede" data-reveal>{FACTS.role}</p>
          </div>
          <figure className="portrait" data-reveal data-parallax="0.06">
            <img src="/media/manika-gupta.webp" alt="Manika Gupta, founder of Dominize Consultancy, at her desk" width={1374} height={1145} decoding="async" fetchPriority="high" />
            <figcaption className="micro">Manika Gupta · Founder, Dominize Consultancy</figcaption>
          </figure>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <div className="wrap stack">
          <div className="cards c3">
            {FACTS.details.map((d, i) => (
              <article key={d.label} className="card" data-reveal>
                <span className="ico-wrap"><Icon name={FACT_ICONS[i % 3]} /></span>
                <span className="num">{d.label.toUpperCase()}</span>
                <p style={{ marginTop: 12, fontSize: 18, color: 'var(--ink)' }}>{d.value}</p>
              </article>
            ))}
          </div>

          <p className="eyebrow" data-reveal style={{ marginTop: 48 }}>Known for</p>
          <div className="cards known icon-cards">
            {KNOWN_FOR.map((k, i) => (
              <article key={k.title} className="card" data-reveal>
                <span className="ico-wrap"><Icon name={KNOWN_ICONS[i % 4]} /></span>
                <h3 className="h3">{k.title}</h3>
                <p>{k.text}</p>
              </article>
            ))}
          </div>

          <article className="card contact-card" data-reveal style={{ marginTop: 48 }}>
            <div>
              <span className="num">CONTACT</span>
              <p style={{ marginTop: 12, fontSize: 18, color: 'var(--ink)' }}>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.linkedin} target="_blank" rel="me noopener">LinkedIn</a>
              </p>
            </div>
            <div className="cta-row">
              <Link href="/book" className="btn btn-primary">Book a Growth Strategy Call <span className="arrow">→</span></Link>
              <a href={SITE.linkedin} className="btn btn-ghost" target="_blank" rel="me noopener">Connect on LinkedIn</a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
