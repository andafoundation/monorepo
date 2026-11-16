import type { DieptePartId, DiepteSectionId } from './structure';

export type DiepteLocale = 'en' | 'nl' | 'tr' | 'ru';

/**
 * One block of running text. Inside `text`, `lines` and `items`, `**x**`
 * marks strong emphasis; no other inline syntax exists.
 */
export type DiepteBlock =
  | { type: 'paragraph'; text: string }
  /** An empty string in `lines` is a stanza break. `lang` marks text that stays in its original language. */
  | { type: 'quote'; lines: string[]; lang?: string }
  | { type: 'list'; ordered: boolean; items: string[] };

export type DiepteSectionText = { title: string; blocks: DiepteBlock[] };

export type DiepteDocument = {
  /**
   * The language the text is written in. A locale whose module still holds
   * the English document keeps `'en'` here, which is how the page knows to
   * show the English-only note.
   */
  locale: DiepteLocale;
  title: string;
  lead: DiepteBlock[];
  parts: Record<DieptePartId, string>;
  /** `null` omits the section in this locale, as the translated prayer in Turkish. */
  sections: Record<DiepteSectionId, DiepteSectionText | null>;
};
