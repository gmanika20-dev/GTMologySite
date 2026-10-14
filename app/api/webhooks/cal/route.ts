// Cal.com webhook (BOOKING_CREATED) → store booking + send branded thank-you + alert Manika.
// Configure in Cal.com: Settings → Developer → Webhooks → URL https://www.gtmologyai.com/api/webhooks/cal, secret = CAL_WEBHOOK_SECRET.
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { insert, upsertLead } from '@/lib/store';
import { sendBookingThankYou, sendOwnerAlert } from '@/lib/email';

export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  const sig = req.headers.get('x-cal-signature-256') ?? '';
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 401 });
  }
  const evt = JSON.parse(raw) as { triggerEvent: string; payload: any };
  if (evt.triggerEvent !== 'BOOKING_CREATED') return NextResponse.json({ ok: true, ignored: evt.triggerEvent });

  const p = evt.payload ?? {};
  const att = p.attendees?.[0] ?? {};
  const meta = p.metadata ?? {};
  try {
    const leadId = await upsertLead({ email: att.email, name: att.name });
    await insert('bookings', { lead_id: leadId, session_id: meta.session ?? null, status: 'booked', cal_booking_uid: p.uid, starts_at: p.startTime, meeting_url: p.metadata?.videoCallUrl ?? p.location ?? null, source: 'cal.com' });
    const when = p.startTime ? new Date(p.startTime).toUTCString() : undefined;
    await Promise.all([
      sendBookingThankYou({ to: att.email, name: String(att.name ?? '').split(' ')[0] || 'there', when }),
      sendOwnerAlert(`🧪 Booked: ${att.name} · ${when}`, { name: att.name, email: att.email, when, notes: p.description, session: meta.session }),
    ]);
  } catch (e) { console.error('[webhooks/cal]', e); }
  return NextResponse.json({ ok: true });
}
