import { en } from './en';
import { nl } from './nl';
import { ru } from './ru';
import { tr } from './tr';
import type { SteppeDocument, SteppeLocale } from './types';

export type { SteppeChapter, SteppeDocument, SteppeLocale, SteppeSection } from './types';

const DOCUMENTS: Record<SteppeLocale, SteppeDocument> = { en, nl, tr, ru };

function isSteppeLocale(locale: string): locale is SteppeLocale {
  return Object.hasOwn(DOCUMENTS, locale);
}

/**
 * Resolves the book for a site locale. A locale without its own text, or
 * with a module that still holds the English document, gets English and
 * `translated: false`, so the book can say the text is English only for now.
 */
export function getSteppeDocument(locale: string): {
  document: SteppeDocument;
  translated: boolean;
} {
  const document: SteppeDocument = isSteppeLocale(locale) ? DOCUMENTS[locale] : en;
  return { document, translated: document.locale === locale };
}
