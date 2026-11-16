/** Languages an And can be written in; the poem text itself is never translated. */
export const AND_LANGUAGES = ['en', 'nl', 'tr'] as const;

export type AndLanguage = (typeof AND_LANGUAGES)[number];

/** How a whole line is set: the file marks it as `*line*` for italic or `**line**` for bold. */
export type LineEmphasis = 'italic' | 'bold';

/** One shared poem from `ands/ands.txt`. */
export interface And {
  /** `${date}-${ordinal}`, for example "2026-10-19-3"; `undated-${ordinal}` when no date header precedes the entry. */
  id: string;
  /** Version label as written in the file without a trailing colon, for example "V3.1"; null when the entry has none. */
  version: string | null;
  /** ISO day "YYYY-MM-DD" from the last date header above the entry; null when there is none. */
  date: string | null;
  /** 1-based position among the entries of the same date, in file order. */
  ordinal: number;
  /** Set on a poem whose first line in the file is `# Title` and on a standalone oath such as The First And; null otherwise. */
  title: string | null;
  /** Body lines with trailing whitespace and emphasis markers removed; "" marks a stanza break. */
  lines: string[];
  /** Emphasis of the line at the same index of `lines`, null for a plain line; absent when no line is emphasised. */
  emphasis?: (LineEmphasis | null)[];
  /** Language of the text, detected from its words. */
  language: AndLanguage;
}

/** Visitor filter over the collection; null means "all". `month` is "YYYY-MM". */
export interface AndsFilter {
  month: string | null;
  language: AndLanguage | null;
}

export interface AndMonthCount {
  /** "YYYY-MM". */
  month: string;
  count: number;
}

export interface AndLanguageCount {
  language: AndLanguage;
  count: number;
}

export interface AndNeighbours {
  previous: And | null;
  next: And | null;
}
