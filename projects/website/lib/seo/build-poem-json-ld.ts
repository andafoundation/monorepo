import { isStandaloneOath } from '@/lib/ands/oaths';
import type { And } from '@/lib/ands/types';
import { ANDAISM_JSON_LD_ID } from './build-andaism-json-ld';
import type { JsonLdEntity } from './json-ld';
import { ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildJsonLdId } from './json-ld-id';
import { META_DESCRIPTION_MAX_LENGTH } from './metadata';
import { absoluteUrl, CONTENT_LANGUAGES, localePath } from './site';

/** Page slug of the poems collection, as in `lib/navigation.ts`; it lists every poem. */
const POEMS_SLUG = 'poems';

/** Page slug of the Ands page, as in `lib/navigation.ts`; it shows the oaths. */
const ANDS_SLUG = 'ands';

/**
 * The one canonical site path of a poem: its page in the poems collection, in
 * the locale that matches the poem's language. The text is never translated,
 * so the other locale URLs show the same words and point here instead of
 * forming an hreflang cluster, and an oath shown on the Ands page points here
 * too, so a poem never has two canonical pages.
 */
export function andCanonicalPath(and: Pick<And, 'id' | 'language'>): string {
  return localePath(and.language, `${POEMS_SLUG}/${and.id}`);
}

/**
 * The one canonical site path of an oath on the Ands page. An oath that is also a poem points at its poem
 * page; a standalone oath has no poem page, so its own stone in the locale of its language is canonical.
 */
export function oathCanonicalPath(oath: Pick<And, 'id' | 'language'>): string {
  return isStandaloneOath(oath.id) ? localePath(oath.language, `${ANDS_SLUG}/${oath.id}`) : andCanonicalPath(oath);
}

/** The poem text as one string: lines joined by newlines, a stanza break as an empty line. */
export function andText(and: Pick<And, 'lines'>): string {
  return and.lines.join('\n');
}

/**
 * The poem's first stanza on one line, cut to the snippet length search
 * engines show. Search results then quote the opening of the poem itself.
 */
export function andSnippet(and: Pick<And, 'lines'>): string {
  const breakIndex = and.lines.indexOf('');
  const stanza = (breakIndex === -1 ? and.lines : and.lines.slice(0, breakIndex))
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
  return stanza.length <= META_DESCRIPTION_MAX_LENGTH
    ? stanza
    : `${stanza.slice(0, META_DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`;
}

export interface BuildPoemJsonLdInput {
  and: And;
  /** The name the page shows for the And, such as its version label or "And 3". */
  name: string;
}

/**
 * Structured data for one And. schema.org has no Poem type, so the node is a
 * CreativeWork with the genre Poetry, which validators accept and answer
 * engines read as a poem. It is anchored on the And's canonical path, so the
 * same `@id` is emitted from every locale URL of the poem; it states the
 * poem's own language, never the locale of the page. Each And is an oath of
 * Andaism, so the poem is about Andaism by its shared `@id`.
 */
export function buildPoemJsonLd({ and, name }: BuildPoemJsonLdInput): JsonLdEntity {
  const path = andCanonicalPath(and);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': buildJsonLdId({ path, fragment: 'poem' }),
    genre: 'Poetry',
    name,
    text: andText(and),
    url: absoluteUrl(path),
    inLanguage: CONTENT_LANGUAGES[and.language],
    ...(and.date !== null ? { datePublished: and.date } : {}),
    ...(and.version !== null ? { version: and.version } : {}),
    author: { '@id': ORGANIZATION_JSON_LD_ID },
    publisher: { '@id': ORGANIZATION_JSON_LD_ID },
    about: { '@id': ANDAISM_JSON_LD_ID },
    isAccessibleForFree: true,
    mainEntityOfPage: { '@id': buildJsonLdId({ path, fragment: 'webpage' }) },
    isPartOf: { '@id': buildJsonLdId({ path: localePath(and.language, POEMS_SLUG), fragment: 'itemlist' }) },
  };
}

export interface AndsListJsonLdItem {
  and: And;
  /** The name the list shows for the And. */
  name: string;
  /** Site path the entry links; defaults to the poem's canonical path. */
  canonicalPath?: string;
}

export interface BuildAndsListJsonLdInput {
  /** Every And in the order the collection page lists them. */
  items: readonly AndsListJsonLdItem[];
  /** The collection's heading, `ands.title`. */
  name: string;
  /** Site-relative canonical path of the collection page, including its locale. */
  path: string;
}

/**
 * schema.org ItemList of the Ands for the collection page, each entry linking
 * the poem's canonical URL. Null when there are no Ands, so the page emits no
 * empty list.
 */
export function buildAndsListJsonLd({ items, name, path }: BuildAndsListJsonLdInput): JsonLdEntity | null {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': buildJsonLdId({ path, fragment: 'itemlist' }),
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.canonicalPath ?? andCanonicalPath(item.and)),
    })),
  };
}
