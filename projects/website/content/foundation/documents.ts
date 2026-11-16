import type { routing } from '@/lib/i18n/routing';

/**
 * The documents Stichting Anda publishes about itself. The Jaarstukken page
 * lists the annual accounts and policy plans, the Bankafschriften page the
 * bank statements; while a kind has no entry, its page shows an empty state.
 *
 * To publish a document, put the PDF in `public/downloads/` and add one entry
 * to `FOUNDATION_DOCUMENTS` with a title in every locale. No page changes.
 */

export type FoundationLocale = (typeof routing.locales)[number];

export type FoundationDocumentKind = 'annual-accounts' | 'policy-plan' | 'bank-statement';

export type FoundationDocument = {
  /** Unique and stable, for example `annual-accounts-2025`. */
  id: string;
  kind: FoundationDocumentKind;
  /** The financial year the document covers. */
  year: number;
  title: Record<FoundationLocale, string>;
  /** A path under `/downloads/`, served from `public/downloads/`. */
  href: string;
};

export const FOUNDATION_DOCUMENTS: readonly FoundationDocument[] = [];

/** The documents of the given kinds, newest financial year first. */
export function foundationDocuments(
  kinds: readonly FoundationDocumentKind[],
): FoundationDocument[] {
  return FOUNDATION_DOCUMENTS.filter((document) => kinds.includes(document.kind)).sort(
    (a, b) => b.year - a.year,
  );
}
