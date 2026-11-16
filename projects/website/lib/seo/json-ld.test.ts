import { describe, expect, test } from 'bun:test';
import { getAnds } from '@/lib/ands/ands';
import type { And } from '@/lib/ands/types';
import { en as diepteEn } from '@/content/diepte/en';
import type { FoundationDocument } from '@/content/foundation/documents';
import {
  ANDAISM_DEFINITION_EN,
  ANDAISM_JSON_LD_ID,
  andaismAlternateNames,
  andaismDefinition,
  buildAndaismJsonLd,
  buildMenguJsonLd,
  buildTengrismJsonLd,
  MENGU_JSON_LD_ID,
  TENGRISM_JSON_LD_ID,
} from './build-andaism-json-ld';
import { buildArticleJsonLd, diepteArticleSections } from './build-article-json-ld';
import { buildBookJsonLd } from './build-book-json-ld';
import { buildBreadcrumbJsonLd } from './build-breadcrumb-json-ld';
import { buildDocumentListJsonLd } from './build-document-list-json-ld';
import { buildOrganizationJsonLd, FOUNDER_JSON_LD_ID, ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildPageJsonLd } from './build-page-json-ld';
import { andCanonicalPath, buildAndsListJsonLd, buildPoemJsonLd } from './build-poem-json-ld';
import { buildWebPageJsonLd } from './build-web-page-json-ld';
import { buildWebSiteJsonLd, WEBSITE_JSON_LD_ID } from './build-website-json-ld';
import { buildJsonLdId, getJsonLdId } from './json-ld-id';
import { serializeJsonLd } from './json-ld';
import { FOUNDER, SITE_URL } from './site';

const AND: And = {
  id: '2026-08-03-1',
  version: 'V3.1',
  date: '2026-08-03',
  ordinal: 1,
  title: null,
  lines: ['Eerste regel', '', 'Tweede strofe <b>'],
  language: 'nl',
};

type Json = Record<string, unknown>;

function ref(entity: Json, key: string): unknown {
  return (entity[key] as Json | undefined)?.['@id'];
}

describe('serializeJsonLd and ids', () => {
  test('serializeJsonLd escapes < so a script tag cannot close early', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });

  test('buildJsonLdId drops an existing fragment and getJsonLdId reads string ids only', () => {
    expect(buildJsonLdId({ path: '/nl/boek#x', fragment: 'book' })).toBe(`${SITE_URL}/nl/boek#book`);
    expect(getJsonLdId({ '@id': 'a' })).toBe('a');
    expect(getJsonLdId({ '@id': 1 })).toBeUndefined();
    expect(getJsonLdId(null)).toBeUndefined();
  });
});

describe('Organization and WebSite', () => {
  const organization = buildOrganizationJsonLd({ locale: 'en', description: 'About' });

  test('Organization has the stable id, the legal name and a founder node with its own id', () => {
    expect(organization['@type']).toBe('Organization');
    expect(organization['@id']).toBe(`${SITE_URL}/#organization`);
    expect(organization['@id']).toBe(ORGANIZATION_JSON_LD_ID);
    expect(organization.legalName).toBe('Stichting Anda');
    expect(organization.inLanguage).toBe('en');
    expect(organization.founder).toEqual({ '@type': 'Person', '@id': FOUNDER_JSON_LD_ID, name: FOUNDER });
    expect(FOUNDER_JSON_LD_ID).toBe(`${SITE_URL}/#founder`);
  });

  test('Organization states no placeholder facts', () => {
    const text = JSON.stringify(organization);
    expect(organization).not.toHaveProperty('telephone');
    expect(text).not.toMatch(/kvk|rsin|iban/i);
  });

  test('Organization links Andaism without taking its name: alternate names, sameAs andaism.com, knowsAbout and the definition', () => {
    expect(organization.alternateName).toEqual(['Anda Foundation', 'Anda Philosophy']);
    expect(organization.sameAs).toEqual(['https://andaism.com']);
    expect(ref(organization, 'knowsAbout')).toBe(ANDAISM_JSON_LD_ID);
    expect(organization.description).toBe(`About ${ANDAISM_DEFINITION_EN}`);
  });

  test('Organization description carries the definition in the page locale', () => {
    const dutch = buildOrganizationJsonLd({ locale: 'nl', description: 'Over' });
    expect(dutch.description).toBe(`Over ${andaismDefinition('nl')}`);
    expect(dutch.description).toContain('Andaïsme');
    expect(dutch.description).not.toContain('**');
  });

  test('WebSite is about Andaism by id', () => {
    expect(ref(buildWebSiteJsonLd({ locale: 'en' }), 'about')).toBe(ANDAISM_JSON_LD_ID);
  });

  test('WebSite names the Organization as publisher by id and has no SearchAction', () => {
    const website = buildWebSiteJsonLd({ locale: 'tr' });
    expect(website['@type']).toBe('WebSite');
    expect(website['@id']).toBe(WEBSITE_JSON_LD_ID);
    expect(ref(website, 'publisher')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(website.inLanguage).toBe('tr');
    expect(website).not.toHaveProperty('potentialAction');
  });
});

describe('Andaism', () => {
  const andaism = buildAndaismJsonLd('en');

  test('is one DefinedTerm with the shared id, the Diepte page and andaism.com', () => {
    expect(andaism['@type']).toBe('DefinedTerm');
    expect(andaism['@id']).toBe(`${SITE_URL}/#andaism`);
    expect(andaism['@id']).toBe(ANDAISM_JSON_LD_ID);
    expect(andaism.name).toBe('Andaism');
    expect(andaism.url).toBe(`${SITE_URL}/en/diepte`);
    expect(andaism.sameAs).toEqual(['https://andaism.com']);
    expect(andaism).not.toHaveProperty('inLanguage');
  });

  test('every locale keeps the same id and states name, description and link in its own language', () => {
    const expected: Record<string, [string, string]> = {
      en: ['Andaism', 'Andaism is a modern'],
      nl: ['Andaïsme', 'Het Andaïsme is een moderne'],
      tr: ['Andaizm', 'Andaizm, Mengü ya da Sonsuz Gökyüzü'],
      ru: ['Андаизм', 'Андаизм представляет собой'],
    };
    for (const [locale, [name, opening]] of Object.entries(expected)) {
      const node = buildAndaismJsonLd(locale);
      expect(node['@id']).toBe(ANDAISM_JSON_LD_ID);
      expect(node.name).toBe(name);
      expect((node.description as string).startsWith(opening)).toBe(true);
      expect(node.description).toBe(andaismDefinition(locale));
      expect(node.url).toBe(`${SITE_URL}/${locale}/diepte`);
    }
  });

  test('lists the names of the page language first, then the other languages and the adherents, without its name', () => {
    expect(andaism.alternateName).toEqual([
      'Anda',
      'Anda philosophy',
      'Anda life philosophy',
      'Anda religion',
      'Philosophy of the Eternal Sky',
      'Andaïsme',
      'Anda-filosofie',
      'Anda levensfilosofie',
      'Filosofie van de Eindeloze Hemel',
      'Andaizm',
      'Anda felsefesi',
      'Anda yaşam felsefesi',
      'Sonsuz Göğün Felsefesi',
      'Андаизм',
      'философия Анда',
      'Andaist',
      'Andaists',
    ]);
    const turkish = andaismAlternateNames('tr');
    expect(turkish.slice(0, 3)).toEqual(['Anda felsefesi', 'Anda yaşam felsefesi', 'Sonsuz Göğün Felsefesi']);
    expect(turkish).not.toContain('Andaizm');
    expect(turkish).toContain('Andaism');
  });

  test('is described by the first Diepte paragraph as plain text and has no em-dash', () => {
    const description = andaism.description as string;
    expect(description.startsWith('Andaism is a modern religious and philosophical tradition centered on Mengü, the Eternal Sky.')).toBe(true);
    expect(description).not.toContain('**');
    expect(JSON.parse(serializeJsonLd(andaism))).toEqual(andaism);
    for (const locale of ['en', 'nl', 'tr', 'ru']) {
      expect(serializeJsonLd(buildAndaismJsonLd(locale))).not.toContain('\u2014');
    }
  });

  test('Mengü is a DefinedTerm with the Eternal Sky as alternate name, described by the Diepte Mengü section', () => {
    const mengu = buildMenguJsonLd('nl');
    expect(mengu['@type']).toBe('DefinedTerm');
    expect(mengu['@id']).toBe(MENGU_JSON_LD_ID);
    expect(mengu.name).toBe('Mengü');
    expect((mengu.alternateName as string[])[0]).toBe('Eindeloze Hemel');
    expect(mengu.alternateName).toContain('Eternal Sky');
    expect(mengu.url).toBe(`${SITE_URL}/nl/diepte#mengu`);
    expect(buildMenguJsonLd('en').description).toBe(
      'Mengü, the Eternal Sky, is the central sacred concept in Andaism. It is not simply the physical sky, but the name for endlessness itself.',
    );
  });

  test('Tengrism is a Thing tied to Wikipedia and Wikidata, named in the page language', () => {
    const tengrism = buildTengrismJsonLd('tr');
    expect(tengrism['@type']).toBe('Thing');
    expect(tengrism['@id']).toBe(TENGRISM_JSON_LD_ID);
    expect(tengrism.name).toBe('Tengricilik');
    expect(tengrism.sameAs).toEqual(['https://en.wikipedia.org/wiki/Tengrism', 'https://www.wikidata.org/wiki/Q837605']);
    expect(buildTengrismJsonLd('en').name).toBe('Tengrism');
  });
});

describe('WebPage, BreadcrumbList and page composition', () => {
  test('WebPage links the website and publisher by id and adds about only when asked', () => {
    const page = buildWebPageJsonLd({ type: 'CollectionPage', path: '/nl/ands', name: 'Ands', description: 'd', locale: 'nl' });
    expect(page['@type']).toBe('CollectionPage');
    expect(page['@id']).toBe(`${SITE_URL}/nl/ands#webpage`);
    expect(page.url).toBe(`${SITE_URL}/nl/ands`);
    expect(ref(page, 'isPartOf')).toBe(WEBSITE_JSON_LD_ID);
    expect(ref(page, 'publisher')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(page).not.toHaveProperty('about');

    const home = buildWebPageJsonLd({
      type: 'WebPage',
      path: '/nl',
      name: 'Anda',
      description: 'd',
      locale: 'nl',
      aboutId: ORGANIZATION_JSON_LD_ID,
      primaryImage: { url: '/og-image-yurt.png', width: 1200, height: 630 },
    });
    expect(ref(home, 'about')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(home.primaryImageOfPage).toMatchObject({ url: `${SITE_URL}/og-image-yurt.png`, width: 1200 });
  });

  test('BreadcrumbList numbers items from 1 with absolute urls', () => {
    const crumbs = buildBreadcrumbJsonLd({
      path: '/nl/boek',
      items: [
        { name: 'Anda', path: '/nl' },
        { name: 'Boek', path: '/nl/boek' },
      ],
    });
    expect(crumbs['@type']).toBe('BreadcrumbList');
    expect(crumbs['@id']).toBe(`${SITE_URL}/nl/boek#breadcrumb`);
    expect(crumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Anda', item: `${SITE_URL}/nl` },
      { '@type': 'ListItem', position: 2, name: 'Boek', item: `${SITE_URL}/nl/boek` },
    ]);
  });

  test('buildPageJsonLd returns [breadcrumb, mainEntity, WebPage] with the WebPage pointing at both ids', () => {
    const breadcrumb = buildBreadcrumbJsonLd({ path: '/nl/boek', items: [{ name: 'Anda', path: '/nl' }] });
    const mainEntity = buildBookJsonLd({ book: { title: 'T', subtitle: 'S', year: '2026' }, description: 'd', locale: 'nl', path: '/nl/boek' });
    const [first, second, third] = buildPageJsonLd({
      type: 'ItemPage',
      path: '/nl/boek',
      name: 'Boek',
      description: 'd',
      locale: 'nl',
      breadcrumb,
      mainEntity,
    }) as Json[];
    expect(first).toBe(breadcrumb);
    expect(second).toBe(mainEntity);
    expect(third['@type']).toBe('ItemPage');
    expect(ref(third, 'breadcrumb')).toBe(breadcrumb['@id']);
    expect(ref(third, 'mainEntity')).toBe(mainEntity['@id']);
  });

  test('without a breadcrumb or entity the nulls stay in place and mainEntityId is used', () => {
    const [first, second, third] = buildPageJsonLd({
      type: 'ContactPage',
      path: '/nl/contact',
      name: 'Contact',
      description: 'd',
      locale: 'nl',
      mainEntityId: ORGANIZATION_JSON_LD_ID,
    }) as (Json | null)[];
    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(third).not.toHaveProperty('breadcrumb');
    expect(ref(third as Json, 'mainEntity')).toBe(ORGANIZATION_JSON_LD_ID);
  });
});

describe('Article', () => {
  test('links author, publisher and the page by id and cuts a long headline at 110 characters', () => {
    const article = buildArticleJsonLd({
      path: '/en/diepte',
      headline: 'x'.repeat(200),
      description: 'd',
      locale: 'en',
      wordCount: 1200,
      articleSections: ['A', 'B'],
    });
    expect(article['@type']).toBe('Article');
    expect(article['@id']).toBe(`${SITE_URL}/en/diepte#article`);
    expect((article.headline as string).length).toBeLessThanOrEqual(110);
    expect(ref(article, 'author')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(ref(article, 'publisher')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(ref(article, 'mainEntityOfPage')).toBe(`${SITE_URL}/en/diepte#webpage`);
    expect(article.wordCount).toBe(1200);
    expect(article.articleSection).toEqual(['A', 'B']);
  });

  test('a short headline is kept and empty optionals are omitted', () => {
    const article = buildArticleJsonLd({ path: '/en/diepte', headline: 'Short', description: '', locale: 'en' });
    expect(article.headline).toBe('Short');
    expect(article).not.toHaveProperty('description');
    expect(article).not.toHaveProperty('wordCount');
    expect(article).not.toHaveProperty('articleSection');
    expect(article).not.toHaveProperty('about');
    expect(article).not.toHaveProperty('mentions');
  });

  test('names the entity the text is about by id', () => {
    const article = buildArticleJsonLd({
      path: '/en/diepte',
      headline: 'Andaism',
      description: '',
      locale: 'en',
      aboutId: ANDAISM_JSON_LD_ID,
      mentions: [buildMenguJsonLd('en'), buildTengrismJsonLd('en')],
    });
    expect(ref(article, 'about')).toBe(ANDAISM_JSON_LD_ID);
    expect((article.mentions as Json[]).map((entity) => entity['@id'])).toEqual([MENGU_JSON_LD_ID, TENGRISM_JSON_LD_ID]);
  });

  test('diepteArticleSections gives one name per part', () => {
    const sections = diepteArticleSections(diepteEn);
    expect(sections.length).toBeGreaterThan(0);
    for (const name of sections) {
      expect(typeof name).toBe('string');
      expect(name).not.toBe('');
    }
  });
});

describe('Poem CreativeWork and the poem lists', () => {
  const poem = buildPoemJsonLd({ and: AND, name: 'V3.1' });

  test('maps the And fields, with the poem language and the canonical path', () => {
    expect(andCanonicalPath(AND)).toBe('/nl/poems/2026-08-03-1');
    expect(poem['@type']).toBe('CreativeWork');
    expect(poem.genre).toBe('Poetry');
    expect(poem['@id']).toBe(`${SITE_URL}/nl/poems/2026-08-03-1#poem`);
    expect(poem.url).toBe(`${SITE_URL}/nl/poems/2026-08-03-1`);
    expect(poem.name).toBe('V3.1');
    expect(poem.text).toBe('Eerste regel\n\nTweede strofe <b>');
    expect(poem.inLanguage).toBe('nl');
    expect(poem.datePublished).toBe('2026-08-03');
    expect(poem.version).toBe('V3.1');
    expect(ref(poem, 'isPartOf')).toBe(`${SITE_URL}/nl/poems#itemlist`);
    expect(ref(poem, 'author')).toBe(ORGANIZATION_JSON_LD_ID);
  });

  test('inLanguage follows the poem, not the visitor', () => {
    expect(buildPoemJsonLd({ and: { ...AND, language: 'tr' }, name: 'n' }).inLanguage).toBe('tr');
  });

  test('is about Andaism by its shared id', () => {
    expect(ref(poem, 'about')).toBe(ANDAISM_JSON_LD_ID);
  });

  test('date and version are omitted when the And has none', () => {
    const undated = buildPoemJsonLd({ and: { ...AND, date: null, version: null }, name: 'n' });
    expect(undated).not.toHaveProperty('datePublished');
    expect(undated).not.toHaveProperty('version');
  });

  test('an ItemList links each poem by its canonical url and is null when empty', () => {
    const list = buildAndsListJsonLd({ items: [{ and: AND, name: 'V3.1' }], name: 'Ands', path: '/nl/ands' }) as Json;
    expect(list['@type']).toBe('ItemList');
    expect(list['@id']).toBe(`${SITE_URL}/nl/ands#itemlist`);
    expect(list.numberOfItems).toBe(1);
    expect(list.itemListElement).toEqual([{ '@type': 'ListItem', position: 1, name: 'V3.1', url: `${SITE_URL}/nl/poems/2026-08-03-1` }]);
    expect(buildAndsListJsonLd({ items: [], name: 'Ands', path: '/nl/ands' })).toBeNull();
  });

  test('every real And builds a poem whose id lives on its own canonical page', () => {
    for (const and of getAnds()) {
      expect(buildPoemJsonLd({ and, name: and.id })['@id']).toBe(`${SITE_URL}${andCanonicalPath(and)}#poem`);
    }
  });
});

describe('Book', () => {
  const book = buildBookJsonLd({
    book: { title: 'Titel', subtitle: 'Ondertitel', year: '2026' },
    description: 'Omschrijving',
    locale: 'nl',
    path: '/nl/boek',
  });

  test('references the founder and the Organization by @id instead of repeating them', () => {
    expect(book['@type']).toBe('Book');
    expect(book['@id']).toBe(`${SITE_URL}/nl/boek#book`);
    expect(book.author).toEqual({ '@id': FOUNDER_JSON_LD_ID });
    expect(ref(book, 'publisher')).toBe(ORGANIZATION_JSON_LD_ID);
    expect(ref(book, 'mainEntityOfPage')).toBe(`${SITE_URL}/nl/boek#webpage`);
  });

  test('every edition is about Andaism by its shared id', () => {
    for (const locale of ['en', 'nl', 'tr']) {
      const edition = buildBookJsonLd({ book: { title: 'T', subtitle: '', year: '' }, description: '', locale, path: `/${locale}/boek` });
      expect(ref(edition, 'about')).toBe(ANDAISM_JSON_LD_ID);
    }
  });

  test('is free, an e-book with the HTML edition as media, dated by its year', () => {
    expect(book.isAccessibleForFree).toBe(true);
    expect(book.bookFormat).toBe('https://schema.org/EBook');
    expect(book.datePublished).toBe('2026');
    expect(book.alternativeHeadline).toBe('Ondertitel');
    expect(book.associatedMedia).toMatchObject({ contentUrl: `${SITE_URL}/nl/boek/html`, encodingFormat: 'text/html' });
  });

  test('the default call keeps the #book fragment and the /boek/html edition', () => {
    expect(book['@id']).toMatch(/#book$/);
    expect((book.associatedMedia as Json).contentUrl).toBe(`${SITE_URL}/nl/boek/html`);
  });

  test('the steppe book gets its own fragment and its own HTML edition', () => {
    const steppe = buildBookJsonLd({
      book: { title: 'The Call of the Steppe', subtitle: 'Chapters I to V', year: '2026' },
      description: 'Omschrijving',
      locale: 'nl',
      path: '/nl/boek',
      fragment: 'steppe-book',
      htmlSlug: 'boek/steppe/html',
    });
    expect(steppe['@id']).toBe(`${SITE_URL}/nl/boek#steppe-book`);
    expect(steppe['@id']).not.toBe(book['@id']);
    expect((steppe.associatedMedia as Json).contentUrl).toBe(`${SITE_URL}/nl/boek/steppe/html`);
    expect(steppe.author).toEqual({ '@id': FOUNDER_JSON_LD_ID });
    expect(ref(steppe, 'about')).toBe(ANDAISM_JSON_LD_ID);
  });

  test('the founder id resolves to exactly one Person node in the Organization', () => {
    const founder = buildOrganizationJsonLd({ locale: 'nl', description: 'd' }).founder as Json;
    expect(founder['@id']).toBe((book.author as Json)['@id']);
  });
});

describe('document ItemList', () => {
  const documents: FoundationDocument[] = [
    {
      id: 'annual-accounts-2025',
      kind: 'annual-accounts',
      year: 2025,
      title: { en: 'Accounts', nl: 'Jaarrekening', tr: 'Hesap', ru: 'Отчет' },
      href: '/downloads/jaarrekening-2025.pdf',
    },
  ];

  test('returns null when the list is empty', () => {
    expect(buildDocumentListJsonLd({ documents: [], name: 'n', locale: 'nl', path: '/nl/jaarstukken' })).toBeNull();
  });

  test('lists localized DigitalDocuments with absolute urls and the PDF type', () => {
    const list = buildDocumentListJsonLd({ documents, name: 'n', locale: 'nl', path: '/nl/jaarstukken' }) as Json;
    expect(list['@type']).toBe('ItemList');
    expect(list['@id']).toBe(`${SITE_URL}/nl/jaarstukken#itemlist`);
    expect(list.numberOfItems).toBe(1);
    expect((list.itemListElement as Json[])[0]).toMatchObject({
      position: 1,
      item: {
        '@type': 'DigitalDocument',
        name: 'Jaarrekening',
        url: `${SITE_URL}/downloads/jaarrekening-2025.pdf`,
        temporalCoverage: '2025',
        encodingFormat: 'application/pdf',
      },
    });
  });
});
