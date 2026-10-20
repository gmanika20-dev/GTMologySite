import type { Metadata } from 'next';
import Link from 'next/link';
import LabApp from '@/components/LabApp';
import { getServices } from '@/lib/content';
import { QUESTIONS, INTAKE } from '@/content/lab';
import { FaqList, JsonLd } from '@/components/ui';
import { breadcrumbs, faqSchema } from '@/lib/schema';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Free GTM Health Check: 4-Minute GTM Audit | Dominize',
  description: "Find what's slowing your go-to-market in 4 minutes. Answer 10 questions, get a score across 6 GTM systems and a recommended fix. Free, no sign-up.",
  alternates: { canonical: '/lab' },
};

const FAQS = [
  { q: 'Is the GTM health check free?', a: "Yes. The GTM health check is free, takes about four minutes, and doesn't require an account. An email address is only needed if you want a copy of your results." },
  { q: 'What does the GTM diagnostic measure?', a: 'It measures the health of six go-to-market systems: audience and ICP, positioning and messaging, demand generation, conversion, sales enablement, and data, operations and AI. It then identifies your biggest bottleneck.' },
  { q: 'What happens with my answers?', a: "They're used only to generate your diagnosis and, if you book a call, to prepare for it. See the privacy policy." },
];
const HOWTO = ['About you: tell us about your company', 'Your challenges: answer about 10 quick questions', 'Your results: see your scores across six areas and your biggest bottleneck', 'Your plan: choose a quick win, the recommended plan or a full transformation', 'How we’ll work: see the timeline and how we would work together', 'Next step: book a call if you want help'];

export default async function LabPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const textMode = sp.mode === 'text';
  const elements = Object.fromEntries(getServices().map((s) => [s.element.symbol, { name: s.element.name, slug: s.slug, question: s.question }]));

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Dominize Free GTM Health Check', url: `${SITE.url}/lab`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, provider: { '@id': `${SITE.url}/#org` } }} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to run a free GTM health check with Dominize', totalTime: 'PT4M', step: HOWTO.map((t, i) => ({ '@type': 'HowToStep', position: i + 1, text: t })) }} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Free GTM Check', path: '/lab' }])} />

      {textMode ? (
        <section className="svc-hero">
          <div className="wrap stack" style={{ maxWidth: 860 }}>
            <h1 className="h1">Free GTM health check: <em>text version</em></h1>
            <p className="in-short">An accessible, plain-HTML version of the free 4-minute GTM diagnostic. Answer the questions and submit to see your scores across six GTM systems.</p>
            <form action="/lab/result" method="get" className="form-grid">
              <div className="form-grid two">
                <div className="field"><label htmlFor="t-name">First name</label><input id="t-name" name="name" autoComplete="given-name" /></div>
                <div className="field"><label htmlFor="t-co">Company</label><input id="t-co" name="company" autoComplete="organization" /></div>
                <div className="field"><label htmlFor="t-stage">Company stage</label><select id="t-stage" name="stage" defaultValue=""><option value="">Select…</option>{INTAKE.stages.map((s) => <option key={s}>{s}</option>)}</select></div>
                <div className="field"><label htmlFor="t-ind">Industry</label><select id="t-ind" name="industry" defaultValue=""><option value="">Select…</option>{INTAKE.industries.map((s) => <option key={s}>{s}</option>)}</select></div>
              </div>
              {QUESTIONS.map((q, i) => (
                <fieldset key={q.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
                  <legend style={{ padding: '0 8px', fontWeight: 600 }}>{i + 1}. {q.text}</legend>
                  {q.options.map((o) => (
                    <label key={o.id} style={{ display: 'flex', gap: 10, padding: '6px 0', color: 'var(--ink-2)' }}>
                      <input type="radio" name={q.id} value={o.id} required /> {o.id}. {o.label}
                    </label>
                  ))}
                </fieldset>
              ))}
              <div className="cta-row"><button className="btn btn-primary" type="submit">See my diagnosis →</button><Link href="/lab" className="linkbtn">Use the interactive version</Link></div>
            </form>
          </div>
        </section>
      ) : (
        <>
          <LabApp elements={elements} calLink={SITE.calLink || undefined} from={sp.from} />
          <section className="section tight" aria-labelledby="about-lab">
            <div className="wrap grid-2">
              <FaqList faqs={FAQS} />
            </div>
          </section>
        </>
      )}
    </>
  );
}
