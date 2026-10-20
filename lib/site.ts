// Site-wide facts. Keep the wording identical to LinkedIn and directory profiles (GEO entity consistency).
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gtmologyai.com').replace(/\/$/, ''),
  name: 'Dominize Consultancy',
  shortName: 'Dominize',
  tagline: 'Go-to-market consulting for B2B SaaS & fintech',
  description:
    'Dominize Consultancy is an AI-enabled go-to-market consulting firm founded by Manika Gupta. It helps B2B SaaS and fintech companies define their ideal customer, sharpen positioning, build demand and automate marketing operations with AI, connected as one GTM system from market to pipeline.',
  email: 'hello@gtmologyai.com',
  linkedin: 'https://linkedin.com/in/manika-gupta-672790231',
  ciHub: 'https://gotomarketaiinsight.com',
  location: 'Gurugram, India',
  calLink: process.env.NEXT_PUBLIC_CAL_LINK || 'manika-gupta-gtmology', // e.g. "manika-gupta/gtm-diagnostic"
};

// Track record, stated without figures (by choice: no numbers are quoted on the site).
export const KNOWN_FOR = [
  { title: 'Global launches', text: 'Positioning product launches for financial institutions across the US, EMEA and APAC.' },
  { title: 'Budget to pipeline', text: 'Stewarding marketing budgets against pipeline and revenue, not activity.' },
  { title: 'Search to revenue', text: 'Turning buyer search demand into sales-qualified opportunities.' },
  { title: 'Competitive intelligence', text: 'Researching competitors and turning findings into battle cards, ICPs and sales plays, now with AI products I design to keep it current.' },
];

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/lab', label: 'Free GTM Check' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export const GROUPS = ['Strategy', 'Marketing', 'Sales', 'Digital & AI'] as const;

export const FORMULAS = [
  { name: 'GTM Clarity Sprint', line: 'Know exactly who to sell to, what to say and how to win.', symbols: ['Dx', 'Ci', 'Au', 'Po', 'Bv'] },
  { name: 'Pipeline Growth System', line: 'Turn marketing spend into qualified, measurable pipeline.', symbols: ['Dg', 'Cs', 'Wo', 'Pa', 'Lr'] },
  { name: 'Launch & Sales Readiness', line: 'Launch new products with one story, and give sales what it needs to win.', symbols: ['Pl', 'Se', 'Ci'] },
  { name: 'AI Marketing Transformation', line: 'Stop using AI just to write content. Use it to redesign your marketing operation.', symbols: ['Ge', 'Ag'] },
];

// The offer, organised into practice areas. Each capability links to a service page (by slug);
// `name` overrides the service name where the capability is a part of a broader service.
export type Practice = {
  id: string; group: (typeof GROUPS)[number]; icon: string; title: string; promise: string; intro: string;
  capabilities: { slug: string; name?: string; line: string }[];
};

export const PRACTICES: Practice[] = [
  {
    id: 'strategy', group: 'Strategy', icon: 'compass',
    title: 'Customer, Product & Market Strategy',
    promise: 'Know exactly who to win, what to offer them and why they should choose you.',
    intro: 'Growth starts with the customer. We find your most valuable segments, sharpen the value you offer them and plan how you take products to market, based on evidence, not assumptions.',
    capabilities: [
      { slug: 'ideal-customer-profile', line: 'Find the segments and buyers most likely to buy, succeed and stay, and agree on who not to target.' },
      { slug: 'competitor-analysis', line: 'Understand how competitors sell and win, and turn it into battle cards and sales plays.' },
      { slug: 'brand-positioning', line: 'Define why customers should choose you, and own a position competitors can’t easily copy.' },
      { slug: 'product-launch-strategy', line: 'Plan launches and new-market entries end to end: audience, message, offer, channels and sales readiness.' },
      { slug: 'brand-voice', line: 'Say it the same clear way everywhere: website, sales decks, ads and content.' },
    ],
  },
  {
    id: 'marketing', group: 'Marketing', icon: 'megaphone',
    title: 'Marketing Effectiveness & Demand Generation',
    promise: 'Turn marketing spend into qualified pipeline you can measure.',
    intro: 'We plan where your marketing budget goes, build campaigns around your buyers and make your website and content work as a pipeline engine. Then we measure what is working and move spend to it.',
    capabilities: [
      { slug: 'demand-generation', line: 'Run paid search, paid social, SEO and email as one plan aimed at pipeline, not clicks.' },
      { slug: 'content-strategy', line: 'Plan content that buyers search for, read and share with their buying team.' },
      { slug: 'website-optimization', line: 'Get found on Google and in AI answers, and turn more visits into demo requests.' },
      { slug: 'marketing-performance-analytics', line: 'See which channels and campaigns create pipeline, and allocate budget to what works.' },
    ],
  },
  {
    id: 'sales', group: 'Sales', icon: 'handshake',
    title: 'Sales Excellence',
    promise: 'Give sales the insight, tools and plays to win more of the right deals.',
    intro: 'We connect marketing and sales around the same customer: shared definitions, a clear funnel and the enablement that helps your team win new accounts and grow existing ones.',
    capabilities: [
      { slug: 'sales-enablement', line: 'Sales plays, battle cards, pitch narratives and objection handling that reps actually use.' },
      { slug: 'customer-lifecycle-retention', name: 'Customer Lifecycle & Retention', line: 'Onboard, retain and expand customers with lifecycle journeys and cross-sell and upsell plays.' },
      { slug: 'gtm-engineering-automation', name: 'CRM & Funnel Design', line: 'Clear lifecycle stages, lead scoring and handoffs, so no good lead slips through.' },
    ],
  },
  {
    id: 'digital', group: 'Digital & AI', icon: 'bolt',
    title: 'Digital Growth, Automation & AI',
    promise: 'Scale growth with automation, AI and a website that sells.',
    intro: 'We set up the systems behind growth: connected CRM and marketing tools, AI agents that take manual work off your team, and a fast, search-ready website. Built for your team to run.',
    capabilities: [
      { slug: 'gtm-engineering-automation', line: 'Connect your CRM, marketing tools and data so leads are routed, scored and nurtured automatically.' },
      { slug: 'ai-marketing-agents', line: 'Custom AI agents for research, content audits, reporting and sales prep, with your team in control.' },
      { slug: 'website-design-development', line: 'A strategy-led website, built fast and search-ready, that you can update yourself.' },
    ],
  },
];

export const APPROACH = [
  { title: 'Diagnose before we prescribe', text: 'Every engagement starts with evidence: your data, your customers, your competitors and your sales conversations.', icon: 'search' },
  { title: 'Advise and implement', text: 'We don’t stop at a slide deck. We build the assets, campaigns and systems alongside your team.', icon: 'layers' },
  { title: 'Leave your team stronger', text: 'Playbooks, templates and training, so your team can keep running it without us.', icon: 'users' },
];
