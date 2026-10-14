import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// AI search & assistant crawlers are explicitly allowed: being cited by AI is a goal (GEO).
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you', '/lab/result'] },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
