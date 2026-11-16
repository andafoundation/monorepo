import { hasLocale } from 'next-intl';
import { routing } from '@/lib/i18n/routing';

/**
 * Site-wide identity read by the page metadata, the structured data and the
 * discovery files (robots, sitemap, llms.txt, manifest). It is defined once so
 * the name, the foundation's facts and the asset paths cannot drift between
 * the head, the JSON-LD and those files; answer engines score exactly that
 * consistency.
 *
 * The address and e-mail mirror `footer.address` and `footer.email` in
 * `messages/*.json`; keep the two in sync. The footer's telephone, KvK, RSIN
 * and IBAN are left out on purpose: they are placeholder values, and
 * structured data must not state a fact the foundation has not confirmed.
 */

/** The one public origin. Every canonical, hreflang, sitemap and JSON-LD URL derives from it. */
export const SITE_URL = 'https://andaphilosophy.com';

export const SITE_NAME = 'Anda';
export const ORGANIZATION_LEGAL_NAME = 'Stichting Anda';
export const FOUNDER = 'Merthan Tukuş';
export const ORGANIZATION_EMAIL = 'info@andaphilosophy.com';

export const ORGANIZATION_ADDRESS = {
  streetAddress: 'Rotterdamsweg 183C',
  postalCode: '2629 HD',
  addressLocality: 'Delft',
  addressRegion: 'Zuid-Holland',
  addressCountry: 'NL',
} as const;

/**
 * The domain named after the tradition. It forwards to this site, so it
 * identifies both the foundation and Andaism itself.
 */
export const ANDAISM_URL = 'https://andaism.com';

/** Profiles and domains that identify the foundation elsewhere, for Organization.sameAs. */
export const ORGANIZATION_SAME_AS: readonly string[] = [ANDAISM_URL];

/** Static images under `public/assets/`. Paths are site-relative; `absoluteUrl` makes them absolute for JSON-LD. */
export const OG_IMAGE = { path: '/assets/og-image-yurt.png', width: 1200, height: 630 } as const;
export const LOGO_IMAGE = { path: '/assets/anda-yurt-logo.webp', width: 1024, height: 1024 } as const;

export const THEME_COLOR = '#1a3f8b';

/**
 * Whether search engines and AI crawlers may index the build. Indexing is on
 * unless the build sets `NEXT_PUBLIC_SEO_INDEXABLE=false`, which turns every
 * page `noindex` and makes robots.txt disallow everything. The site has one
 * public host, so no origin check is needed to keep a second copy out of the
 * index.
 */
export const SEO_INDEXABLE = process.env.NEXT_PUBLIC_SEO_INDEXABLE !== 'false';

export type SiteLocale = (typeof routing.locales)[number];

/** Open Graph `og:locale` per route locale. */
export const OG_LOCALE: Record<SiteLocale, string> = {
  en: 'en_US',
  nl: 'nl_NL',
  tr: 'tr_TR',
  ru: 'ru_RU',
};

/** BCP 47 tags for JSON-LD `inLanguage` and `availableLanguage`. */
export const CONTENT_LANGUAGES: Record<SiteLocale, string> = {
  en: 'en',
  nl: 'nl',
  tr: 'tr',
  ru: 'ru',
};

/**
 * Narrows a route `locale` param, typed `string` by Next, to a site locale.
 * An unknown value falls back to the default locale so the per-locale maps
 * above always have an entry; the `[locale]` layout has already answered 404
 * for an unknown locale before any page reaches this.
 */
export function toSiteLocale(locale: string): SiteLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Site-relative path of a page in a locale. `path` is a page slug without the
 * locale and without a leading slash, as in `lib/navigation.ts`; the home page
 * is `''`. The home URL is `/nl`, never `/nl/`, so no canonical names a
 * trailing-slash variant that redirects.
 */
export function localePath(locale: string, path: string): string {
  return path === '' ? `/${locale}` : `/${locale}/${path}`;
}

/** Absolute URL of a site-relative path. JSON-LD has no `metadataBase`, so every URL in it must be absolute. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
