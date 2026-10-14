import type { Metadata } from 'next';
import Link from 'next/link';
import { getInsights } from '@/lib/content';
import { Crumbs, JsonLd } from '@/components/ui';
import { breadcrumbs } from '@/lib/schema';
import Icon from '@/components/icons';
const POST_ICONS = ['layers', 'bot', 'users'];

export const metadata: Metadata = {
  title: 'Insights: GTM Strategy for B2B SaaS & Fintech | GTMology',
  description: 'Research, frameworks and field notes on GTM strategy, positioning, demand generation and AI marketing automation for B2B SaaS and fintech.',
  alternates: { canonical: '/insights' },
};

export default function InsightsHub() {
  const posts = getInsights();
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }])} />
      <section className="svc-hero">
        <div className="wrap stack">
          <h1 className="h1" data-reveal>GTM <em>insights</em></h1>
        </div>
      </section>
      <section className="section tight">
        <div className="wrap">
          <div className="post-list">
            {posts.map((p, i) => (
              <Link key={p.slug} href={`/insights/${p.slug}`} className="card post-card with-cover" data-reveal>
                <span className={`post-cover c${i % 3}`} aria-hidden="true"><Icon name={POST_ICONS[i % 3]} size={40} /></span>
                <span>
                  <span className="meta"><span>{p.type}</span><span>{p.topic}</span><span>{p.readTime}</span></span>
                  <h2 className="h3" style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 22, margin: '16px 0' }}>{p.title}</h2>
                  <p className="muted" style={{ fontSize: 15, margin: 0 }}>{p.inShort}</p>
                </span>
                <span className="micro" style={{ marginTop: 20 }}>{p.published} · Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
