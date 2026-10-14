// Free GTM health check — questions, weights, insights and plan rules.
// Edit this file to change any question, answer, insight or weight.

export type SystemCode = 'ICP' | 'POS' | 'DEM' | 'CON' | 'SEN' | 'OPS';

export const SYSTEMS: Record<SystemCode, { name: string; color: string; elements: string[]; cause: string; success: string }> = {
  ICP: { name: 'Audience & ICP', color: 'var(--info)', elements: ['Au', 'Ci'],
    cause: "Because your ideal customer isn't sharply defined → targeting is broad → leads are mixed quality → sales spends time on the wrong accounts → pipeline looks busy but converts poorly.",
    success: 'Lead-to-opportunity conversion up, ad waste down, and sales and marketing agree on what "qualified" means.' },
  POS: { name: 'Positioning & Message', color: 'var(--accent)', elements: ['Po', 'Bv', 'Ci'],
    cause: "Because your differentiation isn't clear → buyers compare you on features and price → deals need more demos and discounts → cycles lengthen and win rates fall.",
    success: 'Shorter sales cycles, higher win rates against named competitors, and buyers repeating your message back to you.' },
  DEM: { name: 'Demand Generation', color: 'var(--info)', elements: ['Cs', 'Wo'],
    cause: 'Because demand depends on a few channels or people → pipeline is unpredictable → growth stalls whenever those channels plateau.',
    success: 'More pipeline sources, predictable monthly pipeline, and organic and AI-search visibility rising.' },
  CON: { name: 'Conversion', color: 'var(--warn)', elements: ['Wo', 'Pa'],
    cause: "Because the path from visit to conversation leaks → good traffic doesn't become meetings → you pay for attention you never convert.",
    success: 'Visit-to-meeting rate up, and landing pages converting above benchmark.' },
  SEN: { name: 'Sales Enablement', color: 'var(--critical)', elements: ['Ci', 'Po'],
    cause: 'Because sales lacks current intelligence and a sharp story → reps improvise → buyers hear different messages → competitors win the comparison.',
    success: 'Reps using battle cards, and win rates rising in competitive deals.' },
  OPS: { name: 'Data, Ops & AI', color: 'var(--slate)', elements: ['Pa', 'Ge', 'Ag'],
    cause: "Because data and work live in disconnected tools and manual steps → reporting is slow, decisions arrive late, and your team's best hours go to robot work.",
    success: 'Hours saved every week, reports that run themselves, and one source of truth.' },
};

export const TIE_ORDER: SystemCode[] = ['SEN', 'POS', 'ICP', 'CON', 'DEM', 'OPS'];

type W = Partial<Record<SystemCode, number>>;
export type Option = { id: string; label: string; w: W; insight: string; flag?: string; goal?: string };
export type Question = { id: string; text: string; options: Option[] };

export const INTAKE = {
  roles: ['Founder / CEO', 'Marketing leader', 'Product marketing / GTM', 'Sales / Revenue leader', 'Other'],
  stages: ['Pre-seed / Seed', 'Series A', 'Series B+', 'Established / enterprise', 'Bootstrapped / SMB'],
  industries: ['B2B SaaS', 'Fintech / banking-tech', 'Other B2B', 'Not B2B'],
  teamSizes: ['Just me / none', '2–5', '6–15', '16+'],
};

export const QUESTIONS: Question[] = [
  { id: 'q1', text: 'When you look at your pipeline right now, what\'s the honest picture?', options: [
    { id: 'A', label: "We're missing targets and don't fully know why", w: { DEM: 2, CON: 1, OPS: 1 }, insight: "That usually means the problem isn't one channel. It's how the system connects. Good news: that's diagnosable." },
    { id: 'B', label: 'Plenty of leads, too few become real opportunities', w: { ICP: 2, CON: 2 }, insight: 'Volume without conversion is almost always an ICP or qualification problem, not a volume problem.' },
    { id: 'C', label: 'Opportunities come in, but deals stall or we lose them', w: { POS: 2, SEN: 3 }, insight: "Stalled deals usually mean buyers can't see a clear reason to choose you. That's a positioning and enablement gap." },
    { id: 'D', label: 'Pipeline is healthy. We want to scale it efficiently', w: { OPS: 2, DEM: 1 }, insight: 'Then your lever is efficiency: systems, automation, and doubling down on what already works.' },
  ] },
  { id: 'q2', text: 'If I asked five people on your team who your ideal customer is, how many different answers would I get?', options: [
    { id: 'A', label: 'One clear answer, backed by data', w: {}, insight: "Rare and valuable. We'll make sure your targeting actually uses it." },
    { id: 'B', label: 'Similar answers, based on gut feel', w: { ICP: 2 }, insight: 'Gut feel is a starting point. Your CRM usually holds the evidence to prove or correct it.' },
    { id: 'C', label: 'Five different answers', w: { ICP: 3, POS: 1 }, insight: "When the team can't agree on the buyer, the message drifts, and so does the pipeline." },
    { id: 'D', label: "Honestly, we sell to anyone who'll buy", w: { ICP: 3, DEM: 1 }, insight: 'Selling to everyone makes marketing expensive. Focus is the cheapest growth lever there is.' },
  ] },
  { id: 'q3', text: 'A prospect has your website and two competitors open in three browser tabs. What happens?', options: [
    { id: 'A', label: 'They instantly see why we\'re different', w: {}, insight: "Strong. We'll check the proof behind it holds up." },
    { id: 'B', label: 'They get it, but only after a demo', w: { POS: 2, CON: 1 }, insight: "If it takes a demo to understand you, you're losing the buyers who never book one." },
    { id: 'C', label: 'Honestly, we probably look similar', w: { POS: 3 }, insight: "Your competitors aren't necessarily better. They may just be positioned better." },
    { id: 'D', label: "I'm not sure who our real competitors are", w: { POS: 2, SEN: 2 }, insight: "Buyers always compare. If you don't know against whom, you can't control the comparison." },
  ] },
  { id: 'q4', text: 'What does your marketing produce most of right now?', options: [
    { id: 'A', label: 'Traffic and impressions', w: { DEM: 1, CON: 2 }, insight: "Traffic isn't the goal. Pipeline is. There's a leak between the click and the conversation." },
    { id: 'B', label: "Leads that sales doesn't love", w: { ICP: 2, CON: 2 }, insight: "Sales and marketing disagreeing on lead quality is a definition problem before it's a campaign problem." },
    { id: 'C', label: "Not much. We rely on referrals and the founder's network", w: { DEM: 3 }, insight: "Referrals prove the product works. Now you need a repeatable engine that doesn't depend on who you know." },
    { id: 'D', label: 'Measurable pipeline we can trace', w: {}, insight: "Great foundation. We'll look at efficiency and scale." },
  ] },
  { id: 'q5', text: 'Can you trace a closed deal back to the marketing that influenced it?', options: [
    { id: 'A', label: 'Yes, clearly', w: {}, insight: "Excellent. Most companies can't." },
    { id: 'B', label: 'Partly, with a lot of spreadsheet work', w: { OPS: 2 }, insight: 'If reporting takes days, decisions arrive late. This is very automatable.' },
    { id: 'C', label: "No, our tools don't talk to each other", w: { OPS: 3, DEM: 1 }, insight: 'Disconnected tools hide both the leaks and the wins. One funnel view changes everything.' },
    { id: 'D', label: "We don't really track it", w: { OPS: 3, CON: 1 }, insight: "Without measurement, budget follows opinions. Let's give it evidence instead." },
  ] },
  { id: 'q6', text: 'When a sales rep hears "why not your competitor?", what do they use?', options: [
    { id: 'A', label: 'Up-to-date battle cards and talk tracks', w: {}, insight: "Strong enablement. We'll keep it fresh automatically." },
    { id: 'B', label: 'Old slides and their own experience', w: { SEN: 2 }, insight: 'Intel goes stale in a quarter. Reps need it current, short and in the flow of the call.' },
    { id: 'C', label: 'They improvise', w: { SEN: 3, POS: 1 }, insight: 'Improvised answers mean every rep tells a different story, and buyers notice.' },
    { id: 'D', label: 'No sales team yet. Sales is founder-led', w: { SEN: 1, POS: 1 }, insight: "Founder-led sales works until it has to scale. Capturing the founder's story now saves months later." },
  ] },
  { id: 'q7', text: "How much of your team's week goes to repetitive work: reports, research, content ops, data entry?", options: [
    { id: 'A', label: "Very little. We're well automated", w: {}, insight: 'Then AI can move up the value chain to research and insight.' },
    { id: 'B', label: 'A few hours per person', w: { OPS: 1 }, insight: "A few hours per person adds up to a part-time hire you're already paying for." },
    { id: 'C', label: 'A day or more per person', w: { OPS: 3 }, insight: "Your marketing team shouldn't spend 20 hours on work an AI agent can do in 20 minutes." },
    { id: 'D', label: "We don't even have the people to do it", w: { OPS: 2, DEM: 1 }, insight: "Then automation isn't a nice-to-have. It's how a small team performs like a big one." },
  ] },
  { id: 'q8', text: 'How is AI used in your marketing today?', options: [
    { id: 'A', label: 'Built into workflows, with agents and automation', w: {}, insight: "You're ahead. We'll look at what's next." },
    { id: 'B', label: 'People use ChatGPT or Claude for drafts', w: { OPS: 2 }, insight: "That's AI as a typewriter. The bigger win is AI as a team member that does whole jobs." },
    { id: 'C', label: 'We experimented. Nothing stuck', w: { OPS: 2 }, insight: 'Usually because AI was added to the old process instead of redesigning the process.' },
    { id: 'D', label: 'Not yet, or not allowed', w: { OPS: 1 }, insight: 'Fair, especially in regulated industries. There are safe, approved ways to start.' },
  ] },
  { id: 'q9', text: 'Honestly, what is your website doing for you?', options: [
    { id: 'A', label: 'Converting visitors into meetings well', w: {}, insight: "Great. We'll protect it and grow traffic into it." },
    { id: 'B', label: 'Looks fine, converts poorly', w: { CON: 3 }, insight: "A good-looking site that doesn't convert is usually saying 'what we do' instead of 'what you need'." },
    { id: 'C', label: "It's outdated. We'd rather not send it", w: { CON: 3, POS: 1 }, flag: 'website_rebuild', insight: "Your website is often your first sales call. Let's make sure it's a good one." },
    { id: 'D', label: 'It gets little traffic from search or AI', w: { DEM: 2, CON: 1 }, insight: "If buyers can't find you in Google or ChatGPT answers, you're invisible at the moment of research." },
  ] },
  { id: 'q10', text: 'What matters most in the next six months?', options: [
    { id: 'A', label: 'Launching a new product or entering a new market', w: { POS: 1, ICP: 1 }, goal: 'launch', insight: 'Launches are where positioning matters most. Let\'s get it right first time.' },
    { id: 'B', label: 'Hitting pipeline targets', w: { DEM: 1, CON: 1 }, goal: 'pipeline', insight: 'Then everything we prescribe will be measured in pipeline.' },
    { id: 'C', label: 'Doing more with the same team', w: { OPS: 1 }, goal: 'efficiency', insight: "Then we'll prioritise automation and focus." },
    { id: 'D', label: 'Beating a specific competitor', w: { SEN: 1, POS: 1 }, goal: 'compete', insight: 'Then we start with intelligence: know them better than they know themselves.' },
  ] },
];

// Layered follow-ups: asked when a system scores >= 60 after the core questions (max 2).
export const FOLLOW_UPS: Record<SystemCode, { text: string; options: { label: string; elements: string[] }[] }> = {
  ICP: { text: 'What do you know about your best customers today?', options: [
    { label: 'Lots of data, never analysed', elements: ['Au'] }, { label: 'Anecdotes only', elements: ['Au'] }, { label: "We're too early to know", elements: ['Dx'] } ] },
  POS: { text: 'Where does your story break first?', options: [
    { label: "We can't explain the difference", elements: ['Po'] }, { label: 'Each person says it differently', elements: ['Bv'] }, { label: 'Competitors claim the same thing', elements: ['Ci', 'Po'] } ] },
  DEM: { text: 'Where should demand come from next?', options: [
    { label: 'Search & AI answers', elements: ['Wo', 'Cs'] }, { label: 'Thought leadership / LinkedIn', elements: ['Cs'] }, { label: 'Paid campaigns', elements: ['Pa', 'Wo'] } ] },
  CON: { text: 'Where do buyers drop off?', options: [
    { label: 'On the website', elements: ['Wo'] }, { label: 'After the form (slow follow-up)', elements: ['Pa', 'Ge'] }, { label: "We don't know", elements: ['Pa'] } ] },
  SEN: { text: 'What would help sales most this quarter?', options: [
    { label: 'Competitor battle cards', elements: ['Ci'] }, { label: 'A clearer pitch', elements: ['Po'] }, { label: 'Account research before calls', elements: ['Ag'] } ] },
  OPS: { text: 'What would you automate first?', options: [
    { label: 'Reporting', elements: ['Pa', 'Ge'] }, { label: 'Research', elements: ['Ag'] }, { label: 'Content ops & newsletters', elements: ['Ag', 'Ge'] }, { label: 'Lead handling', elements: ['Ge'] } ] },
};

export const FLAGSHIPS: { name: string; systems: SystemCode[] }[] = [
  { name: 'GTM Clarity Sprint', systems: ['ICP', 'POS', 'SEN'] },
  { name: 'Pipeline Growth System', systems: ['DEM', 'CON'] },
  { name: 'AI Marketing Transformation', systems: ['OPS'] },
];

export const MATERIALS: Record<string, string> = {
  always: 'Read-only access to your website analytics, your current pitch deck or one-pager, and a list of your top competitors',
  Dx: 'CRM export of closed-won, closed-lost and churned deals', Au: 'CRM export of won, lost and churned deals, plus intros to 5 customers',
  Ci: 'Your win/loss notes and the competitors sales meets most', Po: 'Existing messaging documents and any sales call recordings',
  Bv: 'Brand assets and examples of content you love and hate', Cs: 'CMS access, Search Console and past content performance',
  Wo: 'CMS access, Search Console and heatmap tools (if any)', Pa: 'GA4, ad platform and CRM reporting access',
  Ge: 'A list of repetitive workflows and tool logins (shared via a password manager)', Ag: 'Examples of the job to automate and sample data',
  Wb: 'Brand assets, a sitemap wish-list and example websites you like',
};

export const COMMS = [
  'A shared Slack or WhatsApp channel, with replies within 1 business day',
  'A weekly 45-minute working session',
  'Async video updates for anything visual',
  'A live project tracker you can check anytime',
  'A monthly steering review against success metrics',
];

export const TIMELINE = [
  { week: 'Week 0', phase: 'Kick-off & access', see: 'Shared workspace, project plan, NDA signed' },
  { week: 'Weeks 1–2', phase: 'Research & discovery', see: 'Interim findings readout' },
  { week: 'Weeks 3–4', phase: 'Findings & plan design', see: 'Draft strategy and designs for review' },
  { week: 'Weeks 5–8', phase: 'Build & implement', see: 'Assets, workflows and dashboards live' },
  { week: 'Week 9+', phase: 'Measure & iterate', see: 'Monthly performance review' },
];
