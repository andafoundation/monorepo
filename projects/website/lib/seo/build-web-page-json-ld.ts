import type { JsonLdEntity } from './json-ld';
import type { PageImage } from './metadata';
import { ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { WEBSITE_JSON_LD_ID } from './build-website-json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl, CONTENT_LANGUAGES, toSiteLocale } from './site';

/** CollectionPage for the Ands list, ItemPage for one And, ContactPage for contact, WebPage for the rest. */
export type WebPageType = 'WebPage' | 'CollectionPage' | 'ItemPage' | 'ContactPage';

export interface BuildWebPageJsonLdInput {
  type: WebPageType;
  /** Site-relative canonical path of the page, including its locale. */
  path: string;
  name: string;
  /** The page's meta description; omitted when empty. */
  description: string;
  locale: string;
  /** `@id` of the page's BreadcrumbList. */
  breadcrumbId?: string;
  /** `@id` of the entity the page is about: an Article, Poem, Book, ItemList, or the Organization on contact. */
  mainEntityId?: string;
  /** `@id` of the page's topic when it has no main entity of its own, such as the Organization on the home page. */
  aboutId?: string;
  /** The page's Open Graph image. */
  primaryImage?: PageImage;
}

/**
 * The page-level node that ties a page's structured data into one graph: part
 * of the WebSite, published by the foundation, pointing at its BreadcrumbList,
 * main entity and topic by `@id`. Rendered last on the page.
 */
export function buildWebPageJsonLd({
  type,
  path,
  name,
  description,
  locale,
  breadcrumbId,
  mainEntityId,
  aboutId,
  primaryImage,
}: BuildWebPageJsonLdInput): JsonLdEntity {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': buildJsonLdId({ path, fragment: 'webpage' }),
    url: absoluteUrl(path),
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    inLanguage: CONTENT_LANGUAGES[toSiteLocale(locale)],
    isPartOf: { '@id': WEBSITE_JSON_LD_ID },
    publisher: { '@id': ORGANIZATION_JSON_LD_ID },
    ...(aboutId ? { about: { '@id': aboutId } } : {}),
    ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
    ...(primaryImage
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: absoluteUrl(primaryImage.url),
            width: primaryImage.width,
            height: primaryImage.height,
          },
        }
      : {}),
  };
}
