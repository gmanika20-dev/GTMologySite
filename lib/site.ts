// Site-wide facts. Keep the wording identical to LinkedIn and directory profiles (GEO entity consistency).
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gtmologyai.com').replace(/\/$/, ''),
  name: 'GTMology',
  tagline: 'Go-to-market consulting for B2B SaaS & fintech',
  description:
    'GTMology is an AI-enabled go-to-market consultancy founded by Manika Gupta. It helps B2B SaaS and fintech companies define their ideal customer, sharpen positioning, build demand and automate marketing operations with AI, connected as one GTM system from market to pipeline.',
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

export const GROUPS = ['Strategy & Intelligence', 'Growth', 'AI & Engineering', 'Build'] as const;

export const FORMULAS = [
  { name: 'GTM Clarity Sprint', line: 'Know exactly who to sell to, what to say and how to win.', symbols: ['Dx', 'Ci', 'Au', 'Po', 'Bv'] },
  { name: 'Pipeline Growth System', line: 'Turn marketing activity into measurable pipeline.', symbols: ['Cs', 'Wo', 'Pa'] },
  { name: 'AI Marketing Transformation', line: 'Stop using AI just to write content. Use it to redesign your marketing operation.', symbols: ['Ge', 'Ag'] },
];
