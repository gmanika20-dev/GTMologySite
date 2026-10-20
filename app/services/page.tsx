import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/content';
import { APPROACH, FORMULAS, PRACTICES } from '@/lib/site';
import { FaqList, JsonLd } from '@/components/ui';
import { breadcrumbs, faqSchema } from '@/lib/schema';
import Icon, { SERVICE_ICON } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Go-to-Market Strategy Services for B2B SaaS | Dominize',
  description: 'GTM consulting for B2B SaaS across customer, product and market strategy, marketing and demand generation, sales excellence, and digital growth with AI.',
  alternates: { canonical: '/services' },
};

const FAQS = [
  { q: 'Which Dominize service should I start with?', a: 'Start with the GTM Diagnostic, or the free 4-minute GTM Scorecard. It shows which part of your go-to-market is limiting growth and which services fix it first.' },
  { q: 'Can I combine services?', a: 'Yes. Services are designed to work together, and most clients combine them into a programme such as the GTM Clarity Sprint, the Pipeline Growth System, Launch & Sales Readiness or AI Marketing Transformation.' },
  { q: 'What are the ways to work with Dominize?', a: 'Three engagement models: a one-time project with defined deliverables, a monthly retainer for ongoing execution, or an annual contract where Manika works as your embedded fractional GTM lead.' },
  { q: 'Do you only advise, or do you also implement?', a: 'Both. We advise on strategy and then build the assets, campaigns, sales materials and systems with your team, so the recommendations turn into results.' },
];

const PACKAGE_ICONS = ['target', 'growth', 'rocket', 'bot'];

export default function ServicesHub() {
  const all = getServices();
  const bySlug = Object.fromEntries(all.map((s) => [s.slug, s]));
  const bySymbol = Object.fromEntries(all.map((s) => [s.element.symbol, s]));
  const diag = bySlug['gtm-diagnosis'];
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Dominize services', itemListElement: all.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `/services/${s.slug}`, name: s.element.name })) }} />

      <section className="svc-hero offer-hero">
        <div className="wrap stack">
          <h1 className="h1" data-reveal>We help B2B SaaS companies <em>own their market.</em></h1>
          <p className="lede offer-lede" data-reveal>Dominize improves every lever of your go-to-market: the customers you target, the value you offer, how you market, how you sell, and the systems behind it all. We advise, then help you implement, with AI where it makes the work faster.</p>
          <nav className="practice-nav" aria-label="Practice areas" data-reveal>
            {PRACTICES.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="practice-chip" data-group={p.group}><Icon name={p.icon} size={20} /><span>{p.title}</span></a>
            ))}
          </nav>
        </div>
      </section>

      {diag && (
        <section className="section tight">
          <div className="wrap">
            <div className="start-band" data-reveal>
              <div className="stack">
                <h2 className="h2">Start with a diagnosis, <em>not a pitch.</em></h2>
              </div>
              <div className="start-actions">
                <Link href="/services/gtm-diagnosis" className="card start-card feature">
                  <span className="ico-wrap"><Icon name="search" /></span>
                  <h3 className="h3">{diag.element.name}</h3>
                  <p>A full review of how you find, convince and convert buyers, with a ranked list of what to fix first.</p>
                  <span className="go">See the GTM Diagnostic <span className="arrow">→</span></span>
                </Link>
                <Link href="/lab" className="card start-card">
                  <span className="ico-wrap"><Icon name="chart" /></span>
                  <h3 className="h3">Free GTM Scorecard</h3>
                  <p>Answer a few questions and see which part of your go-to-market needs attention first.</p>
                  <span className="go">Take the free check <span className="arrow">→</span></span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {PRACTICES.map((p, i) => (
        <section key={p.id} id={p.id} className={`practice${i % 2 === 0 ? ' alt' : ''}`} data-group={p.group} aria-labelledby={`${p.id}-title`}>
          <div className="wrap practice-grid">
            <div className="practice-head" data-reveal>
              <span className="practice-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`${p.id}-title`} className="h2">{p.title}</h2>
              <p className="practice-promise">{p.promise}</p>
            </div>
            <ul className="cap-list">
              {p.capabilities.map((c) => {
                const s = bySlug[c.slug];
                if (!s) return null;
                return (
                  <li key={`${p.id}-${c.slug}`} data-reveal>
                    <Link href={`/services/${c.slug}`} className="cap-row">
                      <span className="ico-wrap sm"><Icon name={SERVICE_ICON[s.element.symbol] ?? 'spark'} size={22} /></span>
                      <div className="cap-text">
                        <h3 className="h3">{c.name ?? s.element.name}</h3>
                        <span className="cap-line">{c.line}</span>
                      </div>
                      <span className="arrow" aria-hidden="true">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <section className="section tight">
        <div className="wrap stack">
          <h2 className="h2" data-reveal>Combine services into <em>one programme.</em></h2>
          <div className="formulas packages" style={{ marginTop: 28 }}>
            {FORMULAS.map((f, i) => (
              <article key={f.name} className={`card formula${i === 1 ? ' feature' : ''}`} data-reveal>
                <span className="ico-wrap"><Icon name={PACKAGE_ICONS[i] ?? 'layers'} /></span>
                <h3 className="h3">{f.name}</h3>
                <p>{f.line}</p>
                <ul className="pkg-list">
                  {f.symbols.map((sym) => bySymbol[sym] && <li key={sym}><Link href={`/services/${bySymbol[sym].slug}`}>{bySymbol[sym].element.name}</Link></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight band-navy">
        <div className="wrap stack">
          <h2 className="h2" data-reveal>How we work: <em>hands-on and focused on results.</em></h2>
          <div className="approach-grid" style={{ marginTop: 28 }}>
            {APPROACH.map((a) => (
              <article key={a.title} className="approach" data-reveal>
                <span className="ico-wrap"><Icon name={a.icon} /></span>
                <h3 className="h3">{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
          <p className="engage-line" data-reveal>Work with us as a <strong>one-time project</strong>, a <strong>monthly retainer</strong> or an <strong>annual partnership</strong>.</p>
          <div className="cta-row" data-reveal><Link href="/book" className="btn btn-primary">Book a Growth Strategy Call <span className="arrow">→</span></Link><Link href="/lab" className="btn btn-ghost">Get your free GTM Scorecard</Link></div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap grid-2">
          <h2 className="h2" data-reveal>Frequently asked <em>questions</em></h2>
          <div data-reveal><FaqList faqs={FAQS} /></div>
        </div>
      </section>
    </>
  );
}
