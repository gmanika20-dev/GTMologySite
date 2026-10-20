// Machine-readable service catalog for AI agents (AAO). No prices by design.
import { getServices } from '@/lib/content';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const services = getServices().map((s) => {
    const g = Object.fromEntries(s.glance.map((x) => [x.label, x.value]));
    const deliverables = s.sections.find((x) => x.title === 'What you get')?.md.split('\n')[0].split(' · ').map((d) => d.trim()) ?? [];
    return {
      id: s.slug, symbol: s.element.symbol, name: s.element.name, group: s.element.group, program: s.formula,
      question: s.question, summary: s.inShort,
      who_it_is_for: g["Who it's for"], outcome: g['Outcome'], typical_timeline: g['Typical timeline'],
      deliverables, engagement_models: ['one-time project', 'monthly retainer', 'annual contract'],
      pricing: 'Scoped per engagement; tailored proposal after a Growth Strategy Call (not published).',
      url: `${SITE.url}/services/${s.slug}`, book_url: `${SITE.url}/book?service=${s.slug}`,
    };
  });
  return Response.json({
    provider: { name: SITE.name, url: SITE.url, founder: 'Manika Gupta', email: SITE.email, location: SITE.location, description: SITE.description },
    actions: { book_diagnostic: `${SITE.url}/book`, free_diagnostic: `${SITE.url}/lab`, free_diagnostic_text_mode: `${SITE.url}/lab?mode=text` },
    services,
  }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
