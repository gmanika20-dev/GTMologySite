// Generates the pre-filled Consulting Services Agreement as a PDF (stateless — built from the request).
// Template text mirrors "Step 2 / _Supporting / 06-Contract-Template-DRAFT.md". Have it legally reviewed before use.
import { z } from 'zod';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { getServiceBySymbol } from '@/lib/content';
import { MATERIALS } from '@/content/lab';
import { clientIp, rateLimited } from '@/lib/guard';

const Body = z.object({
  name: z.string().max(80).default(''), company: z.string().max(120).default(''), role: z.string().max(60).default(''),
  email: z.string().max(200).optional().default(''),
  formula: z.object({ name: z.string().max(120), elements: z.array(z.string().max(4)).max(12), model: z.string().max(40), length: z.string().max(60).optional() }),
});

const clean = (s: string) => s.replace(/[^\x20-\x7E\n]/g, (c) => ({ '→': '->', '–': '-', '—': '-', '’': "'", '‘': "'", '“': '"', '”': '"', '·': '-', '×': 'x' }[c] ?? ''));

export async function POST(req: Request) {
  if (rateLimited(clientIp(req), 10)) return new Response('Too many requests', { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response('Invalid request', { status: 400 });
  const b = parsed.data;

  const doc = await PDFDocument.create();
  doc.setTitle('GTMology Consulting Services Agreement'); doc.setAuthor('GTMology');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595, H = 842, M = 56, LH = 14;
  let page: PDFPage = doc.addPage([W, H]); let y = H - M;

  const newPage = () => { page = doc.addPage([W, H]); y = H - M; };
  const wrap = (text: string, f: PDFFont, size: number, width: number) => {
    const out: string[] = [];
    for (const para of clean(text).split('\n')) {
      let line = '';
      for (const word of para.split(' ')) {
        const t = line ? `${line} ${word}` : word;
        if (f.widthOfTextAtSize(t, size) > width) { out.push(line); line = word; } else line = t;
      }
      out.push(line);
    }
    return out;
  };
  const text = (t: string, o: { f?: PDFFont; size?: number; color?: [number, number, number]; gap?: number; indent?: number } = {}) => {
    const f = o.f ?? font, size = o.size ?? 10;
    for (const l of wrap(t, f, size, W - M * 2 - (o.indent ?? 0))) {
      if (y < M + LH) newPage();
      page.drawText(l, { x: M + (o.indent ?? 0), y, size, font: f, color: rgb(...(o.color ?? [0.06, 0.12, 0.24])) });
      y -= size + 4;
    }
    y -= o.gap ?? 6;
  };
  const h = (t: string) => { y -= 4; text(t, { f: bold, size: 11, gap: 4 }); };

  const today = new Date().toISOString().slice(0, 10);
  const contractId = `GTM-${today.replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const services = b.formula.elements.map(getServiceBySymbol).filter(Boolean);

  page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: rgb(0.478, 0.122, 0.169) });
  text('GTMology', { f: bold, size: 18, gap: 2 });
  text('CONSULTING SERVICES AGREEMENT - DRAFT FOR REVIEW', { f: bold, size: 9, color: [0.4, 0.42, 0.45] });
  text(`Agreement No. ${contractId} - Date: ${today}`, { size: 9, color: [0.4, 0.42, 0.45], gap: 12 });
  text(`Between: Manika Gupta, trading as GTMology ("Consultant"), New Delhi, India - hello@gtmologyai.com`);
  text(`And: ${b.company || '[Client company]'} ("Client"), represented by ${b.name || '[Client name]'}${b.role ? `, ${b.role}` : ''}${b.email ? ` - ${b.email}` : ''}`, { gap: 10 });

  h('1. Services');
  text(`The Consultant will provide the services described in Schedule A, selected by the Client: Plan "${b.formula.name}"; engagement model: ${b.formula.model}${b.formula.length ? ` (typical length ${b.formula.length})` : ''}.`);
  h('2. Term');
  text('One-time: until the Schedule A deliverables are delivered. Monthly retainer: renews monthly after an agreed minimum term; either party may cancel with 30 days written notice. Annual: 12 months from the start date; renews only by written agreement.');
  h('3. Fees & payment');
  text('Fees, currency and payment schedule: [to be completed in the tailored proposal agreed after the GTM Diagnostic]. Fees exclude applicable taxes (GST for Indian clients). Invoices are payable within 15 days. Third-party costs (software, ad spend, API usage, hosting) are paid directly by the Client or pre-approved in writing.');
  h('4. Client responsibilities');
  text('The Client provides the materials and access in Schedule B on time, names one decision-maker available for about 2 hours a week, and gives feedback within 5 business days. Client-side delays extend timelines accordingly.');
  h('5. Communication');
  text('A shared channel (Slack or WhatsApp), a weekly working session, a live project tracker and a monthly review. Replies within 1 business day.');
  h('6. Changes');
  text('Work outside Schedule A requires a written change request with the agreed fee and timeline.');
  h('7. Intellectual property');
  text("On full payment the Client owns final deliverables created specifically for it. The Consultant retains pre-existing frameworks, templates, tools and know-how, and grants the Client a perpetual licence to use them within the deliverables. The Client is named publicly only with written consent.");
  h('8. Confidentiality & data');
  text("Each party keeps the other's confidential information private during the agreement and for 3 years after. Client data is used only to deliver the Services, accessed with least privilege, and returned or deleted on request, in line with applicable law (including India's DPDP Act 2023 and GDPR where relevant).");
  h('9. AI use');
  text('The Services are performed by the Consultant. AI tools (such as Claude) may support research, analysis and drafting under the Consultant\'s direction; all work is reviewed and owned by the Consultant. Confidential data is processed only through business-grade tools that do not train on customer data.');
  h('10. No guarantee of results');
  text('Services are performed with professional skill and care. Business outcomes (pipeline, revenue, rankings) depend on factors outside the Consultant\'s control and are not guaranteed.');
  h('11. Liability');
  text("Each party's total liability is limited to the fees paid in the 3 months before the claim. Neither party is liable for indirect or consequential losses.");
  h('12. Termination');
  text('Either party may terminate for material breach not remedied within 15 days of written notice. Fees for work performed up to termination are payable.');
  h('13. Governing law');
  text('The laws of India, with the courts at New Delhi, India having exclusive jurisdiction. Disputes are first escalated to a 30-day good-faith discussion between the signatories.', { gap: 14 });

  h('Schedule A - Scope & deliverables');
  for (const s of services) {
    if (!s) continue;
    text(`${s.element.symbol} - ${s.element.name}: ${s.question}`, { f: bold, size: 10, gap: 2 });
    const deliver = s.sections.find((x) => x.title === 'What you get')?.md.split('\n')[0] ?? '';
    const time = s.sections.find((x) => x.title === 'Timeline')?.md ?? '';
    if (deliver) text(`Deliverables: ${deliver}`, { indent: 10, gap: 2 });
    if (time) text(`Timeline: ${time}`, { indent: 10 });
  }
  h('Schedule B - Client materials & access');
  text(`- ${MATERIALS.always}`, { indent: 10, gap: 2 });
  for (const e of new Set(b.formula.elements)) if (MATERIALS[e]) text(`- ${MATERIALS[e]}`, { indent: 10, gap: 2 });
  y -= 18;
  if (y < 140) newPage();
  text('For GTMology', { f: bold, gap: 26 });
  text('Signature: ______________________     Name: Manika Gupta     Date: __________', { gap: 22 });
  text(`For ${b.company || 'the Client'}`, { f: bold, gap: 26 });
  text(`Signature: ______________________     Name: ${b.name || '__________'}     Date: __________`, { gap: 18 });
  text('Please sign and email to hello@gtmologyai.com. A countersigned copy will be returned within 2 business days.', { size: 9, color: [0.4, 0.42, 0.45] });

  const bytes = await doc.save();
  return new Response(new Uint8Array(bytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="GTMology-Agreement-${contractId}.pdf"`, 'Cache-Control': 'no-store' },
  });
}
