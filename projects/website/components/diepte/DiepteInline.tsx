import { Fragment } from 'react';

import type { DiepteDocument, DiepteSectionId } from '@/content/diepte';

import { DIEPTE_INLINE_MARKUP, sectionIdForEmphasis } from './terms';

const EMPHASIS = /^\*\*([^*]+)\*\*$/;
const LINK = /^\[([^\]]+)\]\(#([a-z-]+)\)$/;

/**
 * The link style of the whole article: Delft blue with an underline on hover,
 * and a visible ring for keyboard focus because the colour alone does not show
 * which link has focus.
 */
export const DIEPTE_LINK_CLASS =
  'rounded-sm text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const BOLD_CLASS = 'font-semibold text-ink';

type DiepteInlineProps = {
  text: string;
  /** The locale's document, needed to recognise emphasis that names a section title. */
  document: DiepteDocument;
  /** The section the text belongs to, or null for the lead. Emphasis never links to it. */
  sectionId: DiepteSectionId | null;
};

/**
 * Renders one string of the Diepte text. `**x**` emphasis and `[x](#id)`
 * links are the only inline syntax the content uses, so a split is enough and
 * no Markdown renderer is shipped for it. Emphasis that names another section
 * becomes a link to it, as Wikipedia links the bold terms of its articles.
 */
export default function DiepteInline({ text, document, sectionId }: DiepteInlineProps) {
  const pieces = text.split(DIEPTE_INLINE_MARKUP);

  return (
    <>
      {pieces.map((piece, index) => {
        const link = LINK.exec(piece);
        if (link) {
          return (
            <a key={index} href={`#${link[2]}`} className={DIEPTE_LINK_CLASS}>
              {link[1]}
            </a>
          );
        }

        const emphasis = EMPHASIS.exec(piece);
        if (emphasis) {
          const target = sectionIdForEmphasis(emphasis[1], document);
          if (target !== undefined && target !== sectionId) {
            return (
              <a key={index} href={`#${target}`} className={DIEPTE_LINK_CLASS}>
                {emphasis[1]}
              </a>
            );
          }
          return (
            <b key={index} className={BOLD_CLASS}>
              {emphasis[1]}
            </b>
          );
        }

        return <Fragment key={index}>{piece}</Fragment>;
      })}
    </>
  );
}
