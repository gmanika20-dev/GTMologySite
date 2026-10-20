import type { Metadata } from 'next';
import Link from 'next/link';
import { getInsights, type Insight } from '@/lib/content';
import { JsonLd } from '@/components/ui';
import { breadcrumbs } from '@/lib/schema';
import Icon from '@/components/icons';

export const metadata: Metadata = {
  title: 'Insights: Whitepapers, Case Studies & GTM Articles for B2B SaaS | Dominize',
  description: 'Whitepapers, case studies and field notes on go-to-market strategy, AI search, efficient growth, product launches and AI agents for B2B SaaS teams.',
  alternates: { canonical: '/insights' },
};

const GROUPS: { type: string; title: string; icon: string; cover: number }[] = [
  { type: 'Whitepaper', title: 'Whitepapers', icon: 'doc', cover: 0 },
  { type: 'Case Study', title: 'Case studies', icon: 'flag', cover: 1 },
  { type: 'Blog', title: 'Articles', icon: 'pen', cover: 2 },
];

function PostCard({ p, icon, cover }: { p: Insight; icon: string; cover: number }) {
  return (
    <Link href={`/insights/${p.slug}`} className="card post-card with-cover" data-reveal>
      <span className={`post-cover c${cover}`} aria-hidden="true"><Icon name={icon} size={40} /></span>
      <span>
        <span className="meta"><span>{p.type}</span><span>{p.topic}</span><span>{p.readTime}</span></span>
        <h3 className="h3" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22, margin: '16px 0' }}>{p.title}</h3>
        <p className="muted" style={{ fontSize: 15, margin: 0 }}>{p.inShort}</p>
      </span>
      <span className="micro" style={{ marginTop: 20 }}>{p.published} · Read →</span>
    </Link>
  );
}

export default function InsightsHub() {
  const posts = getInsights();
  const known = GROUPS.map((g) => g.type);
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }])} />
      <section className="svc-hero">
        <div className="wrap stack">
          <h1 className="h1" data-reveal>GTM <em>insights</em></h1>
          <nav className="practice-nav" aria-label="Insight types" data-reveal>
            {GROUPS.filter((g) => posts.some((p) => p.type === g.type)).map((g) => (
              <a key={g.type} href={`#${g.type.toLowerCase().replace(/s+/g, '-')}`} className="practice-chip"><Icon name={g.icon} size={20} /><span>{g.title}</span></a>
            ))}
          </nav>
        </div>
      </section>
      {GROUPS.map((g) => {
        const list = posts.filter((p) => p.type === g.type || (g.type === 'Blog' && !known.includes(p.type)));
        if (!list.length) return null;
        return (
          <section key={g.type} id={g.type.toLowerCase().replace(/s+/g, '-')} className="section tight insight-group">
            <div className="wrap stack">
              <h2 className="h2" data-reveal>{g.title}</h2>
              <div className="post-list" style={{ marginTop: 24 }}>
                {list.map((p) => <PostCard key={p.slug} p={p} icon={g.icon} cover={g.cover} />)}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
