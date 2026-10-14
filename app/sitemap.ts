import type { MetadataRoute } from 'next';
import { getServices, getInsights } from '@/lib/content';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, lastModified: Date | string = now) => ({ url: `${SITE.url}${path}`, lastModified, priority });
  return [
    page('/', 1), page('/lab', 0.9), page('/services', 0.9), page('/book', 0.8), page('/about', 0.7), page('/insights', 0.7), page('/agents', 0.5),
    ...getServices().map((s) => page(`/services/${s.slug}`, 0.8, s.lastUpdated || now)),
    ...getInsights().map((p) => page(`/insights/${p.slug}`, 0.6, p.lastUpdated || p.published || now)),
    page('/privacy', 0.2), page('/terms', 0.2),
  ];
}
