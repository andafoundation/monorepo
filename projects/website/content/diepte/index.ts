import { en } from './en';
import { nl } from './nl';
import { ru } from './ru';
import { tr } from './tr';
import type { DiepteDocument, DiepteLocale } from './types';

export { DIEPTE_PARTS, DIEPTE_SECTIONS } from './structure';
export type {
  DieptePartId,
  DiepteSectionEntry,
  DiepteSectionId,
  DiepteSectionLevel,
} from './structure';
export type {
  DiepteBlock,
  DiepteDocument,
  DiepteLocale,
  DiepteSectionText,
} from './types';

const DOCUMENTS: Record<DiepteLocale, DiepteDocument> = { en, nl, tr, ru };

function isDiepteLocale(locale: string): locale is DiepteLocale {
  return Object.hasOwn(DOCUMENTS, locale);
}

/**
 * Resolves the document for a site locale. A locale without its own text,
 * or with a module that still holds the English document, gets English and
 * `translated: false`, so the page can say the text is English only for now.
 */
export function getDiepteDocument(locale: string): {
  document: DiepteDocument;
  translated: boolean;
} {
  const document: DiepteDocument = isDiepteLocale(locale) ? DOCUMENTS[locale] : en;
  return { document, translated: document.locale === locale };
}
