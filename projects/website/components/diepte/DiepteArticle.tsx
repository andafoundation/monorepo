import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SKYYURT_CONCEPT } from '@/components/site-images';
import {
  DIEPTE_SECTIONS,
  type DiepteBlock,
  type DiepteDocument,
  type DiepteSectionId,
} from '@/content/diepte';

import DiepteContents from './DiepteContents';
import DiepteFigure from './DiepteFigure';
import DiepteInfobox, { type DiepteInfoboxRow } from './DiepteInfobox';
import DiepteInline, { DIEPTE_LINK_CLASS } from './DiepteInline';
import { DIEPTE_SEE_ALSO_ID, type DiepteOutlineEntry } from './outline';
import { linkFirstOccurrences } from './terms';

/** Leaves room for the fixed header when the browser scrolls to a section's anchor. */
const SECTION_SCROLL_MARGIN = 'scroll-mt-28 lg:scroll-mt-32';

/** The section that carries the Skyyurt thumbnail, the one image of the running text. */
const FIGURE_SECTION: DiepteSectionId = 'gokevi';

/**
 * A heading next to a float shrinks to the free width instead of running its
 * rule under the infobox or the thumbnail, as on Wikipedia.
 */
const H2_CLASS =
  'overflow-hidden border-b border-primary/20 pb-1 text-2xl font-semibold leading-tight text-ink md:text-[1.75rem]';
const H3_CLASS =
  'overflow-hidden font-[family-name:var(--font-body)] text-lg font-semibold leading-snug text-ink';

type DiepteArticleProps = {
  document: DiepteDocument;
  translated: boolean;
  /** The page's language, for the labels that stay in it when the text falls back to English. */
  uiLang: string;
  outline: DiepteOutlineEntry[];
  infobox: { title: string; rows: DiepteInfoboxRow[]; imageAlt: string };
  seeAlso: { href: string; label: string }[];
  labels: {
    title: string;
    tagline: string;
    englishOnly: string;
    contents: string;
    backToTop: string;
    figureCaption: string;
  };
};

/**
 * The full Andaism text as a Wikipedia article, rendered on the server so the
 * client bundle never carries it.
 */
export default function DiepteArticle({
  document,
  translated,
  uiLang,
  outline,
  infobox,
  seeAlso,
  labels,
}: DiepteArticleProps) {
  const numbers = new Map(outline.map((entry) => [entry.id, entry]));
  const seeAlsoEntry = numbers.get(DIEPTE_SEE_ALSO_ID);

  return (
    <article lang={document.locale} className="flow-root">
      <header lang={uiLang}>
        <h1 className="text-3xl font-semibold leading-tight text-ink md:text-4xl">{labels.title}</h1>
        <p className="mt-1 text-sm text-ink/60">{labels.tagline}</p>
        <hr className="mt-3 border-t border-primary/20" />
        {!translated && (
          <p role="note" className="mt-3 pl-6 text-sm italic text-ink/70">
            {labels.englishOnly}
          </p>
        )}
      </header>

      <div className="mt-6">
        <DiepteInfobox
          title={infobox.title}
          rows={infobox.rows}
          imageAlt={infobox.imageAlt}
          lang={uiLang}
        />

        {linkFirstOccurrences(document.lead, null).map((block, index) => (
          <DiepteBlockView key={index} block={block} document={document} sectionId={null} />
        ))}

        <DiepteContents
          label={labels.contents}
          entries={outline}
          lang={uiLang}
          contentLang={document.locale}
        />

        {DIEPTE_SECTIONS.map((entry) => {
          const section = document.sections[entry.id];
          const number = numbers.get(entry.id)?.number;
          if (section === null || number === undefined) {
            return null;
          }

          const titleId = `${entry.id}-title`;
          const heading = (
            <>
              <span className="mr-2 text-primary/70">{number}</span>
              {section.title}
            </>
          );

          return (
            <section
              key={entry.id}
              id={entry.id}
              aria-labelledby={titleId}
              className={cn(SECTION_SCROLL_MARGIN, entry.level === 2 ? 'mt-10' : 'mt-8')}
            >
              {entry.level === 2 ? (
                <h2 id={titleId} className={H2_CLASS}>
                  {heading}
                </h2>
              ) : (
                <h3 id={titleId} className={H3_CLASS}>
                  {heading}
                </h3>
              )}
              {entry.id === FIGURE_SECTION && (
                <DiepteFigure
                  src={SKYYURT_CONCEPT.src}
                  alt={labels.figureCaption}
                  caption={labels.figureCaption}
                  width={SKYYURT_CONCEPT.width}
                  height={SKYYURT_CONCEPT.height}
                  lang={uiLang}
                />
              )}
              {linkFirstOccurrences(section.blocks, entry.id).map((block, index) => (
                <DiepteBlockView key={index} block={block} document={document} sectionId={entry.id} />
              ))}
            </section>
          );
        })}

        {seeAlsoEntry && (
          <section
            id={DIEPTE_SEE_ALSO_ID}
            lang={uiLang}
            aria-labelledby={`${DIEPTE_SEE_ALSO_ID}-title`}
            className={cn(SECTION_SCROLL_MARGIN, 'mt-10')}
          >
            <h2 id={`${DIEPTE_SEE_ALSO_ID}-title`} className={H2_CLASS}>
              <span className="mr-2 text-primary/70">{seeAlsoEntry.number}</span>
              {seeAlsoEntry.title}
            </h2>
            <ul className="mt-4 list-disc space-y-1 pl-6 marker:text-primary/60">
              {seeAlso.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={DIEPTE_LINK_CLASS}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p lang={uiLang} className="mt-10">
          <Button asChild variant="link" className="h-auto px-0 py-1">
            <a href="#top">{labels.backToTop}</a>
          </Button>
        </p>
      </div>
    </article>
  );
}

type DiepteBlockViewProps = {
  block: DiepteBlock;
  document: DiepteDocument;
  sectionId: DiepteSectionId | null;
};

function DiepteBlockView({ block, document, sectionId }: DiepteBlockViewProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mt-4">
          <DiepteInline text={block.text} document={document} sectionId={sectionId} />
        </p>
      );
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          className={cn(
            'mt-4 space-y-1 pl-6 marker:text-primary/60',
            block.ordered ? 'list-decimal' : 'list-disc',
          )}
        >
          {block.items.map((item, index) => (
            <li key={index}>
              <DiepteInline text={item} document={document} sectionId={sectionId} />
            </li>
          ))}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote lang={block.lang} className="my-6 border-l-4 border-primary/15 pl-6 pr-4 text-ink/85">
          <QuoteStanzas lines={block.lines} document={document} sectionId={sectionId} />
        </blockquote>
      );
  }
}

/** An empty line in a quote is a stanza break; the other lines keep their line breaks. */
function QuoteStanzas({
  lines,
  document,
  sectionId,
}: {
  lines: string[];
  document: DiepteDocument;
  sectionId: DiepteSectionId | null;
}) {
  const stanzas: string[][] = [[]];
  for (const line of lines) {
    if (line === '') {
      stanzas.push([]);
    } else {
      stanzas[stanzas.length - 1].push(line);
    }
  }

  return (
    <>
      {stanzas
        .filter((stanza) => stanza.length > 0)
        .map((stanza, stanzaIndex) => (
          <p key={stanzaIndex} className={stanzaIndex > 0 ? 'mt-4' : undefined}>
            {stanza.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                <DiepteInline text={line} document={document} sectionId={sectionId} />
              </span>
            ))}
          </p>
        ))}
    </>
  );
}
