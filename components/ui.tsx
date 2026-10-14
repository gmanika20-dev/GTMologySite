import Link from 'next/link';
import type { Faq, Service } from '@/lib/content';
export type ElementInfo = Pick<Service, 'slug' | 'element' | 'question'>;

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary><h3>{f.q}</h3></summary>
          <div className="ans">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function ElementTile({ s, dim = false, compact = false }: { s: ElementInfo; dim?: boolean; compact?: boolean }) {
  return (
    <Link href={`/services/${s.slug}`} className={`el${dim ? ' dim' : ''}`} data-group={s.element.group} data-tilt aria-label={`${s.element.name}: ${s.question}`}>
      <span className="top"><span>{s.element.no}</span><span>{s.element.group.split(' ')[0]}</span></span>
      <span>
        <span className="sym" aria-hidden="true">{s.element.symbol}</span>
        <span className="nm">{s.element.name}</span>
        {!compact && <span className="q">{s.question}</span>}
      </span>
    </Link>
  );
}

export function Lines({ text }: { text: string[] }) {
  return <>{text.map((t, i) => <span key={i} className="line-mask"><span dangerouslySetInnerHTML={{ __html: t }} /></span>)}</>;
}

export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.name} style={{ display: 'inline-flex', gap: 8 }}>
          {it.href ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}
