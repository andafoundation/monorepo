import { ANDAISM_JSON_LD_ID } from './build-andaism-json-ld';
import type { JsonLdEntity } from './json-ld';
import { ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl, CONTENT_LANGUAGES, ORGANIZATION_LEGAL_NAME, SITE_NAME, toSiteLocale } from './site';

/** Stable node id of the site, referenced by every WebPage's `isPartOf`. */
export const WEBSITE_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'website' });

export interface BuildWebSiteJsonLdInput {
  locale: string;
}

/**
 * schema.org WebSite, published by the foundation. It carries no SearchAction
 * because the site has no search, and structured data must not promise a
 * feature the page lacks. The site is about Andaism, referenced by `@id`.
 */
export function buildWebSiteJsonLd({ locale }: BuildWebSiteJsonLdInput): JsonLdEntity {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_JSON_LD_ID,
    name: SITE_NAME,
    alternateName: ORGANIZATION_LEGAL_NAME,
    url: absoluteUrl('/'),
    inLanguage: CONTENT_LANGUAGES[toSiteLocale(locale)],
    publisher: { '@id': ORGANIZATION_JSON_LD_ID },
    about: { '@id': ANDAISM_JSON_LD_ID },
  };
}
