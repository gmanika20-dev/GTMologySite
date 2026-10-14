import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getService, getServices, getServiceBySymbol, getInsights } from '@/lib/content';
import { Crumbs, ElementTile, FaqList, JsonLd } from '@/components/ui';
import { breadcrumbs, faqSchema, serviceSchema } from '@/lib/schema';
import ServiceSections from '@/components/ServiceSections';
import Icon, { SERVICE_ICON } from '@/components/icons';

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: s.seoTitle, description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.seoTitle, description: s.metaDescription, url: `/services/${s.slug}`, type: 'website' },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const pairs = s.pairs.map(getServiceBySymbol).filter((x): x is NonNullable<typeof x> => !!x && x.slug !== s.slug);
  const related = getInsights().filter((i) => i.relatedServices.includes(s.slug)).slice(0, 2);
  const audience = s.glance.find((g) => g.label.startsWith('Who'))?.value ?? 'B2B SaaS and fintech companies';
  const bookHref = `/book?service=${s.slug}`;

  return (
    <>
      <JsonLd data={serviceSchema({ name: s.element.name, description: s.inShort, slug: s.slug, audience })} />
      <JsonLd data={faqSchema(s.faqs)} />
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: s.element.name, path: `/services/${s.slug}` }])} />

      <section className="svc-hero">
        <div className="wrap svc-hero-grid">
          <div className="stack">
            <h1 className="h1" data-reveal>{s.question}</h1>
            <p className="in-short" data-reveal>{s.inShort}</p>
          </div>
          <div className="svc-hero-art" data-reveal aria-hidden="true">
            <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
            <span className="art-core" data-group={s.element.group}><Icon name={SERVICE_ICON[s.element.symbol] ?? 'spark'} size={64} /></span>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 24 }}>
        <div className="wrap svc-layout">
          <article className="prose">
            <ServiceSections sections={s.sections} />
            {s.takeaways.length > 0 && (
              <section className="takeaways" data-reveal style={{ marginTop: 56 }}>
                <h2>Key takeaways</h2>
                <ul>{s.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            )}
            {pairs.length > 0 && (
              <section data-reveal>
                <h2>Pairs well with</h2>
                <div className="pairs">{pairs.map((p) => <ElementTile key={p.slug} s={p} compact />)}</div>
              </section>
            )}
            <section data-reveal>
              <h2>Frequently asked questions</h2>
              <FaqList faqs={s.faqs} />
            </section>
            {related.length > 0 && (
              <section data-reveal>
                <h2>Related insights</h2>
                <ul>{related.map((r) => <li key={r.slug}><Link href={`/insights/${r.slug}`}>{r.title}</Link></li>)}</ul>
              </section>
            )}
            <p className="micro" style={{ marginTop: 40 }}>Written by <Link href="/about">Manika Gupta</Link> · Last updated {s.lastUpdated}</p>
          </article>

          <aside className="svc-aside" aria-label="At a glance">
            <div className="glance">
              <h2>At a glance</h2>
              <dl>{s.glance.map((g) => <div key={g.label}><dt>{g.label}</dt><dd>{g.value}</dd></div>)}</dl>
              <div className="actions">
                <Link href={bookHref} className="btn btn-primary">Book a GTM Diagnostic <span className="arrow">→</span></Link>
                <Link href={`/lab?from=${s.slug}`} className="btn btn-ghost">Not sure yet? Take the free GTM check</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap stack" style={{ textAlign: 'center', display: 'grid', justifyItems: 'center' }}>
          <h2 className="h2" data-reveal style={{ maxWidth: '20ch' }}>Ready to <em>get started?</em></h2>
          <div className="cta-row" data-reveal style={{ justifyContent: 'center' }}>
            <Link href={bookHref} className="btn btn-primary">Book a GTM Diagnostic <span className="arrow">→</span></Link>
            <Link href="/services" className="btn btn-ghost">See all services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
