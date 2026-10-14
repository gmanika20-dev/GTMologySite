import fs from 'node:fs';
import path from 'node:path';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

// Concatenates the raw markdown of every service page and article (frontmatter stripped).
export function GET() {
  const root = path.join(process.cwd(), 'content');
  const read = (dir: string) => fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.md')).sort()
    .map((f) => fs.readFileSync(path.join(root, dir, f), 'utf8').replace(/^---[\s\S]*?---\s*/, '').replace(/\n\*\*CTA:\*\*.*$/m, '').trim());
  const body = [`# GTMology: full content\n\n> ${SITE.description}\n\nSource: ${SITE.url}`, '# Services', ...read('services'), '# Insights', ...read('insights')].join('\n\n---\n\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
