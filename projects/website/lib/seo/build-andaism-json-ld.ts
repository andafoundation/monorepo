import { getDiepteDocument, type DiepteDocument } from '@/content/diepte';
import { en as diepteEn } from '@/content/diepte/en';
import type { JsonLdEntity } from './json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl, ANDAISM_URL, localePath, toSiteLocale, type SiteLocale } from './site';

/**
 * Stable node id of Andaism, the tradition the foundation represents. Every
 * page renders the node once and the Organization, the WebSite, the Articles,
 * the Book and the poems reference it, so answer engines read the site, the
 * foundation, its texts and the tradition as one entity graph.
 */
export const ANDAISM_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'andaism' });

/** Stable node id of Mengü, the Eternal Sky, the central sacred concept of Andaism. */
export const MENGU_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'mengu' });

/** Stable node id of Tengrism, which the Diepte text names as a tradition Andaism resembles and draws on. */
export const TENGRISM_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'tengrism' });

/** The names Andaism is searched by in each language, its Diepte title among them. */
export const ANDAISM_NAMES: Record<SiteLocale, readonly string[]> = {
  en: [
    'Andaism',
    'Anda',
    'Anda philosophy',
    'Anda life philosophy',
    'Anda religion',
    'Philosophy of the Eternal Sky',
  ],
  nl: ['Andaïsme', 'Anda-filosofie', 'Anda levensfilosofie', 'Filosofie van de Eindeloze Hemel'],
  tr: ['Andaizm', 'Anda felsefesi', 'Anda yaşam felsefesi', 'Sonsuz Göğün Felsefesi'],
  ru: ['Андаизм', 'философия Анда'],
};

/** What its adherents are called; people search for the tradition by these words too. */
export const ANDAISM_ADHERENT_NAMES: readonly string[] = ['Andaist', 'Andaists'];

/** Mengü's other name, the Eternal Sky, as the Diepte text of each language writes it. */
const ETERNAL_SKY_NAMES: Record<SiteLocale, string> = {
  en: 'Eternal Sky',
  nl: 'Eindeloze Hemel',
  tr: 'Sonsuz Gökyüzü',
  ru: 'Бесконечное Небо',
};

/** Tengrism as the Diepte text of each language names it. */
const TENGRISM_NAMES: Record<SiteLocale, string> = {
  en: 'Tengrism',
  nl: 'Tengrisme',
  tr: 'Tengricilik',
  ru: 'Тенгрианство',
};

/** Tengrism's English Wikipedia article and its Wikidata item, which identify it for answer engines. */
const TENGRISM_SAME_AS: readonly string[] = [
  'https://en.wikipedia.org/wiki/Tengrism',
  'https://www.wikidata.org/wiki/Q837605',
];

const DIEPTE_SLUG = 'diepte';
const MENGU_SECTION_ANCHOR = 'mengu';

function plainText(text: string): string {
  return text.replace(/\*\*/g, '');
}

/** The first lead paragraph of a Diepte document as plain text, without its `**` emphasis marks. */
function leadDefinition(document: DiepteDocument): string {
  const first = document.lead.find((block) => block.type === 'paragraph');
  if (first?.type !== 'paragraph') {
    throw new Error(`The ${document.locale} Diepte text has no lead paragraph to define Andaism with`);
  }
  return plainText(first.text);
}

/** The first paragraph of the Mengü section of a Diepte document as plain text. */
function menguDefinition(document: DiepteDocument): string {
  const first = document.sections.mengu?.blocks.find((block) => block.type === 'paragraph');
  if (first?.type !== 'paragraph') {
    throw new Error(`The ${document.locale} Diepte text has no Mengü paragraph to define Mengü with`);
  }
  return plainText(first.text);
}

/** The language the Diepte text of a site locale is written in; English while a locale has no translation. */
function textLocale(locale: string): SiteLocale {
  return getDiepteDocument(locale).document.locale;
}

/**
 * The definition of Andaism in a locale: the opening paragraph of that
 * locale's Diepte text, so structured data and llms.txt say exactly what the
 * page says. A locale without its own text gets the English one.
 */
export function andaismDefinition(locale: string): string {
  return leadDefinition(getDiepteDocument(locale).document);
}

/** The English definition, the one llms.txt states. */
export const ANDAISM_DEFINITION_EN = leadDefinition(diepteEn);

/**
 * Every other name of Andaism for a page in `locale`: the names in the page's
 * language first, then the other languages and the adherent names, without
 * the `name` itself and without repeats.
 */
export function andaismAlternateNames(locale: string): string[] {
  const own = textLocale(locale);
  const name = getDiepteDocument(locale).document.title;
  const others = (Object.keys(ANDAISM_NAMES) as SiteLocale[]).filter((key) => key !== own);
  const all = [own, ...others].flatMap((key) => ANDAISM_NAMES[key]).concat(ANDAISM_ADHERENT_NAMES);
  return [...new Set(all)].filter((alternate) => alternate !== name);
}

/**
 * schema.org DefinedTerm for Andaism, rendered once per page by the locale
 * layout under the one shared `@id`. Its name, description and Diepte link are
 * in the page's language, so a page never mixes languages in one node; the
 * other languages' names are alternate names. DefinedTerm has no
 * `inLanguage`: the language is the one the page's WebPage and WebSite state.
 */
export function buildAndaismJsonLd(locale: string): JsonLdEntity {
  const { document } = getDiepteDocument(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': ANDAISM_JSON_LD_ID,
    name: document.title,
    alternateName: andaismAlternateNames(locale),
    description: leadDefinition(document),
    url: absoluteUrl(localePath(toSiteLocale(locale), DIEPTE_SLUG)),
    sameAs: [ANDAISM_URL],
  };
}

/**
 * schema.org DefinedTerm for Mengü, the Eternal Sky, described by the first
 * paragraph of the Diepte Mengü section. It is linked from the texts that
 * name it as one of their `mentions`, next to their `about` Andaism.
 */
export function buildMenguJsonLd(locale: string): JsonLdEntity {
  const { document } = getDiepteDocument(locale);
  const own = document.locale;
  const others = (Object.keys(ETERNAL_SKY_NAMES) as SiteLocale[]).filter((key) => key !== own);

  return {
    '@type': 'DefinedTerm',
    '@id': MENGU_JSON_LD_ID,
    name: 'Mengü',
    alternateName: [own, ...others].map((key) => ETERNAL_SKY_NAMES[key]),
    description: menguDefinition(document),
    url: `${absoluteUrl(localePath(toSiteLocale(locale), DIEPTE_SLUG))}#${MENGU_SECTION_ANCHOR}`,
  };
}

/**
 * Tengrism as a plain Thing that `sameAs` ties to Wikipedia and Wikidata, so
 * answer engines place Andaism next to a tradition they already know. Only a
 * text that names Tengrism lists it, as the Diepte text does in its
 * comparisons and influences.
 */
export function buildTengrismJsonLd(locale: string): JsonLdEntity {
  return {
    '@type': 'Thing',
    '@id': TENGRISM_JSON_LD_ID,
    name: TENGRISM_NAMES[textLocale(locale)],
    sameAs: [...TENGRISM_SAME_AS],
  };
}
