import type { JsonLdEntity } from './json-ld';
import { buildWebPageJsonLd, type BuildWebPageJsonLdInput } from './build-web-page-json-ld';
import { getJsonLdId } from './json-ld-id';

export type BuildPageJsonLdInput = Omit<BuildWebPageJsonLdInput, 'breadcrumbId'> & {
  /** The page's BreadcrumbList; null or omitted on the home page. */
  breadcrumb?: JsonLdEntity | null;
  /**
   * The entity the page is about, rendered by this page; null when its builder
   * had nothing to state. When it is null, `mainEntityId` may still name an
   * entity rendered elsewhere, such as the layout's Organization on contact.
   */
  mainEntity?: JsonLdEntity | null;
};

/**
 * A page's structured data in render order: BreadcrumbList, main entity, then
 * the WebPage that references both by `@id`. `JsonLd` skips the null entries.
 */
export function buildPageJsonLd({
  breadcrumb = null,
  mainEntity = null,
  mainEntityId,
  ...webPage
}: BuildPageJsonLdInput): (JsonLdEntity | null)[] {
  return [
    breadcrumb,
    mainEntity,
    buildWebPageJsonLd({
      ...webPage,
      breadcrumbId: getJsonLdId(breadcrumb),
      mainEntityId: getJsonLdId(mainEntity) ?? mainEntityId,
    }),
  ];
}
