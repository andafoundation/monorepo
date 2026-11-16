import type { BookContent } from '@/lib/book/book-content';
import { ANDAISM_JSON_LD_ID } from './build-andaism-json-ld';
import type { JsonLdEntity } from './json-ld';
import { FOUNDER_JSON_LD_ID, ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildJsonLdId, type JsonLdFragment } from './json-ld-id';
import { absoluteUrl, CONTENT_LANGUAGES, localePath, OG_IMAGE, toSiteLocale } from './site';

/** Page slug of the single-file core book that `app/[locale]/boek/html/route.ts` serves. */
const BOOK_HTML_SLUG = 'boek/html';

/** `@id` fragment of the core book, the page's main entity. */
const BOOK_FRAGMENT: JsonLdFragment = 'book';

export interface BuildBookJsonLdInput {
  /**
   * The book's facts from `messages.book`, as `toBookContent` reads them. The
   * author is not among them: the founder's Person node from the Organization
   * is referenced instead, so the name is stated once.
   */
  book: Pick<BookContent, 'title' | 'subtitle' | 'year'>;
  /** The book's summary, `book.long`; omitted when empty. */
  description: string;
  locale: string;
  /** Site-relative canonical path of the book page, including its locale. */
  path: string;
  /**
   * `@id` fragment of this Book, `'book'` by default. The books page carries
   * several Book nodes, so every book but the core one needs its own fragment.
   */
  fragment?: JsonLdFragment;
  /** Page slug, without locale, of the book's single HTML file; `'boek/html'` by default. */
  htmlSlug?: string;
}

/**
 * schema.org Book for one of the foundation's books, the core book by default. The book is free to read on
 * the page and to download as one HTML file; that file is the
 * `associatedMedia`, so an answer engine can cite the readable text while the
 * file itself stays `noindex`. Every edition is about Andaism, the tradition
 * the book sets out, referenced by its shared `@id`.
 */
export function buildBookJsonLd({
  book,
  description,
  locale,
  path,
  fragment = BOOK_FRAGMENT,
  htmlSlug = BOOK_HTML_SLUG,
}: BuildBookJsonLdInput): JsonLdEntity {
  const siteLocale = toSiteLocale(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': buildJsonLdId({ path, fragment }),
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    ...(description ? { description } : {}),
    url: absoluteUrl(path),
    inLanguage: CONTENT_LANGUAGES[siteLocale],
    author: { '@id': FOUNDER_JSON_LD_ID },
    publisher: { '@id': ORGANIZATION_JSON_LD_ID },
    about: { '@id': ANDAISM_JSON_LD_ID },
    ...(book.year ? { datePublished: book.year } : {}),
    bookFormat: 'https://schema.org/EBook',
    isAccessibleForFree: true,
    image: absoluteUrl(OG_IMAGE.path),
    mainEntityOfPage: { '@id': buildJsonLdId({ path, fragment: 'webpage' }) },
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: absoluteUrl(localePath(siteLocale, htmlSlug)),
      encodingFormat: 'text/html',
      inLanguage: CONTENT_LANGUAGES[siteLocale],
    },
  };
}
