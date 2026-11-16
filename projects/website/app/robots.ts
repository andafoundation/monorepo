import type { MetadataRoute } from 'next';

import { AI_TRAINING_CRAWLERS, SEARCH_AND_CITATION_CRAWLERS } from '@/lib/seo/crawlers';
import { absoluteUrl, SEO_INDEXABLE } from '@/lib/seo/site';

/**
 * Paths that are not pages: the health endpoint under `/api/`, and the
 * chrome-less book files `/{locale}/boek/html` and `/{locale}/boek/steppe/html`,
 * which would otherwise compete with `/{locale}/boek` for the same text. Repeated in every group because a
 * crawler that matches a named `User-agent` group ignores the `*` group.
 */
const DISALLOW = ['/api/', '/*/boek/html', '/*/boek/steppe/html'];

export default function robots(): MetadataRoute.Robots {
  if (!SEO_INDEXABLE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: [...SEARCH_AND_CITATION_CRAWLERS], allow: '/', disallow: DISALLOW },
      { userAgent: [...AI_TRAINING_CRAWLERS], allow: '/', disallow: DISALLOW },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
