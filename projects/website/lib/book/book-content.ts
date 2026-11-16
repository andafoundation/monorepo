import { getSteppeDocument } from '@/content/steppe';
import type { routing } from '@/lib/i18n/routing';
import type nlMessages from '@/messages/nl.json';

/**
 * The shape every locale's messages must have. Typing the input against the
 * Dutch file means a locale that lacks a book key fails the type check at
 * build time instead of rendering an empty chapter at runtime.
 */
export type SiteMessages = typeof nlMessages;

export type BookLocale = (typeof routing.locales)[number];

/** One chapter of the book. Each entry of `lines` is a paragraph or a verse line. */
export type BookChapter = {
  id: string;
  title: string;
  lines: string[];
  /** Set when the chapter is written in another language than the book around it. */
  lang?: string;
};

/** A run of paragraphs in a narrative chapter, opened by a sub-heading when it has one. */
export type BookSection = {
  /** The anchor of the sub-heading; set only when `heading` is. */
  id?: string;
  heading?: string;
  lines: string[];
};

/** A chapter of a story, told in sections. */
export type NarrativeChapter = {
  id: string;
  title: string;
  /** Set when the chapter is written in another language than the book around it. */
  lang?: string;
  sections: BookSection[];
};

/** What every book has, whatever its chapters are. */
type BookFrame = {
  locale: BookLocale;
  title: string;
  subtitle: string;
  author: string;
  year: string;
  labels: {
    contents: string;
    pillars: string;
    oath: string;
    colophon: string;
    download: string;
    close: string;
  };
  /** A note printed under the cover, such as that the text is not translated yet. */
  notice?: string;
};

/**
 * A `core` book is the philosophy: the message, the six pillars and the oath.
 * A `narrative` book is a story told in chapters, each split into sections.
 */
export type BookContent = BookFrame &
  (
    | { kind: 'core'; message: BookChapter; pillars: BookChapter[]; oath: BookChapter }
    | { kind: 'narrative'; chapters: NarrativeChapter[] }
  );

const PILLAR_KEYS = ['pillar1', 'pillar2', 'pillar3', 'pillar4', 'pillar5', 'pillar6'] as const;

// The site titles a pillar "Pilaar 1: Nomadisme"; the book numbers its
// chapters with roman numerals, so only the name after the colon is kept.
const PILLAR_TITLE_PREFIX = /^[^:]+:\s*/;

function bookLabels(book: SiteMessages['book']): BookContent['labels'] {
  return {
    contents: book.contents,
    pillars: book.pillars,
    oath: book.oath,
    colophon: book.colophon,
    download: book.download,
    close: book.close,
  };
}

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Builds the book from the same messages that drive the boodschap, pilaren
 * and eed pages, so the book can never say something the site does not.
 */
export function toBookContent(locale: BookLocale, messages: SiteMessages): BookContent {
  const { book, boodschap, pilaren, eed } = messages;

  return {
    kind: 'core',
    locale,
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    year: book.year,
    labels: bookLabels(book),
    message: {
      id: 'anda-book-message',
      title: boodschap.title,
      lines: [
        boodschap.paragraph1,
        boodschap.paragraph2,
        boodschap.paragraph3,
        boodschap.paragraph4,
        boodschap.paragraph5,
        boodschap.paragraph6,
        boodschap.paragraph7,
      ],
    },
    pillars: PILLAR_KEYS.map((key, index) => ({
      id: `anda-book-pillar-${index + 1}`,
      title: pilaren[key].title.replace(PILLAR_TITLE_PREFIX, ''),
      lines: splitLines(pilaren[key].full),
    })),
    oath: {
      id: 'anda-book-oath',
      title: eed.title,
      lines: [eed.oath1, eed.oath2, eed.oath3, eed.oath4, eed.oath5, eed.oath6, eed.oathFinal],
    },
  };
}

/**
 * Builds The Call of the Steppe. The chrome comes from the locale's messages;
 * the chapter text comes from the steppe content module, which falls back to
 * English for a locale without a translation. Every English chapter is then
 * marked `lang="en"` and the cover says the text is English only for now.
 */
export function toSteppeBookContent(locale: BookLocale, messages: SiteMessages): BookContent {
  const { book, steppe } = messages;
  const { document, translated } = getSteppeDocument(locale);
  const chapters = document.chapters.map((source, chapterIndex): NarrativeChapter => {
    const id = `anda-book-steppe-chapter-${chapterIndex + 1}`;
    // Only sub-headings get an anchor, so they are counted apart from the
    // untitled run of paragraphs that opens a chapter.
    let headed = 0;
    const sections = source.sections.map((section): BookSection => {
      if (section.heading === undefined) {
        return { lines: section.lines };
      }
      headed += 1;
      return { id: `${id}-section-${headed}`, heading: section.heading, lines: section.lines };
    });
    const chapter: NarrativeChapter = { id, title: source.title, sections };
    return translated ? chapter : { ...chapter, lang: document.locale };
  });

  return {
    kind: 'narrative',
    locale,
    title: steppe.title,
    subtitle: steppe.subtitle,
    author: steppe.author,
    year: steppe.year,
    labels: bookLabels(book),
    ...(translated ? {} : { notice: steppe.englishOnly }),
    chapters,
  };
}
