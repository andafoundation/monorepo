import { absoluteUrl } from './site';

/** The node an `@id` names: the site-wide nodes, and one per entity type on a page. */
export type JsonLdFragment =
  | 'organization'
  | 'andaism'
  | 'mengu'
  | 'tengrism'
  | 'founder'
  | 'website'
  | 'webpage'
  | 'breadcrumb'
  | 'itemlist'
  | 'article'
  | 'poem'
  | 'book'
  | 'steppe-book';

export interface BuildJsonLdIdInput {
  /** Site-relative canonical path of the page the entity describes, including its locale. */
  path: string;
  fragment: JsonLdFragment;
}

/**
 * Stable `@id` of a structured-data entity: the absolute canonical URL plus a
 * fragment, so the entities of a page reference each other and read as one graph.
 */
export function buildJsonLdId({ path, fragment }: BuildJsonLdIdInput): string {
  return `${absoluteUrl(path).split('#')[0]}#${fragment}`;
}

/** The `@id` of a built entity, or undefined when the builder emitted nothing. */
export function getJsonLdId(entity: Record<string, unknown> | null | undefined): string | undefined {
  const id = entity?.['@id'];
  return typeof id === 'string' ? id : undefined;
}
