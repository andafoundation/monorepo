import type { FoundationDocument } from '@/content/foundation/documents';
import type { JsonLdEntity } from './json-ld';
import { ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl, toSiteLocale } from './site';

const PDF_EXTENSION = /\.pdf$/i;

export interface BuildDocumentListJsonLdInput {
  /** The documents the page lists, in page order, as `foundationDocuments(kinds)` returns them. */
  documents: readonly FoundationDocument[];
  /** The list's heading on the page, such as `jaarstukken.documentsTitle`. */
  name: string;
  locale: string;
  /** Site-relative canonical path of the page, including its locale. */
  path: string;
}

/**
 * schema.org ItemList of the DigitalDocuments the foundation publishes about
 * itself (annual accounts, policy plans, bank statements). Null while the page
 * lists no document, so structured data never announces a list the visitor
 * sees as empty.
 */
export function buildDocumentListJsonLd({
  documents,
  name,
  locale,
  path,
}: BuildDocumentListJsonLdInput): JsonLdEntity | null {
  if (documents.length === 0) {
    return null;
  }

  const siteLocale = toSiteLocale(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': buildJsonLdId({ path, fragment: 'itemlist' }),
    name,
    numberOfItems: documents.length,
    itemListElement: documents.map((document, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'DigitalDocument',
        name: document.title[siteLocale],
        url: absoluteUrl(document.href),
        temporalCoverage: String(document.year),
        publisher: { '@id': ORGANIZATION_JSON_LD_ID },
        ...(PDF_EXTENSION.test(document.href) ? { encodingFormat: 'application/pdf' } : {}),
      },
    })),
  };
}
