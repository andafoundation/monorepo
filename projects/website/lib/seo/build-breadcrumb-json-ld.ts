import type { JsonLdEntity } from './json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl } from './site';

export interface BreadcrumbJsonLdItem {
  name: string;
  /** Site-relative path including its locale; made absolute here. */
  path: string;
}

export interface BuildBreadcrumbJsonLdInput {
  /** The full trail, starting with the home crumb (`{ name: t('home'), path: '/nl' }`) and ending with the page. */
  items: readonly BreadcrumbJsonLdItem[];
  /** Site-relative canonical path of the page the trail belongs to; anchors its `@id`. */
  path: string;
}

/** schema.org BreadcrumbList; positions are 1-based. */
export function buildBreadcrumbJsonLd({ items, path }: BuildBreadcrumbJsonLdInput): JsonLdEntity {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': buildJsonLdId({ path, fragment: 'breadcrumb' }),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
