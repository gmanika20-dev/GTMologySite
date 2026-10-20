import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { JsonLd } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Free AI Tools for GTM Teams | Dominize',
  description: "AI tools built by Dominize for go-to-market teams. Use them free, no Claude account needed. Start with MG's Competitive Intelligence Hub.",
  alternates: { canonical: '/agents' },
};

export default function Agents() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: "MG's Competitive Intelligence Hub", applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: SITE.ciHub, creator: { '@id': `${SITE.url}/about#manika` }, description: 'A multi-stage AI research pipeline that produces a full competitive-intelligence report in minutes.' }} />
      <section className="svc-hero">
        <div className="wrap stack">
          <p className="eyebrow">Free tools</p>
          <h1 className="h1">AI tools for <em>GTM teams.</em></h1>
          <p className="in-short">AI tools built by Dominize for go-to-market teams. Use them free, no Claude account needed.</p>
          <div className="cards c3" style={{ marginTop: 24 }}>
            <a className="card" href={SITE.ciHub} target="_blank" rel="noopener">
              <span className="num">LIVE</span>
              <h2 className="h3">MG&rsquo;s Competitive Intelligence Hub</h2>
              <p>A multi-stage AI pipeline: competitors, positioning scorecard, reviews, ICP overlap, feature grid, SEO, SWOT, battle cards and an action plan, in minutes.</p>
              <p className="micro" style={{ marginTop: 14 }}>Launch →</p>
            </a>
            <article className="card"><span className="num">COMING SOON</span><h2 className="h3">More tools</h2><p>New GTM tools are on the way. Ask to be notified when they launch: <a href={`mailto:${SITE.email}?subject=Notify%20me%20about%20new%20Dominize%20tools`}>{SITE.email}</a></p></article>
          </div>
        </div>
      </section>
    </>
  );
}
