import { QUESTIONS, SYSTEMS, TIE_ORDER, FLAGSHIPS, FOLLOW_UPS, type SystemCode } from '@/content/lab';

export type Answers = Record<string, string>; // questionId -> optionId
export type Band = 'Stable' | 'Needs attention' | 'Critical';
export type Tier = 'catalyst' | 'compound' | 'full';

const CODES = Object.keys(SYSTEMS) as SystemCode[];

// Max achievable raw score per system (best possible "worst" answer per question).
const MAX: Record<SystemCode, number> = CODES.reduce((acc, c) => {
  acc[c] = QUESTIONS.reduce((s, q) => s + Math.max(0, ...q.options.map((o) => o.w[c] ?? 0)), 0);
  return acc;
}, {} as Record<SystemCode, number>);

export function score(answers: Answers) {
  const raw = Object.fromEntries(CODES.map((c) => [c, 0])) as Record<SystemCode, number>;
  const flags: string[] = [];
  let goal: string | undefined;
  for (const q of QUESTIONS) {
    const o = q.options.find((x) => x.id === answers[q.id]);
    if (!o) continue;
    for (const [k, v] of Object.entries(o.w)) raw[k as SystemCode] += v ?? 0;
    if (o.flag) flags.push(o.flag);
    if (o.goal) goal = o.goal;
  }
  const scores = Object.fromEntries(CODES.map((c) => [c, Math.round((raw[c] / (MAX[c] || 1)) * 100)])) as Record<SystemCode, number>;
  const ranked = [...CODES].sort((a, b) => scores[b] - scores[a] || TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b));
  return { scores, ranked, primary: ranked[0], flags, goal };
}

export const band = (n: number): Band => (n >= 70 ? 'Critical' : n >= 40 ? 'Needs attention' : 'Stable');

export function followUpsFor(scores: Record<SystemCode, number>) {
  return (Object.keys(FOLLOW_UPS) as SystemCode[])
    .filter((c) => scores[c] >= 60)
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 2);
}

export function buildFormulas(r: ReturnType<typeof score>, extra: string[] = []) {
  const needs = r.ranked.filter((c) => r.scores[c] >= 40);
  const withWebsite = (els: string[]) => (r.flags.includes('website_rebuild') ? [...els.filter((e) => e !== 'Wo'), 'Wb'] : els);
  const uniq = (a: string[]) => [...new Set(a)];

  const primaryEls = SYSTEMS[r.primary].elements;
  const catalyst = uniq(['Dx', ...withWebsite([extra.find((e) => primaryEls.includes(e)) ?? primaryEls[0]])]);

  const top = (needs.length ? needs : [r.primary]).slice(0, 3);
  const compound = uniq([...extra, ...withWebsite(top.flatMap((c) => SYSTEMS[c].elements.slice(0, 2)))]).slice(0, 5);
  const flagship = FLAGSHIPS.map((f) => ({ f, n: top.filter((c) => f.systems.includes(c)).length }))
    .sort((a, b) => b.n - a.n)[0].f.name;

  const full = uniq(['Dx', ...extra, ...withWebsite((needs.length ? needs : [r.primary]).flatMap((c) => SYSTEMS[c].elements))]);

  return {
    catalyst: { tier: 'catalyst' as Tier, name: 'Quick win', tagline: 'Fix the biggest issue first', model: 'One-time project', length: '2–3 weeks', elements: catalyst },
    compound: { tier: 'compound' as Tier, name: `Recommended: ${flagship}`, tagline: 'Recommended', model: 'Monthly retainer', length: '6–10 weeks, then monthly', elements: compound },
    full: { tier: 'full' as Tier, name: 'Full transformation', tagline: 'Rebuild your GTM end to end', model: 'Annual contract', length: '6–12 months, embedded', elements: full },
  };
}
