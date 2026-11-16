import type { Metadata } from 'next';
import { routing } from '@/lib/i18n/routing';
import { absoluteUrl, localePath, OG_IMAGE, OG_LOCALE, SEO_INDEXABLE, SITE_NAME, toSiteLocale } from './site';

/**
 * Emits `<link rel="alternate" type="text/plain" href="/llms.txt">`. Next
 * merges metadata shallowly per key, so a page that sets `alternates` replaces
 * the layout's block wholesale; every page therefore re-adds it here.
 */
export const LLMS_TXT_ALTERNATE_TYPES = { 'text/plain': '/llms.txt' } as const;

/** The snippet length search engines show without truncating; every meta description stays within it. */
export const META_DESCRIPTION_MAX_LENGTH = 155;

/** An image for `og:image` and `twitter:image`; a site-relative `url` is made absolute by the layout's `metadataBase`. */
export interface PageImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

export interface BuildPageMetadataInput {
  title: string;
  description: string;
  /** Page slug without the locale and without a leading slash, as in `lib/navigation.ts`; `''` for the home page. */
  path: string;
  locale: string;
  /** Replaces the site's Open Graph image. */
  image?: PageImage;
  /** false emits `noindex, nofollow`; every page is `noindex` when `SEO_INDEXABLE` is false. */
  index?: boolean;
  /** Replaces the translated canonical and hreflang cluster, for example with `buildUntranslatedAlternates`. */
  alternates?: Metadata['alternates'];
}

/** Absolute URL of a page in a locale. */
export function localeUrl(locale: string, path: string): string {
  return absoluteUrl(localePath(locale, path));
}

/**
 * The hreflang cluster of a translated page: every locale plus `x-default`,
 * which names the Dutch page because Dutch is the foundation's own language
 * and the routing default. Google drops a cluster that is not reciprocal, so
 * every page lists all four locales, including the one it is on.
 */
export function hreflangLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localeUrl(locale, path);
  }
  languages['x-default'] = localeUrl(routing.defaultLocale, path);
  return languages;
}

/**
 * Self-referencing canonical plus the full hreflang cluster. Every locale of a
 * page is its own canonical; pointing them all at one locale would make Google
 * fold the translations into it as duplicates.
 */
export function buildAlternates(locale: string, path: string): Metadata['alternates'] {
  return {
    canonical: localeUrl(locale, path),
    languages: hreflangLanguages(path),
  };
}

/**
 * Canonical for a page whose main content is not translated, such as an And:
 * the poem reads the same on every locale, so the other locale URLs are the
 * same page with a different menu, not translations. Every locale points at
 * the one canonical URL and no hreflang cluster is emitted, since a cluster
 * would present identical text as four language versions.
 *
 * `canonicalPath` is the full site-relative path including its locale, for
 * example `/en/ands/2026-08-03-1`.
 */
export function buildUntranslatedAlternates(canonicalPath: string): Metadata['alternates'] {
  return {
    canonical: absoluteUrl(canonicalPath),
  };
}

const SITE_IMAGE: PageImage = {
  url: OG_IMAGE.path,
  width: OG_IMAGE.width,
  height: OG_IMAGE.height,
};

/** The canonical as a string, whatever form the alternates block gave it in. */
function canonicalOf(alternates: Metadata['alternates']): string | undefined {
  const canonical = alternates?.canonical;
  if (canonical === null || canonical === undefined) {
    return undefined;
  }
  if (typeof canonical === 'string') {
    return canonical;
  }
  if (canonical instanceof URL) {
    return canonical.toString();
  }
  return canonical.url.toString();
}

/**
 * One Next `Metadata` object per page: canonical, hreflang, Open Graph and
 * Twitter card are built from the same title, description, URL and image, so
 * they cannot disagree. Next also merges `openGraph` and `twitter` shallowly,
 * so a page that declared only part of either would silently lose the rest of
 * the layout's block; this always returns both whole.
 *
 * `robots` is set only for the `noindex` case. An indexable page inherits the
 * layout's directive, which carries the snippet and image preview limits.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  image = SITE_IMAGE,
  index = true,
  alternates,
}: BuildPageMetadataInput): Metadata {
  const pageAlternates = alternates ?? buildAlternates(locale, path);
  const canonical = canonicalOf(pageAlternates) ?? localeUrl(locale, path);
  const imageAlt = image.alt ?? title;

  return {
    title,
    description,
    alternates: {
      ...pageAlternates,
      canonical,
      types: { ...LLMS_TXT_ALTERNATE_TYPES },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[toSiteLocale(locale)],
      title,
      description,
      url: canonical,
      images: [{ url: image.url, width: image.width, height: image.height, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: imageAlt }],
    },
    ...(index && SEO_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
  };
}
