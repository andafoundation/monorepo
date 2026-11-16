import { describe, expect, test } from 'bun:test';
import { en as steppeEn } from '@/content/steppe/en';
import enMessages from '@/messages/en.json';
import nlMessages from '@/messages/nl.json';
import ruMessages from '@/messages/ru.json';
import trMessages from '@/messages/tr.json';
import { type BookContent, type BookLocale, type SiteMessages, toBookContent, toSteppeBookContent } from './book-content';
import { renderBookBody } from './render-book';

const MESSAGES: Record<BookLocale, SiteMessages> = {
  en: enMessages as unknown as SiteMessages,
  nl: nlMessages,
  tr: trMessages as unknown as SiteMessages,
  ru: ruMessages as unknown as SiteMessages,
};
const LOCALES = Object.keys(MESSAGES) as BookLocale[];
const TRANSLATED_LOCALES = LOCALES.filter((locale) => locale !== 'en');
const META_DESCRIPTION_MAX_LENGTH = 155;

type Json = Record<string, unknown>;

function section(messages: SiteMessages, key: string): Json {
  return (messages as unknown as Json)[key] as Json;
}

function keysOf(value: unknown): string[] {
  return Object.keys(value as Json).sort();
}

function narrative(content: BookContent) {
  if (content.kind !== 'narrative') throw new Error('expected a narrative book');
  return content;
}

type ChapterFacts = {
  title: string;
  numeral: string;
  paragraphs: number;
  headings: number;
  first: string;
  last: string;
};

const CHAPTERS: ChapterFacts[] = [
  {
    title: 'The Man Who Asked the Sky',
    numeral: 'I',
    paragraphs: 94,
    headings: 0,
    first: 'There was once a young nomad named Koru who lived where the grasslands ended and the sky began.',
    last: 'Thus began the journey of Koru.',
  },
  {
    title: 'The Price of a Dream',
    numeral: 'II',
    paragraphs: 356,
    headings: 5,
    first: 'The first thing Koru discovered about freedom was that it was uncomfortable.',
    last: 'And Koru laughed.',
  },
  {
    title: 'The Sky Belongs to No One',
    numeral: 'III',
    paragraphs: 360,
    headings: 7,
    first: 'On the twelfth day of his journey, Koru discovered that the steppe had no sympathy for lonely men.',
    last: 'She did not need to.',
  },
  {
    title: 'An Eternal Understanding',
    numeral: 'IV',
    paragraphs: 64,
    headings: 0,
    first: 'Koru departed the next morning.',
    last: 'And he wanted to see it.',
  },
  {
    title: 'The Mountain of Silent Bells',
    numeral: 'V',
    paragraphs: 723,
    headings: 11,
    first: 'The first bell rang at sunset.',
    last: 'And from somewhere far below the monastery, a door opened.',
  },
];
const TOTAL_PARAGRAPHS = 1597;
const TOTAL_HEADINGS = 23;
const STRAY_STRINGS = ['el.kz', '80.lv', 'teadaocultivation.com'];
const CURLY_QUOTE = /[‘’“”]/;

function chapterId(index: number): string {
  return `anda-book-steppe-chapter-${index + 1}`;
}

describe('The Call of the Steppe chapter text', () => {
  const { chapters } = steppeEn;
  const allLines = chapters.flatMap((chapter) => chapter.sections.flatMap((entry) => entry.lines));
  const allHeadings = chapters.flatMap((chapter) =>
    chapter.sections.flatMap((entry) => (entry.heading === undefined ? [] : [entry.heading])),
  );

  test('has five chapters with the titles in order', () => {
    expect(chapters.map((chapter) => chapter.title)).toEqual(CHAPTERS.map((chapter) => chapter.title));
  });

  test('every chapter has its paragraph and heading counts and its first and last line', () => {
    CHAPTERS.forEach((expected, index) => {
      const lines = chapters[index].sections.flatMap((entry) => entry.lines);
      const headings = chapters[index].sections.filter((entry) => entry.heading !== undefined);
      expect(lines.length, expected.title).toBe(expected.paragraphs);
      expect(headings.length, expected.title).toBe(expected.headings);
      expect(lines[0], expected.title).toBe(expected.first);
      expect(lines[lines.length - 1], expected.title).toBe(expected.last);
    });
  });

  test('has 1597 paragraphs and 23 headings in all', () => {
    expect(allLines.length).toBe(TOTAL_PARAGRAPHS);
    expect(allHeadings.length).toBe(TOTAL_HEADINGS);
  });

  test('no line or heading is empty or holds a newline, a curly quote or a stray string', () => {
    for (const text of [...allLines, ...allHeadings]) {
      expect(text.trim().length).toBeGreaterThan(0);
      expect(text).not.toContain('\n');
      expect(CURLY_QUOTE.test(text), text).toBe(false);
      for (const stray of STRAY_STRINGS) {
        expect(text, stray).not.toContain(stray);
      }
    }
  });

  test('no chapter title keeps its "Chapter N: " prefix and no section is empty', () => {
    for (const chapter of chapters) {
      expect(chapter.title).not.toMatch(/^Chapter\s/i);
      for (const entry of chapter.sections) {
        expect(entry.lines.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('toSteppeBookContent', () => {
  test('builds a narrative book with five chapters for every locale', () => {
    for (const locale of LOCALES) {
      const book = narrative(toSteppeBookContent(locale, MESSAGES[locale]));
      expect(book.locale).toBe(locale);
      expect(book.title).toBe(section(MESSAGES[locale], 'steppe').title as string);
      expect(book.chapters.length, locale).toBe(5);
      book.chapters.forEach((chapter, index) => {
        expect(chapter.id, locale).toBe(chapterId(index));
        expect(chapter.title, locale).toBe(CHAPTERS[index].title);
        const lines = chapter.sections.flatMap((entry) => entry.lines);
        expect(lines.length, `${locale} ${chapter.title}`).toBe(CHAPTERS[index].paragraphs);
      });
      const total = book.chapters.reduce(
        (sum, chapter) => sum + chapter.sections.reduce((inner, entry) => inner + entry.lines.length, 0),
        0,
      );
      expect(total).toBe(TOTAL_PARAGRAPHS);
    }
  });

  test('headed sections have ids chapter-N-section-M counted from 1; the untitled opening has none', () => {
    for (const locale of LOCALES) {
      const book = narrative(toSteppeBookContent(locale, MESSAGES[locale]));
      let headings = 0;
      book.chapters.forEach((chapter, index) => {
        let headed = 0;
        for (const entry of chapter.sections) {
          if (entry.heading === undefined) {
            expect('id' in entry).toBe(false);
            expect('heading' in entry).toBe(false);
          } else {
            headed += 1;
            expect(entry.id, locale).toBe(`${chapterId(index)}-section-${headed}`);
          }
        }
        expect(headed, `${locale} ${chapter.title}`).toBe(CHAPTERS[index].headings);
        headings += headed;
      });
      expect(headings).toBe(TOTAL_HEADINGS);
    }
  });

  test('takes the labels from the book messages of the locale', () => {
    for (const locale of LOCALES) {
      const book = toSteppeBookContent(locale, MESSAGES[locale]);
      expect(book.labels.contents).toBe(MESSAGES[locale].book.contents);
      expect(book.labels.download).toBe(MESSAGES[locale].book.download);
      expect(book.labels.close).toBe(MESSAGES[locale].book.close);
    }
  });

  test('en has no notice and no lang on any chapter', () => {
    const book = narrative(toSteppeBookContent('en', MESSAGES.en));
    expect('notice' in book).toBe(false);
    for (const chapter of book.chapters) {
      expect('lang' in chapter).toBe(false);
    }
  });

  test('nl, ru and tr carry the English-only notice and mark every chapter lang="en"', () => {
    for (const locale of TRANSLATED_LOCALES) {
      const book = narrative(toSteppeBookContent(locale, MESSAGES[locale]));
      expect(book.notice, locale).toBe(section(MESSAGES[locale], 'steppe').englishOnly as string);
      expect(book.notice?.length).toBeGreaterThan(0);
      for (const chapter of book.chapters) {
        expect(chapter.lang, locale).toBe('en');
      }
    }
  });
});

describe('renderBookBody of the narrative book', () => {
  const html = renderBookBody(toSteppeBookContent('en', MESSAGES.en));

  test('has five h2 chapter headings with the numerals I to V in order and no pillar or oath ids', () => {
    expect(html.match(/<h2 class="ab-chapter-title"/g)?.length).toBe(5);
    let from = 0;
    for (const chapter of CHAPTERS) {
      const heading = `<span class="ab-numeral">${chapter.numeral}</span>${chapter.title}`;
      const at = html.indexOf(heading, from);
      expect(at, chapter.title).toBeGreaterThan(-1);
      from = at;
    }
    expect(html).not.toContain('anda-book-pillars');
    expect(html).not.toContain('anda-book-oath');
  });

  test('has 23 h3 section headings with their ids', () => {
    expect(html.match(/<h3 class="ab-chapter-title ab-section-title"/g)?.length).toBe(TOTAL_HEADINGS);
    expect(html.match(/<h3 [^>]*id="anda-book-steppe-chapter-\d-section-\d+"/g)?.length).toBe(TOTAL_HEADINGS);
  });

  test('has five drop caps, one opening each chapter', () => {
    expect(html.match(/class="ab-dropcap"/g)?.length).toBe(5);
    for (const chapter of CHAPTERS) {
      expect(html).toContain(`<p class="ab-dropcap">${chapter.first}</p>`);
    }
  });

  test('escapes quotes', () => {
    expect(html).toContain('&quot;Most men,&quot; his grandfather would say');
    expect(html).not.toContain('"Most men,"');
  });

  test('a Chapter V sign line is a plain paragraph', () => {
    expect(html).toContain('<p>THE BELLS LIE.</p>');
  });

  test('contents has five links with numerals, their targets exist and no section heading is in it', () => {
    const contents = html.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const links = [...contents.matchAll(/<a href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(links.length).toBe(5);
    links.forEach((link, index) => {
      expect(link[1]).toBe(chapterId(index));
      expect(link[2]).toContain(`<span class="ab-num">${CHAPTERS[index].numeral}</span>`);
      expect(link[2]).toContain(CHAPTERS[index].title);
      expect(html, link[1]).toContain(`id="${link[1]}"`);
    });
    expect(contents).not.toContain('-section-');
    expect(html).not.toContain('ab-notice');
  });

  test('a translated locale shows the notice and marks every chapter and contents link as English', () => {
    for (const locale of TRANSLATED_LOCALES) {
      const body = renderBookBody(toSteppeBookContent(locale, MESSAGES[locale]));
      expect(body, locale).toContain('<p class="ab-notice">');
      expect(body, locale).toContain(`<article class="anda-book" lang="${locale}">`);
      for (let index = 0; index < CHAPTERS.length; index += 1) {
        expect(body, locale).toContain(`aria-labelledby="${chapterId(index)}" lang="en"`);
        expect(body, locale).toContain(`<a href="#${chapterId(index)}" lang="en">`);
      }
    }
  });
});

describe('renderBookBody of the core book', () => {
  test('still holds the message, six pillars and the oath', () => {
    for (const locale of LOCALES) {
      const content = toBookContent(locale, MESSAGES[locale]);
      expect(content.kind).toBe('core');
      const html = renderBookBody(content);
      expect(html).toContain('id="anda-book-message"');
      expect(html).toContain('id="anda-book-oath"');
      for (let pillar = 1; pillar <= 6; pillar += 1) {
        expect(html, `${locale} pillar ${pillar}`).toContain(`id="anda-book-pillar-${pillar}"`);
      }
      expect(html).not.toContain('ab-notice');
      expect(html).not.toContain('ab-section-title');
    }
  });
});

describe('steppe messages', () => {
  test('the subtitle names chapters I to V in each locale', () => {
    const SUBTITLE: Record<BookLocale, string> = {
      en: 'Chapters I to V',
      nl: 'Hoofdstuk I tot en met V',
      tr: 'I ile V. Bölümler',
      ru: 'Главы с I по V',
    };
    for (const locale of LOCALES) {
      expect(section(MESSAGES[locale], 'steppe').subtitle, locale).toBe(SUBTITLE[locale]);
    }
  });

  test('the key set is identical in the four locales', () => {
    const expected = keysOf(section(MESSAGES.en, 'steppe'));
    expect(expected).toEqual(
      ['author', 'englishOnly', 'fileName', 'long', 'open', 'short', 'subtitle', 'title', 'year'].sort(),
    );
    for (const locale of LOCALES) {
      expect(keysOf(section(MESSAGES[locale], 'steppe')), locale).toEqual(expected);
    }
  });
});

describe('Books page copy', () => {
  const NAMES: Record<BookLocale, string> = { en: 'Books', nl: 'Boeken', tr: 'Kitaplar', ru: 'Книги' };
  const CORE_SHELF: Record<BookLocale, string> = {
    en: 'Core Literature',
    nl: 'Kernliteratuur',
    tr: 'Temel Eserler',
    ru: 'Основная литература',
  };
  const STORIES_SHELF: Record<BookLocale, string> = { en: 'Stories', nl: 'Verhalen', tr: 'Hikâyeler', ru: 'Истории' };
  const REMOVED_KEYS = ['heroTitle', 'heroDescription', 'booksTitle', 'booksIntro'];

  for (const locale of LOCALES) {
    test(`${locale}: menu entry and page titles are "${NAMES[locale]}"`, () => {
      const messages = MESSAGES[locale] as unknown as Json;
      expect((messages.nav as Json).book).toBe(NAMES[locale]);
      const boek = messages.boek as Json;
      expect(boek.metaTitle).toBe(NAMES[locale]);
      expect(boek.pageTitle).toBe(NAMES[locale]);
    });

    test(`${locale}: boek holds the shelf names and none of the removed keys`, () => {
      const boek = section(MESSAGES[locale], 'boek');
      expect(boek.coreShelf).toBe(CORE_SHELF[locale]);
      expect(boek.storiesShelf).toBe(STORIES_SHELF[locale]);
      for (const key of REMOVED_KEYS) {
        expect(Object.hasOwn(boek, key), `${locale} boek.${key}`).toBe(false);
      }
    });

    test(`${locale}: metaDescription is within ${META_DESCRIPTION_MAX_LENGTH} characters`, () => {
      const description = section(MESSAGES[locale], 'boek').metaDescription as string;
      expect(description.length).toBeGreaterThan(0);
      expect(description.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    });
  }

  test('the menu subtitle names both shelves in en', () => {
    expect(((enMessages as unknown as Json).nav as { descriptions: Json }).descriptions.book).toBe(
      'Core literature and stories',
    );
  });
});
