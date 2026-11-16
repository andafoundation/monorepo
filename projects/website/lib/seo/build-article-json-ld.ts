import { DIEPTE_PARTS, type DiepteDocument } from '@/content/diepte';
import type { JsonLdEntity } from './json-ld';
import type { PageImage } from './metadata';
import { ORGANIZATION_JSON_LD_ID } from './build-organization-json-ld';
import { buildJsonLdId } from './json-ld-id';
import { absoluteUrl, CONTENT_LANGUAGES, OG_IMAGE, toSiteLocale } from './site';

/** Google shows at most this many headline characters and flags a longer Article headline. */
const ARTICLE_HEADLINE_MAX_LENGTH = 110;

export interface BuildArticleJsonLdInput {
  /** Site-relative canonical path of the page, including its locale. */
  path: string;
  headline: string;
  /** The page's meta description; omitted when empty. */
  description: string;
  /**
   * The language the text is written in. For Diepte this is
   * `getDiepteDocument(locale).document.locale`, which stays `en` on a locale
   * that still shows the English text.
   */
  locale: string;
  /** Words of the text as the page counts them; omitted when absent. */
  wordCount?: number;
  /** Section names in reading order; omitted when absent or empty. */
  articleSections?: readonly string[];
  /** Replaces the site's Open Graph image. */
  image?: PageImage;
  /** `@id` of the entity the text is about, such as Andaism for Diepte; omitted when absent. */
  aboutId?: string;
  /** Entities the text names besides its topic, such as Mengü and Tengrism in Diepte; omitted when absent or empty. */
  mentions?: readonly JsonLdEntity[];
}

function truncateHeadline(headline: string): string {
  return headline.length <= ARTICLE_HEADLINE_MAX_LENGTH
    ? headline
    : `${headline.slice(0, ARTICLE_HEADLINE_MAX_LENGTH - 1).trimEnd()}…`;
}

/**
 * schema.org Article for the foundation's own texts (Boodschap, Pilaren, Eed,
 * Diepte). Author and publisher are the foundation by `@id`: the pages name no
 * individual author. No dates are stated, because the pages show none.
 */
export function buildArticleJsonLd({
  path,
  headline,
  description,
  locale,
  wordCount,
  articleSections = [],
  image,
  aboutId,
  mentions = [],
}: BuildArticleJsonLdInput): JsonLdEntity {
  const articleImage = image ?? { url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': buildJsonLdId({ path, fragment: 'article' }),
    headline: truncateHeadline(headline),
    ...(description ? { description } : {}),
    url: absoluteUrl(path),
    inLanguage: CONTENT_LANGUAGES[toSiteLocale(locale)],
    mainEntityOfPage: { '@id': buildJsonLdId({ path, fragment: 'webpage' }) },
    author: { '@id': ORGANIZATION_JSON_LD_ID },
    publisher: { '@id': ORGANIZATION_JSON_LD_ID },
    isAccessibleForFree: true,
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(articleImage.url),
      width: articleImage.width,
      height: articleImage.height,
    },
    ...(wordCount !== undefined && wordCount > 0 ? { wordCount } : {}),
    ...(articleSections.length > 0 ? { articleSection: [...articleSections] } : {}),
    ...(aboutId ? { about: { '@id': aboutId } } : {}),
    ...(mentions.length > 0 ? { mentions: [...mentions] } : {}),
  };
}

/** The Diepte parts in reading order, named in the document's own language, for `articleSections`. */
export function diepteArticleSections(document: DiepteDocument): string[] {
  return DIEPTE_PARTS.map((part) => document.parts[part.id]);
}
