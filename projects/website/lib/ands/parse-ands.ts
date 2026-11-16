import type { And, AndLanguage, LineEmphasis } from './types';

export interface ParseAndsOptions {
  /** Year for date headers that name only a day and a month. */
  defaultYear: number;
}

const SEPARATOR = /^-{2,}$/;
const DATE_HEADER = /^ands\s+(.+)$/i;
const DATE_BODY = /^(?:(\d{1,2})\s+([a-z]+)|([a-z]+)\s+(\d{1,2}))(?:\s+(\d{4}))?$/i;
const VERSION_LABEL = /^V\d+(?:\.\d+)*:?$/;
const TITLE = /^#\s+(.+)$/;
const BOLD_LINE = /^\*\*(.+)\*\*$/;
const ITALIC_LINE = /^\*(.+)\*$/;
const WORD = /[a-zà-ÿğışœ]+/g;

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

// Words shared by two languages ("in", "was") are deliberately in no set, so they cannot tip the vote.
const STOP_WORDS: Record<AndLanguage, ReadonlySet<string>> = {
  nl: new Set('de het een ik zij ze en naar mijn dat niet van op met alsof maar wist'.split(' ')),
  tr: new Set('bir ben ile gibi kadar icin için ve sen oldum olalim var vardi sonsuz haydi olduk'.split(' ')),
  en: new Set('the i and there is to of my me that you we so but are what as all where'.split(' ')),
};

interface OpenEntry {
  version: string | null;
  date: string | null;
  title: string | null;
  lines: string[];
  emphasis: (LineEmphasis | null)[];
}

/** Splits a line marked `**line**` or `*line*` into its text and its emphasis. */
function readEmphasis(line: string): { text: string; emphasis: LineEmphasis | null } {
  const bold = BOLD_LINE.exec(line);
  if (bold) return { text: bold[1], emphasis: 'bold' };
  const italic = ITALIC_LINE.exec(line);
  if (italic) return { text: italic[1], emphasis: 'italic' };
  return { text: line, emphasis: null };
}

function monthNumber(name: string): number | null {
  const lower = name.toLowerCase();
  const index = MONTH_NAMES.findIndex((month) => month === lower || month.slice(0, 3) === lower);
  return index === -1 ? null : index + 1;
}

/** Parses the text after "Ands" ("9 october", "Aug 3", "3 Jan 2027") into an ISO day, or null when it is not a date. */
function parseHeaderDate(rest: string, defaultYear: number): string | null {
  const match = DATE_BODY.exec(rest.trim());
  if (!match) return null;
  const day = Number(match[1] ?? match[4]);
  const month = monthNumber(match[2] ?? match[3]);
  const year = match[5] ? Number(match[5]) : defaultYear;
  if (month === null) return null;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Picks the language whose stop words occur most often; English on a tie or when nothing matches. */
export function detectLanguage(lines: readonly string[]): AndLanguage {
  const words = lines.join(' ').toLowerCase().match(WORD) ?? [];
  const scores: Record<AndLanguage, number> = { en: 0, nl: 0, tr: 0 };
  for (const word of words) {
    for (const language of Object.keys(STOP_WORDS) as AndLanguage[]) {
      if (STOP_WORDS[language].has(word)) scores[language] += 1;
    }
  }
  const best = Math.max(scores.en, scores.nl, scores.tr);
  if (best === 0 || scores.en === best) return 'en';
  if (scores.nl === best && scores.tr === best) return 'en';
  return scores.nl === best ? 'nl' : 'tr';
}

/**
 * Parses the hand-written Ands file into entries in file order.
 *
 * The author appends to the file by hand, so the accepted shapes are loose: separators of any length of
 * two or more hyphens, date headers in day-month or month-day order with any capitalisation, and version
 * labels with or without a trailing colon. A poem that follows a separator without a label still becomes
 * an entry, and a label with no text under it is dropped as a draft. A `# ` line before the first verse
 * line is the poem's title, and a line wrapped in `*` or `**` is set in italic or bold.
 */
export function parseAnds(text: string, options: ParseAndsOptions): And[] {
  const closed: OpenEntry[] = [];
  let open: OpenEntry | null = null;
  let currentDate: string | null = null;

  const close = (): void => {
    if (open === null) return;
    const { lines, emphasis } = open;
    while (lines.length > 0 && lines[0] === '') {
      lines.shift();
      emphasis.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
      emphasis.pop();
    }
    if (lines.length > 0) closed.push(open);
    open = null;
  };

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();

    if (SEPARATOR.test(line)) {
      close();
      continue;
    }

    const header = DATE_HEADER.exec(line);
    const headerDate = header ? parseHeaderDate(header[1], options.defaultYear) : null;
    if (headerDate !== null) {
      close();
      currentDate = headerDate;
      continue;
    }

    if (VERSION_LABEL.test(line)) {
      close();
      open = { version: line.replace(/:$/, ''), date: currentDate, title: null, lines: [], emphasis: [] };
      continue;
    }

    if (line === '') {
      open?.lines.push('');
      open?.emphasis.push(null);
      continue;
    }

    if (open === null) open = { version: null, date: currentDate, title: null, lines: [], emphasis: [] };

    const title = TITLE.exec(line);
    if (title && open.title === null && open.lines.every((bodyLine) => bodyLine === '')) {
      open.title = title[1];
      continue;
    }

    const { text: bodyText, emphasis } = readEmphasis(line);
    open.lines.push(bodyText);
    open.emphasis.push(emphasis);
  }
  close();

  const ordinals = new Map<string, number>();
  return closed.map((entry) => {
    const key = entry.date ?? 'undated';
    const ordinal = (ordinals.get(key) ?? 0) + 1;
    ordinals.set(key, ordinal);
    const and: And = {
      id: `${key}-${ordinal}`,
      version: entry.version,
      date: entry.date,
      ordinal,
      title: entry.title,
      lines: entry.lines,
      language: detectLanguage(entry.lines),
    };
    if (entry.emphasis.some((emphasis) => emphasis !== null)) and.emphasis = entry.emphasis;
    return and;
  });
}
