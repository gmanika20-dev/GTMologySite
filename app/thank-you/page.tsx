import type { Metadata } from 'next';
import Link from 'next/link';
import TrackLead from '@/components/TrackLead';

export const metadata: Metadata = { title: "You're booked | Dominize", robots: { index: false, follow: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const name = (sp.name ?? '').replace(/[^\p{L} '-]/gu, '').slice(0, 40);
  const source = (sp.src ?? 'site-form').replace(/[^a-z-]/gi, '').slice(0, 20);
  return (
    <section className="svc-hero" style={{ minHeight: '80svh' }}>
      <TrackLead source={source} />
      <div className="wrap stack" style={{ maxWidth: 860 }}>
        <p className="eyebrow">Confirmed</p>
        <h1 className="h1">{name ? `Thank you, ${name}. ` : ''}You&rsquo;re booked. <em>Let&rsquo;s get your growth moving.</em></h1>
        <p className="lede">A confirmation is on its way to your inbox with your next steps and, if you took the free GTM check, your results summary.</p>
        <article className="card" style={{ marginTop: 24 }}>
          <span className="num">BEFORE WE MEET</span>
          <ul className="check" style={{ marginTop: 12 }}>
            <li>Your current pitch deck or sales one-pager</li>
            <li>Your website and your top 3 competitors</li>
            <li>Last quarter&rsquo;s funnel numbers (traffic → leads → opportunities), even rough ones</li>
            <li>Your best 5 customers, and why they&rsquo;re the best</li>
          </ul>
        </article>
        <div className="cta-row" style={{ marginTop: 16 }}><Link href="/insights" className="btn btn-ghost">Read an insight while you wait →</Link></div>
      </div>
    </section>
  );
}
