// Loads services and insights from /content markdown files.
// To edit site content, edit the .md files — no code changes needed.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.join(process.cwd(), 'content');

export type Faq = { q: string; a: string };
export type Section = { title: string; md: string; html: string };

export type Element = { no: string; symbol: string; name: string; group: string };

export type Service = {
  slug: string;
  element: Element;
  formula: string;
  question: string; // H1
  inShort: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  lastUpdated: string;
  glance: { label: string; value: string }[];
  sections: Section[]; // everything except glance / faqs / takeaways / pairs
  takeaways: string[];
  faqs: Faq[];
  pairs: string[]; // element symbols
};

export type Insight = {
  slug: string;
  title: string;
  type: string;
  topic: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  published: string;
  lastUpdated: string;
  readTime: string;
  inShort: string;
  html: string;
  faqs: Faq[];
  relatedServices: string[];
};

marked.setOptions({ gfm: true, breaks: true });
const md = (s: string) => marked.parse(s.trim(), { async: false }) as string;
const iso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''));
const stripMd = (s: string) => s.replace(/\*\*|\*|`/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim();

function splitSections(body: string) {
  const parts = body.split(/\n## /);
  const head = parts.shift() ?? '';
  return { head, sections: parts.map((p) => { const i = p.indexOf('\n'); return { title: p.slice(0, i).trim(), md: p.slice(i + 1).trim() }; }) };
}

function parseFaqs(src: string): Faq[] {
  return src.split(/\n?### /).filter(Boolean).map((block) => {
    const i = block.indexOf('\n');
    return { q: block.slice(0, i).trim(), a: stripMd(block.slice(i + 1).replace(/\n+/g, ' ')) };
  }).filter((f) => f.q && f.a);
}

function readDir(sub: string) {
  const dir = path.join(ROOT, sub);
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => fs.readFileSync(path.join(dir, f), 'utf8'));
}

let _services: Service[] | null = null;
export function getServices(): Service[] {
  if (_services) return _services;
  _services = readDir('services').map((raw) => {
    const { data, content } = matter(raw);
    const { head, sections } = splitSections(content.replace(/\n\*\*CTA:\*\*.*$/m, ''));
    const question = (head.match(/^# (.+)$/m)?.[1] ?? '').trim();
    const inShort = stripMd(head.match(/> \*\*In short:\*\* (.+)/)?.[1] ?? '');
    const get = (t: string) => sections.find((s) => s.title.toLowerCase() === t.toLowerCase());
    const glance = (get('At a glance')?.md ?? '').split('\n').filter((l) => /^\| \*\*/.test(l)).map((l) => {
      const [, label, value] = l.split('|').map((x) => x.trim());
      return { label: stripMd(label), value: stripMd(value) };
    });
    const takeaways = (get('Key takeaways')?.md ?? '').split('\n').filter((l) => l.startsWith('- ')).map((l) => stripMd(l.slice(2)));
    const faqs = parseFaqs(get('Frequently asked questions')?.md ?? '');
    const pairs = [...(get('Pairs well with')?.md ?? '').matchAll(/\b([A-Z][a-z])\b/g)].map((m) => m[1]);
    const skip = ['at a glance', 'key takeaways', 'frequently asked questions', 'pairs well with'];
    const rest = sections.filter((s) => !skip.includes(s.title.toLowerCase())).map((s) => ({ ...s, html: md(s.md) }));
    return {
      slug: String(data.url).replace('/services/', ''),
      element: data.element as Element,
      formula: data.formula,
      question, inShort,
      seoTitle: data.seo_title, metaDescription: data.meta_description, primaryKeyword: data.primary_keyword,
      lastUpdated: iso(data.last_updated),
      glance, sections: rest, takeaways, faqs, pairs,
    };
  });
  return _services;
}

export const getService = (slug: string) => getServices().find((s) => s.slug === slug);
export const getServiceBySymbol = (sym: string) => getServices().find((s) => s.element.symbol === sym);

let _insights: Insight[] | null = null;
export function getInsights(): Insight[] {
  if (_insights) return _insights;
  _insights = readDir('insights').map((raw) => {
    const { data, content } = matter(raw);
    const body = content.replace(/^# .+$/m, '').trim();
    const inShort = stripMd(body.match(/\*\*In short:\*\* (.+)/)?.[1] ?? '');
    const { sections } = splitSections(body);
    const faqs = parseFaqs(sections.find((s) => s.title === 'Frequently asked questions')?.md ?? '');
    return {
      slug: data.slug, title: data.title, type: String(data.type).split('#')[0].trim(), topic: data.topic,
      seoTitle: data.seo_title, metaDescription: data.meta_description, primaryKeyword: data.primary_keyword,
      published: iso(data.published), lastUpdated: iso(data.last_updated), readTime: data.read_time,
      inShort, html: md(body.replace(/\*\*In short:\*\* .+\n/, '')), faqs, relatedServices: data.related_services ?? [],
    };
  }).sort((a, b) => b.published.localeCompare(a.published));
  return _insights;
}
export const getInsight = (slug: string) => getInsights().find((i) => i.slug === slug);
