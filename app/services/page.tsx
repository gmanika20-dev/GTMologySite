import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/content';
import { FORMULAS } from '@/lib/site';
import { PeriodicTable } from '@/components/home-bits';
import { Crumbs, FaqList, JsonLd } from '@/components/ui';
import { breadcrumbs, faqSchema } from '@/lib/schema';
import Icon, { SERVICE_ICON } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Go-to-Market Strategy Services for B2B SaaS | GTMology',
  description: 'Eleven GTM services across strategy, growth, intelligence and AI. Available as a one-time project, monthly retainer or annual contract.',
  alternates: { canonical: '/services' },
};

const FAQS = [
  { q: 'Which GTMology service should I start with?', a: 'Start with the GTM Diagnosis, or the free 4-minute GTM health check. It identifies which of the six GTM systems is limiting your pipeline and recommends the services that fix it first.' },
  { q: 'Can I combine services?', a: 'Yes. Services are designed to combine into packages. For example, the GTM Clarity Sprint combines competitive intelligence, ICP, positioning and brand voice.' },
  { q: 'What are the ways to work with GTMology?', a: 'Three engagement models: a one-time project with defined deliverables, a monthly retainer for ongoing execution, or an annual contract where Manika works as your embedded fractional GTM lead.' },
];

export default function ServicesHub() {
  const all = getServices();
  const services = all.map(({ slug, element, question }) => ({ slug, element, question }));
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'GTMology services', itemListElement: all.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `/services/${s.slug}`, name: s.element.name })) }} />
      <section className="svc-hero">
        <div className="wrap stack">
          <p className="eyebrow" data-reveal>Our services</p>
          <h1 className="h1" data-reveal>Every growth problem has a <em>service</em> that fixes it.</h1>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap"><PeriodicTable services={services} formulas={FORMULAS} /></div>
      </section>
      <section className="section tight">
        <div className="wrap stack">
          <h2 className="h2" data-reveal>Start with the question <em>you&rsquo;re asking.</em></h2>
          <div className="cards" style={{ marginTop: 28 }}>
            {all.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card svc-card" data-reveal data-group={s.element.group}>
                <span className="ico-wrap"><Icon name={SERVICE_ICON[s.element.symbol] ?? 'spark'} /></span>
                <h3 className="h3">{s.question}</h3>
                <p>{s.inShort}</p>
              </Link>
            ))}
          </div>
          <div className="cta-row" data-reveal><Link href="/lab" className="btn btn-primary">Not sure? Take the free GTM check <span className="arrow">→</span></Link><Link href="/book" className="btn btn-ghost">Book a GTM Diagnostic</Link></div>
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
