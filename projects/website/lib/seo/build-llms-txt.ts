import { DIEPTE_PARTS, type DiepteBlock, type DiepteDocument } from '@/content/diepte';
import type { And } from '@/lib/ands/types';
import { ANDAISM_DEFINITION_EN } from './build-andaism-json-ld';
import { andCanonicalPath, andText } from './build-poem-json-ld';
import { SEO_PAGES, type SeoPage, type SeoPageSection } from './pages';
import {
  absoluteUrl,
  ANDAISM_URL,
  FOUNDER,
  localePath,
  ORGANIZATION_ADDRESS,
  ORGANIZATION_EMAIL,
  ORGANIZATION_LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
} from './site';

/**
 * llms.txt is written in English and links the English pages, so an answer
 * engine reads one language. The poems keep their own language and link their
 * one canonical URL, which is not always English.
 */
const LLMS_LOCALE = 'en';

const LLMS_TXT_PATH = '/llms.txt';
const LLMS_FULL_TXT_PATH = '/llms-full.txt';
const SITEMAP_PATH = '/sitemap.xml';
const BOOK_HTML_SLUG = 'boek/html';
const STEPPE_HTML_SLUG = 'boek/steppe/html';
const DIEPTE_SLUG = 'diepte';

/** The site's messages for one locale, as `messages/en.json` is imported. */
export type LlmsMessages = Readonly<Record<string, unknown>>;

export interface BuildLlmsTxtInput {
  /** `messages/en.json`. */
  messages: LlmsMessages;
  /** Every poem in reading order, `getAnds()`. */
  ands: readonly And[];
}

export interface BuildLlmsFullTxtInput extends BuildLlmsTxtInput {
  /** The English Diepte text, `content/diepte/en.ts`. */
  diepte: DiepteDocument;
}

/** Page groups in the order llms.txt lists them; the home page leads the texts. */
const PAGE_SECTIONS: readonly { heading: string; sections: readonly SeoPageSection[] }[] = [
  { heading: 'Texts', sections: ['home', 'texts'] },
  { heading: 'Foundation', sections: ['foundation'] },
  { heading: 'Policies', sections: ['legal'] },
];

/**
 * A message by its dotted key. A missing or empty key throws: the route
 * handlers are prerendered, so the build fails instead of publishing a file
 * that names a page without its title.
 */
function messageText(messages: LlmsMessages, key: string): string {
  const value = key.split('.').reduce<unknown>((node, part) => {
    if (node !== null && typeof node === 'object' && Object.hasOwn(node, part)) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
  if (typeof value !== 'string' || value === '') {
    throw new Error(`messages/${LLMS_LOCALE}.json has no text at "${key}" for llms.txt`);
  }
  return value;
}

function escapeLinkText(text: string): string {
  return text.replace(/([[\]])/g, '\\$1');
}

function linkLine(title: string, url: string, description = ''): string {
  return `- [${escapeLinkText(title)}](${url})${description ? `: ${description}` : ''}`;
}

function pageUrl(slug: string): string {
  return absoluteUrl(localePath(LLMS_LOCALE, slug));
}

function pageLine(messages: LlmsMessages, page: SeoPage): string {
  return linkLine(
    messageText(messages, `${page.namespace}.${page.titleKey}`),
    pageUrl(page.path),
    messageText(messages, `${page.namespace}.${page.descriptionKey}`),
  );
}

/** The name the poems pages show for a poem: its title, else its version label, else its date, else "Poem {ordinal}". */
function andName(messages: LlmsMessages, and: And): string {
  return and.title ?? and.version ?? and.date ?? messageText(messages, 'poems.untitled').replace('{ordinal}', String(and.ordinal));
}

function andDetails(messages: LlmsMessages, and: And): string {
  const language = messageText(messages, `poems.language.${and.language}`);
  return and.date === null ? language : `${language}, ${and.date}`;
}

/**
 * The opening summary: what Andaism is, in the words of the Diepte text, and
 * that this site, its foundation and andaism.com all stand for it, so an
 * answer engine asked about Andaism finds the definition before anything else.
 */
function buildAndaismSummary(): string {
  return `${ANDAISM_DEFINITION_EN} Andaism is also called Anda or Anda philosophy. ${ORGANIZATION_LEGAL_NAME}, the Anda Foundation, represents it on this site, and ${ANDAISM_URL} points here.`;
}

function buildHeader(messages: LlmsMessages): string[] {
  const { streetAddress, postalCode, addressLocality } = ORGANIZATION_ADDRESS;
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${buildAndaismSummary()}`,
    '',
    `${ORGANIZATION_LEGAL_NAME}: ${messageText(messages, 'footer.shortMission')}`,
    '',
    `- Tradition: Andaism (also Anda, Anda philosophy), defined at ${pageUrl(DIEPTE_SLUG)}`,
    `- Foundation: ${ORGANIZATION_LEGAL_NAME}`,
    `- Founder: ${FOUNDER}`,
    `- Website: ${SITE_URL}, also reached at ${ANDAISM_URL}`,
    `- Address: ${streetAddress}, ${postalCode} ${addressLocality}, the Netherlands`,
    `- E-mail: ${ORGANIZATION_EMAIL}`,
    '- Languages: every page in English, Dutch, Turkish and Russian under /en, /nl, /tr and /ru; each poem only in the language it was written in',
  ];
}

function buildPageSections(messages: LlmsMessages): string[] {
  return PAGE_SECTIONS.flatMap(({ heading, sections }) => [
    '',
    `## ${heading}`,
    '',
    ...SEO_PAGES.filter((page) => sections.includes(page.section)).map((page) => pageLine(messages, page)),
  ]);
}

function buildBookSection(messages: LlmsMessages): string[] {
  return [
    '',
    '## Book',
    '',
    linkLine(
      messageText(messages, 'book.title'),
      pageUrl('boek'),
      `${messageText(messages, 'book.subtitle')} by ${messageText(messages, 'book.author')}, ${messageText(messages, 'book.year')}. ${messageText(messages, 'book.long')}`,
    ),
    linkLine(`${messageText(messages, 'book.title')} (single HTML file)`, pageUrl(BOOK_HTML_SLUG)),
    linkLine(
      messageText(messages, 'steppe.title'),
      pageUrl('boek'),
      `${messageText(messages, 'steppe.subtitle')} by ${messageText(messages, 'steppe.author')}, ${messageText(messages, 'steppe.year')}. ${messageText(messages, 'steppe.long')}`,
    ),
    linkLine(`${messageText(messages, 'steppe.title')} (single HTML file)`, pageUrl(STEPPE_HTML_SLUG)),
  ];
}

function buildPoemLinks(messages: LlmsMessages, ands: readonly And[]): string[] {
  return ands.map((and) => linkLine(andName(messages, and), absoluteUrl(andCanonicalPath(and)), andDetails(messages, and)));
}

function buildOptionalSection(sibling: { title: string; path: string }): string[] {
  return [
    '',
    '## Optional',
    '',
    linkLine(sibling.title, absoluteUrl(sibling.path)),
    linkLine('Sitemap', absoluteUrl(SITEMAP_PATH)),
  ];
}

function blockLines(block: DiepteBlock): string[] {
  switch (block.type) {
    case 'paragraph':
      return [block.text];
    case 'quote':
      return block.lines.map((line) => (line === '' ? '>' : `> ${line}`));
    case 'list':
      return block.items.map((item, index) => (block.ordered ? `${index + 1}. ${item}` : `- ${item}`));
  }
}

function blocksText(blocks: readonly DiepteBlock[]): string[] {
  return blocks.flatMap((block) => ['', ...blockLines(block)]);
}

/**
 * The Diepte text in full: the lead, then one heading per part and per
 * section shown in this language, each section with its anchor URL so an
 * answer engine can cite the exact place on the page.
 */
function buildDiepteFullSection(document: DiepteDocument): string[] {
  const parts = DIEPTE_PARTS.flatMap((part) => {
    const sections = part.sections.flatMap((section) => {
      const text = document.sections[section.id];
      return text === null
        ? []
        : [
            '',
            `${section.level === 3 ? '#####' : '####'} ${text.title}`,
            '',
            `URL: ${pageUrl(DIEPTE_SLUG)}#${section.id}`,
            ...blocksText(text.blocks),
          ];
    });
    return sections.length === 0 ? [] : ['', `### ${document.parts[part.id]}`, ...sections];
  });

  return ['', `## ${document.title}`, '', `URL: ${pageUrl(DIEPTE_SLUG)}`, ...blocksText(document.lead), ...parts];
}

/** Every poem in full: name, canonical URL, language and date, then the poem with its stanza breaks. */
function buildPoemsFullSection(messages: LlmsMessages, ands: readonly And[]): string[] {
  return [
    '',
    '## Poems',
    '',
    messageText(messages, 'poems.intro'),
    ...ands.flatMap((and) => [
      '',
      `### ${andName(messages, and)}`,
      '',
      `URL: ${absoluteUrl(andCanonicalPath(and))}`,
      `Language and date: ${andDetails(messages, and)}`,
      '',
      andText(and),
    ]),
  ];
}

/**
 * llms.txt in the llmstxt.org shape: H1, a blockquote that defines Andaism,
 * the foundation's mission and facts, then one link per page with its meta description, the
 * book, every poem by its canonical URL, and the optional links.
 */
export function buildLlmsTxt({ messages, ands }: BuildLlmsTxtInput): string {
  return [
    ...buildHeader(messages),
    ...buildPageSections(messages),
    ...buildBookSection(messages),
    '',
    '## Poems',
    '',
    messageText(messages, 'poems.intro'),
    '',
    ...buildPoemLinks(messages, ands),
    ...buildOptionalSection({ title: 'Full text of Andaism (Diepte) and of the poems', path: LLMS_FULL_TXT_PATH }),
    '',
  ].join('\n');
}

/**
 * llms-full.txt: the same header, pages and book, then the full English
 * Diepte reference text and the full text of every poem, so an answer engine
 * can quote Andaism and a poem without fetching each page.
 */
export function buildLlmsFullTxt({ messages, ands, diepte }: BuildLlmsFullTxtInput): string {
  return [
    ...buildHeader(messages),
    ...buildPageSections(messages),
    ...buildBookSection(messages),
    ...buildDiepteFullSection(diepte),
    ...buildPoemsFullSection(messages, ands),
    ...buildOptionalSection({ title: 'Summary (llms.txt)', path: LLMS_TXT_PATH }),
    '',
  ].join('\n');
}
