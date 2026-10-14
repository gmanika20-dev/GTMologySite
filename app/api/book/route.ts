// Booking request (used until a Cal.com link is configured, and as a fallback).
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insert, upsertLead } from '@/lib/store';
import { sendBookingThankYou, sendOwnerAlert } from '@/lib/email';
import { clientIp, rateLimited, verifyTurnstile } from '@/lib/guard';

const Body = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(200),
  company: z.string().max(120).optional().default(''),
  website: z.string().max(200).optional().default(''),
  role: z.string().max(60).optional().default(''),
  problem: z.string().max(1500).optional().default(''),
  times: z.string().max(300).optional().default(''),
  service: z.string().max(80).optional(),
  sessionId: z.string().uuid().optional(),
  diagnosis: z.object({ primary: z.string().optional(), scores: z.record(z.string(), z.number()).optional(), formula: z.object({ name: z.string(), elements: z.array(z.string()), model: z.string() }).optional() }).optional(),
  consent: z.boolean().optional(),
  turnstile: z.string().optional(),
  hp: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip, 5)) return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check your name and work email.' }, { status: 400 });
  const b = parsed.data;
  if (b.hp) return NextResponse.json({ ok: true });
  if (!(await verifyTurnstile(b.turnstile, ip))) return NextResponse.json({ error: 'Verification failed. Please retry.' }, { status: 400 });

  try {
    const leadId = await upsertLead({ email: b.email, name: b.name, company: b.company, website: b.website, role: b.role, consent_marketing: !!b.consent });
    const id = await insert('bookings', { lead_id: leadId, session_id: b.sessionId ?? null, status: 'requested', service: b.service ?? null, problem: b.problem, preferred_times: b.times, source: 'site-form' });
    await Promise.all([
      sendBookingThankYou({ to: b.email, name: b.name.split(' ')[0], diagnosis: b.diagnosis }),
      sendOwnerAlert(`🧪 New GTM Diagnostic request: ${b.company || b.name}${b.diagnosis?.primary ? ` · ${b.diagnosis.primary}` : ''}`, { name: b.name, email: b.email, company: b.company, website: b.website, role: b.role, service: b.service, problem: b.problem, preferred_times: b.times, diagnosis: b.diagnosis, booking_id: id }),
    ]);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error('[api/book]', e);
    return NextResponse.json({ error: `Something went wrong. Please email hello@gtmologyai.com.` }, { status: 500 });
  }
}
