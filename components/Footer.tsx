import Link from 'next/link';
import Logo from './Logo';
import { getServices } from '@/lib/content';
import { SITE } from '@/lib/site';
import { CookieSettingsLink } from './Consent';

export default function Footer() {
  const services = getServices();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href="/" className="logo"><Logo /><span className="logo-text">Dominize<small>with Manika Gupta</small></span></Link>
            <p className="muted" style={{ maxWidth: '38ch', fontSize: 15 }}>AI-enabled GTM transformation for B2B SaaS. Clear strategy, measurable pipeline.</p>
            <Link href="/book" className="btn btn-primary btn-sm">Book a Growth Strategy Call <span className="arrow">→</span></Link>
          </div>
          <div>
            <h2>Services</h2>
            <ul>{services.slice(0, Math.ceil(services.length / 2)).map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.question}</Link></li>)}</ul>
          </div>
          <div>
            <h2>More services</h2>
            <ul>{services.slice(Math.ceil(services.length / 2)).map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.question}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Get started</h2>
            <ul>
              <li><Link href="/lab">Free GTM Scorecard</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/about">About Manika</Link></li>
              <li><a href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© {new Date().getFullYear()} Dominize Consultancy · {SITE.location}</span>
          <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <CookieSettingsLink /> · <a href="/llms.txt">llms.txt</a> · <a href="/services.json">services.json</a></span>
        </div>
      </div>
    </footer>
  );
}
