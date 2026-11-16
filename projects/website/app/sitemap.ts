import type { MetadataRoute } from 'next';

import { getAnds } from '@/lib/ands/ands';
import { STANDALONE_OATHS } from '@/lib/ands/oaths';
import type { And } from '@/lib/ands/types';
import { routing } from '@/lib/i18n/routing';
import { andCanonicalPath, oathCanonicalPath } from '@/lib/seo/build-poem-json-ld';
import { hreflangLanguages, localeUrl } from '@/lib/seo/metadata';
import { SEO_PAGES, type SeoPage } from '@/lib/seo/pages';
import { absoluteUrl } from '@/lib/seo/site';

/**
 * Last-modified stamp for the pages, whose copy carries no date of its own.
 * Deliberately not `new Date()`: a stamp that moves with every build tells
 * crawlers the whole site changes constantly, and they learn to ignore it.
 * Bump it when page copy changes materially.
 */
const CONTENT_LAST_MODIFIED = new Date('2026-10-20T00:00:00.000Z');

/** A single poem never changes once shared; new ones appear on the weekly `poems` list page. */
const AND_PRIORITY = 0.8;
const AND_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'yearly';

/**
 * One entry per locale for a page, each with the full hreflang set. The URLs
 * come from the helpers the page metadata uses, so the sitemap cannot drift
 * from the canonical and hreflang tags.
 */
function pageEntries(page: SeoPage): MetadataRoute.Sitemap {
  const languages = hreflangLanguages(page.path);
  return routing.locales.map((locale) => ({
    url: localeUrl(locale, page.path),
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: { languages },
  }));
}

/**
 * One entry per poem at its canonical URL on the poems page, in the poem's own language and with
 * no alternates: the text is never translated, so the other locale URLs point
 * their canonical here and must not be listed.
 */
function andEntry(and: And): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(andCanonicalPath(and)),
    lastModified: and.date === null ? CONTENT_LAST_MODIFIED : new Date(`${and.date}T00:00:00.000Z`),
    changeFrequency: AND_CHANGE_FREQUENCY,
    priority: AND_PRIORITY,
  };
}

/**
 * A standalone oath stands only on the Ands page, never on the poems page. Its text is never translated, so it is
 * listed once at its canonical stone, without alternates: the other locale stones point their canonical there.
 */
function standaloneOathEntry(oath: And): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(oathCanonicalPath(oath)),
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: AND_CHANGE_FREQUENCY,
    priority: AND_PRIORITY,
  };
}

/**
 * Every indexable page in every locale, each standalone oath at its canonical stone, plus one URL
 * per poem. The redirecting URLs (`/`, `/download`) and the chrome-less `boek/html` file are not in
 * `SEO_PAGES`, so they never reach this list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [...SEO_PAGES.flatMap(pageEntries), ...STANDALONE_OATHS.map(standaloneOathEntry), ...getAnds().map(andEntry)];
}
