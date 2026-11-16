import type { routing } from '@/lib/i18n/routing';

export type SteppeLocale = (typeof routing.locales)[number];

/** A run of paragraphs, opened by a sub-heading of the source text when it has one. */
export type SteppeSection = {
  heading?: string;
  /** One entry per paragraph, in reading order. */
  lines: string[];
};

export type SteppeChapter = {
  /** The chapter title without its "Chapter N: " prefix. */
  title: string;
  sections: SteppeSection[];
};

export type SteppeDocument = {
  /**
   * The language the text is written in. A locale whose module still holds
   * the English document keeps `'en'` here, which is how the book knows to
   * show the English-only note.
   */
  locale: SteppeLocale;
  /** The chapters in reading order. */
  chapters: SteppeChapter[];
};
