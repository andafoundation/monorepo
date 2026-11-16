import type { MetadataRoute } from 'next';

/** Where a page sits on the site; the llms.txt sections and the sitemap priorities follow it. */
export type SeoPageSection = 'home' | 'texts' | 'foundation' | 'legal';

export type SeoPage = {
  /** Page slug without the locale and without a leading slash, as in `lib/navigation.ts`; `''` for the home page. */
  path: string;
  /** The next-intl namespace in `messages/*.json` that holds the page's head copy. */
  namespace: string;
  /** Key of the page's `<title>` inside `namespace`. */
  titleKey: string;
  /** Key of the page's meta description inside `namespace`, 155 characters or fewer in every locale. */
  descriptionKey: string;
  section: SeoPageSection;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
};

/** Every page reads its head copy from the same two keys of its own namespace. */
const META_TITLE_KEY = 'metaTitle';
const META_DESCRIPTION_KEY = 'metaDescription';

function seoPage(
  path: string,
  namespace: string,
  section: SeoPageSection,
  priority: number,
  changeFrequency: SeoPage['changeFrequency'],
): SeoPage {
  return {
    path,
    namespace,
    titleKey: META_TITLE_KEY,
    descriptionKey: META_DESCRIPTION_KEY,
    section,
    priority,
    changeFrequency,
  };
}

/**
 * The indexable pages, each served in every locale under the same slug. The
 * sitemap, llms.txt and every page's metadata read this one list, so a page
 * cannot reach the sitemap without head copy, and a page in the navigation
 * (`NAV_GROUPS`, `NAV_PAGES`, `NAV_CTA`) or in the footer's legal links cannot
 * be left out of it without a test failing.
 *
 * The single poems (`poems/{id}`) are not listed: their text is never
 * translated, so each has one canonical URL in the poem's own language and the
 * sitemap adds it from `getAnds()`. The single oaths (`ands/{id}`) are not
 * listed either: the sitemap adds each at its one canonical stone. Redirecting URLs (`/`, `/download`) and
 * the chrome-less `boek/html` file stay out on purpose.
 *
 * Order is reading order: home, the teaching, the texts, the foundation, then
 * the legal pages. llms.txt keeps it.
 */
export const SEO_PAGES: readonly SeoPage[] = [
  seoPage('', 'home', 'home', 1, 'weekly'),
  seoPage('boodschap', 'boodschap', 'texts', 0.9, 'monthly'),
  seoPage('pilaren', 'pilaren', 'texts', 0.9, 'monthly'),
  seoPage('eed', 'eed', 'texts', 0.9, 'monthly'),
  seoPage('diepte', 'diepte', 'texts', 0.9, 'monthly'),
  seoPage('ands', 'ands', 'texts', 0.9, 'monthly'),
  // New poems are added every few days, and the list page is where they appear first.
  seoPage('poems', 'poems', 'texts', 0.9, 'weekly'),
  seoPage('boek', 'boek', 'texts', 0.9, 'monthly'),
  seoPage('skyyurt', 'skyyurt', 'foundation', 0.6, 'monthly'),
  seoPage('statuten', 'statuten', 'foundation', 0.6, 'yearly'),
  seoPage('jaarstukken', 'jaarstukken', 'foundation', 0.6, 'monthly'),
  seoPage('bankafschriften', 'bankafschriften', 'foundation', 0.6, 'monthly'),
  seoPage('openheid', 'openheid', 'foundation', 0.6, 'monthly'),
  seoPage('contact', 'contact', 'foundation', 0.6, 'yearly'),
  seoPage('privacy', 'privacy', 'legal', 0.3, 'yearly'),
  seoPage('cookies', 'cookies', 'legal', 0.3, 'yearly'),
  seoPage('disclaimer', 'disclaimer', 'legal', 0.3, 'yearly'),
];

/**
 * The registry entry of a page slug. It throws for a slug that is not listed,
 * because a page asking for its head copy under an unknown slug is a
 * programming error that must fail the build, not ship a page without a title.
 */
export function getSeoPage(path: string): SeoPage {
  const page = SEO_PAGES.find((entry) => entry.path === path);
  if (page === undefined) {
    throw new Error(`lib/seo/pages.ts lists no page with the slug "${path}"`);
  }
  return page;
}
