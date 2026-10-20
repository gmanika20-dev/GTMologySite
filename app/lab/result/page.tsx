// Server-rendered result for the text-mode Lab (works without JavaScript; agent- and screen-reader-friendly).
import type { Metadata } from 'next';
import Link from 'next/link';
import { QUESTIONS, SYSTEMS } from '@/content/lab';
import { score, band, buildFormulas } from '@/lib/lab-engine';
import { getServices } from '@/lib/content';

export const metadata: Metadata = { title: 'Your GTM Health Check Results | Dominize', robots: { index: false, follow: true } };

export default async function LabResult({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, sp[q.id] ?? '']).filter(([, v]) => /^[A-D]$/.test(v as string)));
  const r = score(answers);
  const f = buildFormulas(r).compound;
  const names = Object.fromEntries(getServices().map((s) => [s.element.symbol, s]));
  const company = (sp.company ?? '').slice(0, 120);

  return (
    <section className="svc-hero">
      <div className="wrap stack" style={{ maxWidth: 860 }}>
        <p className="eyebrow">Diagnosis{company ? ` · ${company}` : ''}</p>
        <h1 className="h1">{SYSTEMS[r.primary].name} is your <em>biggest bottleneck.</em></h1>
        <p className="in-short">{SYSTEMS[r.primary].cause}</p>
        <table className="prose" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <caption className="sr-only">Scores by GTM system</caption>
          <thead><tr><th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--line)' }}>GTM system</th><th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--line)' }}>Score (0–100)</th><th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--line)' }}>Status</th></tr></thead>
          <tbody>{r.ranked.map((c) => <tr key={c}><td style={{ padding: 10, borderBottom: '1px solid var(--line)' }}>{SYSTEMS[c].name}</td><td style={{ padding: 10, borderBottom: '1px solid var(--line)' }}>{r.scores[c]}</td><td style={{ padding: 10, borderBottom: '1px solid var(--line)' }}>{band(r.scores[c])}</td></tr>)}</tbody>
        </table>
        <h2 className="h3" style={{ marginTop: 32 }}>Recommended plan: {f.name}</h2>
        <ul className="check">{f.elements.map((e) => names[e] ? <li key={e}><Link href={`/services/${names[e].slug}`}>{names[e].element.name}</Link>: {names[e].question}</li> : null)}</ul>
        <p className="muted">{f.model} · typical length {f.length}. Scope is tailored on a call.</p>
        <h2 className="h3" style={{ marginTop: 24 }}>What success looks like</h2>
        <p className="muted">{SYSTEMS[r.primary].success}</p>
        <div className="cta-row" style={{ marginTop: 24 }}>
          <Link href={`/book?service=${names[f.elements.find((e) => e !== 'Dx') ?? 'Dx']?.slug ?? 'gtm-diagnosis'}`} className="btn btn-primary">Book a GTM Diagnostic →</Link>
          <Link href="/lab" className="btn btn-ghost">Try the interactive version</Link>
        </div>
      </div>
    </section>
  );
}
