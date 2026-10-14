'use client';
// Cookie consent banner + consent-gated loading of GA4, Meta Pixel and LinkedIn Insight Tag.
// Nothing non-essential loads until the visitor opts in (India DPDP Act 2023 / GDPR friendly).
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TRACKING, trackingConfigured } from '@/lib/track';

type Choice = { analytics: boolean; marketing: boolean; ts: string };
const KEY = 'gtm-consent-v1';
const read = (): Choice | null => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };

function inject(id: string, src?: string, inline?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script'); s.id = id; s.async = true;
  if (src) s.src = src; if (inline) s.text = inline;
  document.head.appendChild(s);
}

function load(c: Choice) {
  if (c.analytics && TRACKING.ga) {
    inject('ga-src', `https://www.googletagmanager.com/gtag/js?id=${TRACKING.ga}`);
    inject('ga-init', undefined, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'${c.marketing ? 'granted' : 'denied'}',ad_user_data:'${c.marketing ? 'granted' : 'denied'}',ad_personalization:'${c.marketing ? 'granted' : 'denied'}',analytics_storage:'granted'});gtag('js',new Date());gtag('config','${TRACKING.ga}',{anonymize_ip:true});`);
  }
  if (c.marketing && TRACKING.meta) {
    inject('meta-pixel', undefined, `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${TRACKING.meta}');fbq('track','PageView');`);
  }
  if (c.marketing && TRACKING.linkedin) {
    inject('li-insight', undefined, `window._linkedin_partner_id='${TRACKING.linkedin}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);`);
  }
}

export default function Consent() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!trackingConfigured()) return;
    const c = read();
    if (c) load(c); else setOpen(true);
    const reopen = () => { const cur = read(); setAnalytics(cur?.analytics ?? true); setMarketing(cur?.marketing ?? true); setPrefs(true); setOpen(true); };
    window.addEventListener('gtm:consent', reopen);
    return () => window.removeEventListener('gtm:consent', reopen);
  }, []);

  // SPA page views
  useEffect(() => {
    const w = window as Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
    w.gtag?.('event', 'page_view', { page_path: pathname });
    w.fbq?.('track', 'PageView');
  }, [pathname]);

  const save = (a: boolean, m: boolean) => {
    const c = { analytics: a, marketing: m, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {}
    const hadScripts = !!document.getElementById('ga-src') || !!document.getElementById('meta-pixel') || !!document.getElementById('li-insight');
    setOpen(false); setPrefs(false);
    if (hadScripts && (!a || !m)) { window.location.reload(); return; } // withdrawing consent: reload to unload trackers
    load(c);
  };

  if (!open) return null;
  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <div className="consent-inner">
        <div className="consent-text">
          <strong>Your privacy, your choice.</strong>
          <p>We use cookies to understand how the site is used and to measure our ads. Nothing non-essential runs unless you allow it. <Link href="/privacy#cookies">Privacy &amp; cookies</Link></p>
          {prefs && (
            <div className="consent-prefs">
              <label><input type="checkbox" checked disabled /> Essential <span>Always on: keeps the site working</span></label>
              <label><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Analytics <span>Google Analytics: anonymised usage stats</span></label>
              <label><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing <span>LinkedIn: ad measurement</span></label>
            </div>
          )}
        </div>
        <div className="consent-actions">
          {prefs ? (
            <button className="btn btn-primary btn-sm" onClick={() => save(analytics, marketing)}>Save choices</button>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => save(false, false)}>Reject non-essential</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPrefs(true)}>Preferences</button>
              <button className="btn btn-primary btn-sm" onClick={() => save(true, true)}>Accept all</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink() {
  return <button type="button" className="linkbtn foot-cookie" onClick={() => window.dispatchEvent(new Event('gtm:consent'))}>Cookie settings</button>;
}
