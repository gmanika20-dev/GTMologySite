import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInsight, getInsights } from '@/lib/content';
import { Crumbs, JsonLd } from '@/components/ui';
import { articleSchema, breadcrumbs, faqSchema } from '@/lib/schema';

export function generateStaticParams() {
  return getInsights().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getInsight((await params).slug);
  if (!p) return {};
  return {
    title: p.seoTitle, description: p.metaDescription,
    alternates: { canonical: `/insights/${p.slug}` },
    authors: [{ name: 'Manika Gupta', url: '/about' }],
    openGraph: { title: p.seoTitle, description: p.metaDescription, type: 'article', publishedTime: p.published, modifiedTime: p.lastUpdated, authors: ['Manika Gupta'] },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const p = getInsight((await params).slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd data={articleSchema({ title: p.title, description: p.metaDescription, slug: p.slug, published: p.published, updated: p.lastUpdated })} />
      {p.faqs.length > 0 && <JsonLd data={faqSchema(p.faqs)} />}
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }, { name: p.title, path: `/insights/${p.slug}` }])} />
      <header className="article-head">
        <div className="wrap stack" style={{ maxWidth: 920 }}>
          <Crumbs items={[{ name: 'Home', href: '/' }, { name: 'Insights', href: '/insights' }, { name: p.type }]} />
          <p className="eyebrow">{p.type} · {p.topic} · {p.readTime}</p>
          <h1 className="h1">{p.title}</h1>
          <p className="micro">By <Link href="/about">Manika Gupta</Link> · Published <time dateTime={p.published}>{p.published}</time> · Updated <time dateTime={p.lastUpdated}>{p.lastUpdated}</time></p>
          <p className="in-short">{p.inShort}</p>
        </div>
      </header>
      <svg className="viz-defs" aria-hidden="true" focusable="false"><defs><marker id="viz-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7A1F2B" /></marker></defs></svg>
      <div className="paper" style={{ position: 'relative', zIndex: 2 }}>
        <div className="wrap" style={{ maxWidth: 920, padding: 'clamp(48px,7vw,96px) var(--gutter)' }}>
          <article className="prose" style={{ maxWidth: '72ch' }} dangerouslySetInnerHTML={{ __html: p.html }} />
        </div>
      </div>
    </>
  );
}
