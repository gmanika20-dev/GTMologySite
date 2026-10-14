// Transactional email via Resend (logs to console when RESEND_API_KEY is not set).
import 'server-only';
import { Resend } from 'resend';
import { SITE } from './site';

const FROM = process.env.EMAIL_FROM ?? 'Manika at GTMology <hello@gtmologyai.com>';
const OWNER = process.env.OWNER_EMAIL ?? 'hello@gtmologyai.com';
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.info(`[email:dry-run] to=${to} subject="${subject}"`); return { dryRun: true }; }
  const r = await new Resend(key).emails.send({ from: FROM, to, subject, html, replyTo: OWNER });
  if (r.error) throw new Error(r.error.message);
  return { id: r.data?.id };
}

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#0f1e3d">
<div style="max-width:600px;margin:0 auto;padding:32px 24px">
<div style="font-size:18px;font-weight:bold;margin-bottom:24px">GTMology <span style="color:#7a1f2b">●</span></div>
${body}
<p style="margin-top:32px;color:#6b7383;font-size:13px">Manika Gupta · GTMology: AI-enabled GTM for B2B SaaS &amp; fintech<br><a href="${SITE.url}" style="color:#1f3f74">gtmologyai.com</a> · <a href="${SITE.linkedin}" style="color:#1f3f74">LinkedIn</a></p>
</div></body></html>`;

export type Diagnosis = { primary?: string; scores?: Record<string, number>; formula?: { name: string; elements: string[]; model: string } };

const diagHtml = (d?: Diagnosis) => !d?.scores ? '' : `
<h3 style="color:#7a1f2b;font-size:13px;letter-spacing:2px;text-transform:uppercase">Your GTM health check</h3>
<p>Primary issue: <b>${esc(d.primary)}</b></p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${Object.entries(d.scores).map(([k, v]) => `<tr><td style="padding:6px 0;border-bottom:1px solid #e2e5eb">${esc(k)}</td><td style="text-align:right;border-bottom:1px solid #e2e5eb">${v}/100</td></tr>`).join('')}</table>
${d.formula ? `<p style="margin-top:16px">Your plan: <b>${esc(d.formula.name)}</b> (${esc(d.formula.elements.join(' + '))}), ${esc(d.formula.model)}</p>` : ''}`;

export async function sendBookingThankYou(p: { to: string; name: string; when?: string; diagnosis?: Diagnosis }) {
  return send(p.to, `You're booked, ${p.name}. Here's what happens next`, shell(`
<p>Hi ${esc(p.name)},</p>
<p>Thank you for booking your GTM Diagnostic. I'm looking forward to it.</p>
${p.when ? `<p><b>Your session:</b> ${esc(p.when)} · 30 minutes</p>` : `<p>I'll confirm a time with you within 1 business day.</p>`}
${diagHtml(p.diagnosis)}
<h3 style="color:#7a1f2b;font-size:13px;letter-spacing:2px;text-transform:uppercase">Before we meet</h3>
<ul style="line-height:1.7"><li>Your current pitch deck or one-pager</li><li>Your website and your top 3 competitors</li><li>Last quarter's rough funnel numbers: traffic → leads → opportunities</li><li>Your 5 best customers, and why they're the best</li></ul>
<p>If you chose a plan in the GTM health check, your contract draft was available to download there. There's no need to sign before we talk. We'll review it together.</p>
<p>Speak soon,<br>Manika</p>`));
}

export async function sendDiagnosisCopy(p: { to: string; name: string; diagnosis: Diagnosis }) {
  return send(p.to, `Your GTM diagnosis, ${p.name}`, shell(`
<p>Hi ${esc(p.name)},</p><p>Here are your GTM health check results, as promised. Feel free to share them with your team.</p>
${diagHtml(p.diagnosis)}
<p style="margin-top:24px"><a href="${SITE.url}/book" style="background:#7a1f2b;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Book a GTM Diagnostic →</a></p>
<p>When you're ready to talk, I'll already have your results.<br>— Manika</p>`));
}

export async function sendOwnerAlert(subject: string, data: Record<string, unknown>) {
  const rows = Object.entries(data).map(([k, v]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #e2e5eb;color:#6b7383;vertical-align:top">${esc(k)}</td><td style="padding:6px 8px;border-bottom:1px solid #e2e5eb">${esc(typeof v === 'object' ? JSON.stringify(v) : v)}</td></tr>`).join('');
  return send(OWNER, subject, shell(`<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>`));
}
