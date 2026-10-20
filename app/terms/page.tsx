import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms of Use | Dominize', description: 'Terms of use for the Dominize website and free GTM health check.', alternates: { canonical: '/terms' } };

export default function Terms() {
  return (
    <section className="svc-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal · Draft: review with a lawyer before launch</p>
        <h1 className="h1" style={{ marginBottom: 24 }}>Terms of use</h1>
        <p>Last updated: 15 October 2026. By using {SITE.url} you agree to these terms.</p>
        <h2>Information, not advice</h2>
        <p>Content on this site, including GTM health check results and insights, is general information to help you think about your go-to-market. It is not a guarantee of results. Engagements are governed by a separate signed agreement.</p>
        <h2>The free GTM health check</h2>
        <p>The GTM health check is a free self-assessment based on your answers. Its scores are indicative and depend on the accuracy of what you enter.</p>
        <h2>Intellectual property</h2>
        <p>The site design, content, frameworks (including the Dominize service map and GTM health check method) and code belong to Dominize Consultancy. You may share links and quote short excerpts with attribution.</p>
        <h2>Acceptable use</h2>
        <p>Don&rsquo;t misuse the site: no automated abuse of forms, no attempts to break security, no unlawful use. AI agents and crawlers may read public pages in line with robots.txt.</p>
        <h2>Liability</h2>
        <p>To the extent permitted by law, Dominize isn&rsquo;t liable for indirect losses from using the site. Nothing limits liability that cannot be limited by law.</p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India, and the courts at New Delhi, India have exclusive jurisdiction.</p>
        <h2>Contact</h2>
        <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
      </div>
    </section>
  );
}
