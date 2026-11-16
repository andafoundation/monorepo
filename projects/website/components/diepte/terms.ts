import type { DiepteBlock, DiepteDocument, DiepteSectionId } from '@/content/diepte';

export type DiepteTerm = { term: string; sectionId: DiepteSectionId };

/**
 * Proper nouns of Andaism that have a section of their own. The single word
 * "And" is left out on purpose: it opens sentences in English and is a common
 * word, so linking it would mostly produce false links.
 */
export const DIEPTE_TERMS: readonly DiepteTerm[] = [
  { term: 'Mengü', sectionId: 'mengu' },
  { term: 'Ands', sectionId: 'ands' },
  { term: 'Anda', sectionId: 'becoming-anda' },
  { term: 'Onba', sectionId: 'onba' },
  { term: 'Gökevi', sectionId: 'gokevi' },
  { term: 'Esen', sectionId: 'etymology' },
];

/**
 * The two inline forms of the text: `**x**` emphasis and `[x](#id)` links.
 * Both are protected from term linking, so a term is never linked inside
 * emphasis and a link is never nested in another.
 */
export const DIEPTE_INLINE_MARKUP = /(\*\*[^*]+\*\*|\[[^\]]+\]\(#[a-z-]+\))/;

const EMPHASIS = /^\*\*([^*]+)\*\*$/;

/**
 * Whole-word match with Unicode-aware lookarounds: `\b` treats `ü` as a word
 * boundary, so `Mengü` would never match at a word end. An apostrophe suffix
 * such as the Turkish `’ye` is not a letter and stays outside the match.
 * Built with `new RegExp` because the site's TypeScript target predates
 * lookbehind and `\p{...}` in regex literals.
 */
function termPattern(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u');
}

const TERM_PATTERNS: readonly { term: DiepteTerm; pattern: RegExp }[] = DIEPTE_TERMS.map(
  (term) => ({ term, pattern: termPattern(term.term) }),
);

function sameText(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * The section an emphasised phrase names: a term of `DIEPTE_TERMS` or the
 * title of a section in this locale, compared case-insensitively.
 */
export function sectionIdForEmphasis(
  text: string,
  document: DiepteDocument,
): DiepteSectionId | undefined {
  const term = DIEPTE_TERMS.find((entry) => sameText(entry.term, text));
  if (term) {
    return term.sectionId;
  }

  const titled = (Object.keys(document.sections) as DiepteSectionId[]).find((id) => {
    const section = document.sections[id];
    return section !== null && sameText(section.title, text);
  });
  return titled;
}

function blockStrings(block: DiepteBlock): string[] {
  switch (block.type) {
    case 'paragraph':
      return [block.text];
    case 'quote':
      return block.lines;
    case 'list':
      return block.items;
  }
}

function withStrings(block: DiepteBlock, strings: string[]): DiepteBlock {
  switch (block.type) {
    case 'paragraph':
      return { ...block, text: strings[0] };
    case 'quote':
      return { ...block, lines: strings };
    case 'list':
      return { ...block, items: strings };
  }
}

/**
 * Wraps the first match of `pattern` outside the protected markup of `text`
 * as a link, or returns undefined when the plain text has no match.
 */
function linkFirstMatch(text: string, pattern: RegExp, sectionId: DiepteSectionId): string | undefined {
  const pieces = text.split(DIEPTE_INLINE_MARKUP);

  for (let index = 0; index < pieces.length; index += 1) {
    const piece = pieces[index];
    if (DIEPTE_INLINE_MARKUP.test(piece)) {
      continue;
    }

    const match = pattern.exec(piece);
    if (match) {
      const start = match.index;
      const end = start + match[0].length;
      pieces[index] = `${piece.slice(0, start)}[${match[0]}](#${sectionId})${piece.slice(end)}`;
      return pieces.join('');
    }
  }

  return undefined;
}

/**
 * Links the first plain-text occurrence of each term in one section's blocks
 * to the term's section, as Wikipedia links a concept once rather than on
 * every mention. A term is not linked inside its own section, nor inside
 * `**...**`. When the section already emphasises the term, `DiepteInline`
 * renders that emphasis as the link, so the plain mentions stay unlinked and
 * the section still carries one link per term. Pass `null` for the lead,
 * which belongs to no section.
 */
export function linkFirstOccurrences(
  blocks: DiepteBlock[],
  sectionId: DiepteSectionId | null,
): DiepteBlock[] {
  const strings = blocks.map((block) => [...blockStrings(block)]);

  for (const { term, pattern } of TERM_PATTERNS) {
    if (term.sectionId === sectionId) {
      continue;
    }

    const emphasised = strings.some((group) =>
      group.some((text) =>
        text
          .split(DIEPTE_INLINE_MARKUP)
          .some((piece) => {
            const emphasis = EMPHASIS.exec(piece);
            return emphasis !== null && sameText(emphasis[1], term.term);
          }),
      ),
    );
    if (emphasised) {
      continue;
    }

    linking: for (const group of strings) {
      for (let index = 0; index < group.length; index += 1) {
        const linked = linkFirstMatch(group[index], pattern, term.sectionId);
        if (linked !== undefined) {
          group[index] = linked;
          break linking;
        }
      }
    }
  }

  return blocks.map((block, index) => withStrings(block, strings[index]));
}
