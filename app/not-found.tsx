import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="svc-hero" style={{ minHeight: '80svh' }}>
      <div className="wrap stack">
        <p className="eyebrow">Error 404 · Page not found</p>
        <h1 className="h1">We couldn&rsquo;t find <em>that page.</em></h1>
        <p className="lede">The page you&rsquo;re looking for doesn&rsquo;t exist, or it moved.</p>
        <div className="cta-row"><Link href="/" className="btn btn-primary">Back to home <span className="arrow">→</span></Link><Link href="/services" className="btn btn-ghost">See all services</Link></div>
      </div>
    </section>
  );
}
