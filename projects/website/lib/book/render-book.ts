import type { BookChapter, BookContent, BookSection, NarrativeChapter } from './book-content';
import { BOOK_CSS, STANDALONE_CSS } from './book-styles';

/*
 * The book is rendered as a plain HTML string so that one renderer serves both
 * the overlay (through dangerouslySetInnerHTML) and the standalone file served
 * by a route handler, where React DOM is not available. Every message string
 * passes through escapeHtml, which is what makes the innerHTML use safe.
 */

type CoreBookContent = Extract<BookContent, { kind: 'core' }>;
type NarrativeBookContent = Extract<BookContent, { kind: 'narrative' }>;

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const NUMBERED_ITEM = /^(\d+)\.\s+/;

// Lines 3 to 5 of the message ("This philosophy is also a covenant. But not
// with another. But with yourself.") are its turning point and read as verse.
const MESSAGE_VERSE_START = 2;
const MESSAGE_VERSE_END = 5;

const CONTENTS_ID = 'anda-book-contents';
const PILLARS_ID = 'anda-book-pillars';

const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Public+Sans:wght@400;500;600&display=swap';

const SKY_ORNAMENT = `<svg class="ab-sky" viewBox="0 0 120 84" fill="none" aria-hidden="true" focusable="false">
<circle cx="60" cy="36" r="17" stroke="currentColor" stroke-width="1.3"/>
<circle cx="60" cy="36" r="25" stroke="currentColor" stroke-width="0.6" opacity="0.35"/>
<circle cx="60" cy="36" r="3" fill="rgb(242 193 98)"/>
<path d="M6 68H114" stroke="rgb(242 193 98)" stroke-width="1"/>
<path d="M26 76H94" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
<circle cx="18" cy="14" r="1.2" fill="currentColor" opacity="0.5"/>
<circle cx="102" cy="10" r="1.4" fill="currentColor" opacity="0.6"/>
<circle cx="96" cy="44" r="1" fill="currentColor" opacity="0.4"/>
<circle cx="24" cy="48" r="1" fill="currentColor" opacity="0.4"/>
</svg>`;

const RULE = '<div class="ab-rule" aria-hidden="true"><span></span></div>';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function paragraph(text: string, className?: string): string {
  const classAttribute = className ? ` class="${className}"` : '';
  return `<p${classAttribute}>${escapeHtml(text)}</p>`;
}

/** Renders lines as paragraphs; consecutive "1. ..." lines become one ordered list. */
function renderLines(lines: string[], firstLineClass?: string): string {
  const parts: string[] = [];
  let listItems: string[] = [];
  let listStart = 1;

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    const startAttribute = listStart === 1 ? '' : ` start="${listStart}"`;
    parts.push(`<ol class="ab-list"${startAttribute}>${listItems.join('')}</ol>`);
    listItems = [];
  };

  lines.forEach((line, index) => {
    const numbered = NUMBERED_ITEM.exec(line);
    if (numbered) {
      if (listItems.length === 0) {
        listStart = Number(numbered[1]);
      }
      listItems.push(`<li>${escapeHtml(line.slice(numbered[0].length))}</li>`);
      return;
    }
    flushList();
    parts.push(paragraph(line, index === 0 ? firstLineClass : undefined));
  });
  flushList();

  return parts.join('\n');
}

function chapterHeading(
  chapter: { id: string; title: string },
  level: 'h2' | 'h3',
  numeral?: string,
): string {
  const numeralHtml = numeral ? `<span class="ab-numeral">${numeral}</span>` : '';
  return `${RULE}<${level} class="ab-chapter-title" id="${chapter.id}" tabindex="-1">${numeralHtml}${escapeHtml(chapter.title)}</${level}>`;
}

function renderNotice(notice: string | undefined): string {
  return notice ? `\n<p class="ab-notice">${escapeHtml(notice)}</p>` : '';
}

function renderCover(content: BookContent): string {
  return `<header class="ab-cover">
${SKY_ORNAMENT}
<p class="ab-eyebrow">${escapeHtml(content.subtitle)}</p>
<h1 class="ab-title">${escapeHtml(content.title)}</h1>
<p class="ab-byline">${escapeHtml(content.author)}</p>
<p class="ab-year">${escapeHtml(content.year)}</p>${renderNotice(content.notice)}
</header>`;
}

type ContentsEntry = { href: string; label: string; numeral?: string; lang?: string };

function contentsEntries(content: BookContent): ContentsEntry[] {
  if (content.kind === 'narrative') {
    return content.chapters.map((chapter, index) => ({
      href: chapter.id,
      label: chapter.title,
      numeral: ROMAN_NUMERALS[index],
      lang: chapter.lang,
    }));
  }
  return [
    { href: content.message.id, label: content.message.title },
    { href: PILLARS_ID, label: content.labels.pillars },
    { href: content.oath.id, label: content.oath.title },
  ];
}

function renderContents(content: BookContent): string {
  const entries = contentsEntries(content);
  const items = entries
    .map((entry) => {
      const langAttribute = entry.lang ? ` lang="${entry.lang}"` : '';
      const label = entry.numeral
        ? `<span class="ab-num">${entry.numeral}</span><span>${escapeHtml(entry.label)}</span>`
        : escapeHtml(entry.label);
      return `<li><a href="#${entry.href}"${langAttribute}>${label}</a></li>`;
    })
    .join('');

  return `<nav class="ab-toc" aria-labelledby="${CONTENTS_ID}">
${RULE}
<h2 class="ab-toc-title" id="${CONTENTS_ID}" tabindex="-1">${escapeHtml(content.labels.contents)}</h2>
<ol>${items}</ol>
</nav>`;
}

function renderMessage(chapter: BookChapter): string {
  const before = chapter.lines.slice(0, MESSAGE_VERSE_START);
  const verse = chapter.lines.slice(MESSAGE_VERSE_START, MESSAGE_VERSE_END);
  const after = chapter.lines.slice(MESSAGE_VERSE_END);

  return `<section class="ab-chapter" aria-labelledby="${chapter.id}">
${chapterHeading(chapter, 'h2')}
${renderLines(before, 'ab-dropcap')}
<div class="ab-verse">${verse.map((line) => paragraph(line)).join('')}</div>
${renderLines(after)}
</section>`;
}

function renderPillarsIndex(content: CoreBookContent): string {
  const items = content.pillars
    .map(
      (pillar, index) =>
        `<li><a href="#${pillar.id}"><span class="ab-num">${ROMAN_NUMERALS[index]}</span><span>${escapeHtml(pillar.title)}</span></a></li>`,
    )
    .join('');

  return `<section class="ab-chapter ab-toc" aria-labelledby="${PILLARS_ID}">
${RULE}
<h2 class="ab-toc-title ab-chapter-title" id="${PILLARS_ID}" tabindex="-1">${escapeHtml(content.labels.pillars)}</h2>
<ol>${items}</ol>
</section>`;
}

function renderPillar(chapter: BookChapter, index: number): string {
  return `<section class="ab-chapter" aria-labelledby="${chapter.id}">
${chapterHeading(chapter, 'h3', ROMAN_NUMERALS[index])}
${renderLines(chapter.lines, 'ab-lede')}
</section>`;
}

function renderOath(chapter: BookChapter): string {
  const lastIndex = chapter.lines.length - 1;
  const lines = chapter.lines
    .map((line, index) => paragraph(line, index === lastIndex ? 'ab-oath-final' : undefined))
    .join('\n');

  return `<section class="ab-chapter" aria-labelledby="${chapter.id}">
${chapterHeading(chapter, 'h2')}
<div class="ab-oath">${lines}</div>
</section>`;
}

// A sub-heading has no rule and no numeral: it sits inside the chapter and
// must read as part of it, not as a chapter of its own.
function renderSection(section: BookSection, index: number): string {
  const lines = renderLines(section.lines, index === 0 ? 'ab-dropcap' : undefined);
  if (section.heading === undefined) {
    return lines;
  }
  const idAttribute = section.id ? ` id="${section.id}" tabindex="-1"` : '';
  return `<h3 class="ab-chapter-title ab-section-title"${idAttribute}>${escapeHtml(section.heading)}</h3>
${lines}`;
}

function renderNarrativeChapter(chapter: NarrativeChapter, index: number): string {
  const langAttribute = chapter.lang ? ` lang="${chapter.lang}"` : '';
  return `<section class="ab-chapter" aria-labelledby="${chapter.id}"${langAttribute}>
${chapterHeading(chapter, 'h2', ROMAN_NUMERALS[index])}
${chapter.sections.map(renderSection).join('\n')}
</section>`;
}

function renderColophon(content: BookContent): string {
  return `<footer class="ab-colophon">
${RULE}
<p class="ab-colophon-title">${escapeHtml(content.title)}</p>
<p>${escapeHtml(content.author)} · ${escapeHtml(content.year)}</p>
<p>${escapeHtml(content.labels.colophon)}</p>
</footer>`;
}

function renderCoreBody(content: CoreBookContent): string {
  return `<article class="anda-book" lang="${content.locale}">
${renderCover(content)}
${renderContents(content)}
${renderMessage(content.message)}
${renderPillarsIndex(content)}
${content.pillars.map(renderPillar).join('\n')}
${renderOath(content.oath)}
${renderColophon(content)}
</article>`;
}

function renderNarrativeBody(content: NarrativeBookContent): string {
  return `<article class="anda-book" lang="${content.locale}">
${renderCover(content)}
${renderContents(content)}
${content.chapters.map(renderNarrativeChapter).join('\n')}
${renderColophon(content)}
</article>`;
}

/** The book itself, without a document around it. */
export function renderBookBody(content: BookContent): string {
  return content.kind === 'core' ? renderCoreBody(content) : renderNarrativeBody(content);
}

/**
 * The book as one self-contained document. Apart from the optional Google
 * Fonts link it references nothing, so a saved copy opens offline.
 */
export function renderBookHtml(content: BookContent, options: { standalone: true }): string {
  const title = escapeHtml(content.title);
  const standaloneCss = options.standalone ? STANDALONE_CSS : '';

  return `<!doctype html>
<html lang="${content.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="description" content="${escapeHtml(content.subtitle)}">
<meta name="color-scheme" content="light">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${GOOGLE_FONTS_HREF}">
<style>${BOOK_CSS}${standaloneCss}</style>
</head>
<body>
${renderBookBody(content)}
</body>
</html>
`;
}
