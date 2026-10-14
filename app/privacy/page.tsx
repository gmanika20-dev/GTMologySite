import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy | GTMology', description: 'How GTMology collects, uses and protects your data.', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return (
    <section className="svc-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal · Draft: review with a lawyer before launch</p>
        <h1 className="h1" style={{ marginBottom: 24 }}>Privacy policy</h1>
        <p>Last updated: 15 October 2026. This policy explains how Manika Gupta, trading as GTMology (&ldquo;we&rdquo;), handles personal data collected through {SITE.url}.</p>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Information you give us:</strong> name, work email, company, website, role, the answers you give in the free GTM health check, and messages you send through booking forms.</li>
          <li><strong>Booking information:</strong> meeting times and details, processed by our scheduling provider.</li>
          <li><strong>Usage data:</strong> pages visited and device information, collected through analytics only if you consent.</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To produce your GTM health check results and email them to you if you ask</li>
          <li>To arrange, prepare for and follow up on your GTM Diagnostic call</li>
          <li>To send GTM insights, only if you opt in (unsubscribe anytime)</li>
          <li>To improve the website</li>
        </ul>
        <p>We do not sell personal data. We do not use your data to train AI models.</p>
        <h2 id="cookies">Cookies &amp; tracking</h2>
        <p>Essential storage keeps the site working (for example, remembering your cookie choice and your progress in the free GTM check). With your consent we also use:</p>
        <ul>
          <li><strong>Analytics:</strong> Google Analytics 4, to understand how the site is used (IP addresses anonymised).</li>
          <li><strong>Marketing:</strong> the LinkedIn Insight Tag, to measure how our ads perform.</li>
        </ul>
        <p>Nothing non-essential loads until you choose &ldquo;Accept&rdquo; or turn a category on in Preferences. You can change or withdraw consent at any time via &ldquo;Cookie settings&rdquo; in the footer.</p>
        <h2>Service providers</h2>
        <p>We use trusted processors to run the site: Vercel (hosting), Supabase (database), Resend (email), Cal.com (scheduling), and, only with your consent, Google Analytics and LinkedIn (analytics and ad measurement). Some providers process data outside India under their own safeguards. They process data only on our instructions.</p>
        <h2>Retention</h2>
        <p>Incomplete GTM health checks are anonymised after 12 months. Leads are kept until you unsubscribe or ask for deletion. Client contracts and bookings are kept for 7 years for legal and financial purposes.</p>
        <h2>Your rights</h2>
        <p>Under India&rsquo;s Digital Personal Data Protection Act 2023, the GDPR and similar laws, you can ask to access, correct, export or delete your data, or withdraw consent. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&rsquo;ll respond within 30 days.</p>
        <h2>Grievance officer &amp; contact</h2>
        <p>For any privacy question, request or complaint under the Digital Personal Data Protection Act 2023, contact our grievance officer: Manika Gupta, GTMology, New Delhi, India · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We aim to respond within 30 days.</p>
        <h2>Governing law</h2>
        <p>This policy is governed by the laws of India, and the courts at New Delhi have jurisdiction.</p>
      </div>
    </section>
  );
}
