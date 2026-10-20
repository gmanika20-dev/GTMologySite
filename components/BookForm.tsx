'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Diagnosis = { primary?: string; scores?: Record<string, number>; formula?: { name: string; elements: string[]; model: string } };

export default function BookForm({ calLink, service, sessionId, prefill, diagnosis }: {
  calLink?: string; service?: string; sessionId?: string;
  prefill?: { name?: string; email?: string; company?: string; website?: string; role?: string }; diagnosis?: Diagnosis;
}) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');

  if (calLink) {
    const q = new URLSearchParams({ embed: 'true', theme: 'dark', layout: 'month_view' });
    if (prefill?.name) q.set('name', prefill.name);
    if (prefill?.email) q.set('email', prefill.email);
    const notes = [service && `Service: ${service}`, diagnosis?.primary && `GTM Scorecard biggest bottleneck: ${diagnosis.primary}`, diagnosis?.formula && `Plan: ${diagnosis.formula.name} (${diagnosis.formula.elements.join(' + ')})`].filter(Boolean).join(' | ');
    if (notes) q.set('notes', notes);
    if (sessionId) q.set('metadata[session]', sessionId);
    return (
      <div>
        <iframe title="Book a Growth Strategy Call: calendar" src={`https://cal.com/${calLink}?${q}`} style={{ width: '100%', minHeight: 680, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }} loading="lazy" />
        <p className="micro" style={{ marginTop: 10 }}>Calendar not loading? <a href={`https://cal.com/${calLink}`} target="_blank" rel="noopener">Open booking in a new tab</a> or email hello@gtmologyai.com.</p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries()) as Record<string, string>;
    setState('sending'); setErr('');
    const r = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, consent: body.consent === 'on', service, sessionId, diagnosis }) }).catch(() => null);
    if (r?.ok) { router.push(`/thank-you?name=${encodeURIComponent((body.name || '').split(' ')[0])}`); return; }
    const j = await r?.json().catch(() => ({}));
    setErr(j?.error ?? 'Network error. Please try again or email hello@gtmologyai.com.'); setState('error');
  }

  return (
    <form onSubmit={onSubmit} className="form-grid" aria-label="Book a Growth Strategy Call" noValidate={false}>
      <div className="form-grid two">
        <div className="field"><label htmlFor="bf-name">Your name</label><input id="bf-name" name="name" required autoComplete="name" defaultValue={prefill?.name} /></div>
        <div className="field"><label htmlFor="bf-email">Work email</label><input id="bf-email" name="email" type="email" required autoComplete="email" defaultValue={prefill?.email} /></div>
        <div className="field"><label htmlFor="bf-company">Company</label><input id="bf-company" name="company" autoComplete="organization" defaultValue={prefill?.company} /></div>
        <div className="field"><label htmlFor="bf-website">Company website</label><input id="bf-website" name="website" type="text" inputMode="url" autoComplete="url" placeholder="example.com" defaultValue={prefill?.website} /></div>
        <div className="field"><label htmlFor="bf-role">Your role</label><input id="bf-role" name="role" autoComplete="organization-title" defaultValue={prefill?.role} /></div>
        <div className="field"><label htmlFor="bf-times">Preferred days / times (with time zone)</label><input id="bf-times" name="times" placeholder="e.g. Tue or Wed afternoon, GMT" /></div>
      </div>
      <div className="field"><label htmlFor="bf-problem">What&rsquo;s the one thing that isn&rsquo;t working?</label><textarea id="bf-problem" name="problem" rows={3} /></div>
      <input type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--ink-2)' }}>
        <input type="checkbox" name="consent" style={{ marginTop: 4 }} /> Send me occasional GTM insights (practical frameworks and research). Unsubscribe anytime.
      </label>
      <div className="cta-row">
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Booking…' : <>Request my Growth Strategy Call <span className="arrow">→</span></>}</button>
        <span className="micro">I&rsquo;ll confirm a time within 1 business day.</span>
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <p className="micro">By submitting you agree to the <a href="/privacy">privacy policy</a>. Your details are used only to arrange and prepare for your call.</p>
    </form>
  );
}
