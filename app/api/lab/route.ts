import { NextResponse } from 'next/server';
import { z } from 'zod';
import { insert, upsertLead } from '@/lib/store';
import { sendDiagnosisCopy, sendOwnerAlert } from '@/lib/email';
import { clientIp, rateLimited } from '@/lib/guard';

const Body = z.object({
  action: z.enum(['complete', 'email']),
  sessionId: z.string().uuid().optional(),
  intake: z.object({
    name: z.string().max(80).default(''), company: z.string().max(120).default(''), website: z.string().max(200).default(''),
    role: z.string().max(60).default(''), stage: z.string().max(60).default(''), industry: z.string().max(60).default(''), team: z.string().max(30).default(''),
  }),
  email: z.string().email().max(200).optional(),
  consent: z.boolean().optional(),
  answers: z.record(z.string(), z.string()),
  followUps: z.record(z.string(), z.string()).optional(),
  scores: z.record(z.string(), z.number()),
  primary: z.string(),
  formula: z.object({ tier: z.string(), name: z.string(), elements: z.array(z.string()), model: z.string() }).optional(),
  source: z.string().max(120).optional(),
  hp: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const b = parsed.data;
  if (b.hp) return NextResponse.json({ ok: true }); // bot

  try {
    let leadId: string | undefined;
    if (b.email) leadId = await upsertLead({ email: b.email, name: b.intake.name, company: b.intake.company, website: b.intake.website, role: b.intake.role, company_stage: b.intake.stage, industry: b.intake.industry, consent_marketing: !!b.consent });
    const id = await insert('lab_sessions', {
      id: b.sessionId ?? crypto.randomUUID(), lead_id: leadId ?? null, status: b.action === 'email' ? 'emailed' : 'complete',
      intake: b.intake, answers: b.answers, follow_ups: b.followUps ?? {}, scores: b.scores, primary_issue: b.primary,
      formula: b.formula ?? null, entry_source: b.source ?? null,
    });
    if (b.action === 'email' && b.email) {
      await sendDiagnosisCopy({ to: b.email, name: b.intake.name || 'there', diagnosis: { primary: b.primary, scores: b.scores, formula: b.formula } });
      await sendOwnerAlert(`🧪 Lab lead (not booked yet): ${b.intake.company || b.email} · ${b.primary}`, { ...b.intake, email: b.email, primary: b.primary, scores: b.scores, formula: b.formula, source: b.source });
    }
    return NextResponse.json({ ok: true, sessionId: id });
  } catch (e) {
    console.error('[api/lab]', e);
    return NextResponse.json({ error: 'Could not save right now' }, { status: 500 });
  }
}
