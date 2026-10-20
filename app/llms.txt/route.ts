import { getServices, getInsights } from '@/lib/content';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const s = getServices(), p = getInsights();
  const body = `# Dominize Consultancy

> ${SITE.description}

Key facts:
- Founder: Manika Gupta. Works across product marketing, GTM, demand generation, analytics and AI automation. Has positioned global product launches in banking technology and built an AI competitive-intelligence product.
- Audience: B2B SaaS and fintech founders, marketing leaders, and product marketing and GTM teams.
- Location: Gurugram, India. Works globally.
- Engagement models: one-time project, monthly retainer, annual contract. Pricing is scoped per engagement after a Growth Strategy Call and is not published.
- How to engage: take the free 4-minute GTM Scorecard at ${SITE.url}/lab, or book a free 30-minute Growth Strategy Call at ${SITE.url}/book (deep link: ${SITE.url}/book?service=<service-slug>).

## Services
${s.map((x) => `- [${x.element.name}](${SITE.url}/services/${x.slug}): ${x.question} ${x.inShort}`).join('\n')}

## Tools
- [Free GTM Scorecard](${SITE.url}/lab): free 4-minute interactive GTM assessment (accessible text mode: ${SITE.url}/lab?mode=text)
- [Services catalog (JSON)](${SITE.url}/services.json)
- [MG's Competitive Intelligence Hub](${SITE.ciHub}): AI competitive-intelligence report in minutes

## Insights
${p.map((x) => `- [${x.title}](${SITE.url}/insights/${x.slug}): ${x.inShort}`).join('\n')}

## Optional
- [Full text of all pages](${SITE.url}/llms-full.txt)
- [About Manika Gupta](${SITE.url}/about)
- Contact: ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
