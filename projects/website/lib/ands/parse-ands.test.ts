import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANDS_SOURCE } from './ands-source';
import { parseAnds } from './parse-ands';
import { filterAnds, languagesOf, monthsOf, neighbours, sortAnds } from './select';
import type { And } from './types';

const OPTIONS = { defaultYear: 2026 };

function parse(text: string): And[] {
  return parseAnds(text, OPTIONS);
}

describe('parseAnds on ands/ands.txt', () => {
  const source = readFileSync(join(import.meta.dir, '..', '..', 'ands', 'ands.txt'), 'utf8');
  const ands = sortAnds(parse(source));

  test('the generated ands-source.ts matches ands/ands.txt (run `bun run ands:source` after editing it)', () => {
    expect(ANDS_SOURCE).toBe(source);
  });

  test('parses 23 entries with date-ordinal ids in reading order', () => {
    expect(ands.map((and) => and.id)).toEqual([
      '2026-08-03-1', '2026-08-03-2', '2026-08-03-3',
      '2026-08-04-1',
      '2026-08-28-1', '2026-08-28-2',
      '2026-09-18-1', '2026-09-18-2',
      '2026-10-04-1',
      '2026-10-09-1', '2026-10-09-2',
      '2026-10-10-1', '2026-10-10-2', '2026-10-10-3',
      '2026-10-12-1', '2026-10-12-2',
      '2026-10-19-1', '2026-10-19-2', '2026-10-19-3',
      '2026-10-20-1',
      '2026-10-21-1',
      '2026-10-25-1',
      '2026-10-28-1',
    ]);
  });

  test('detects Dutch and Turkish texts and English for the rest', () => {
    const nonEnglish = Object.fromEntries(
      ands.filter((and) => and.language !== 'en').map((and) => [and.id, and.language]),
    );
    expect(nonEnglish).toEqual({
      '2026-10-09-2': 'nl',
      '2026-10-10-1': 'nl',
      '2026-10-10-2': 'tr',
      '2026-10-12-2': 'tr',
      '2026-10-28-1': 'tr',
    });
  });

  test('keeps labels without the colon and leaves unlabelled entries null', () => {
    const byId = new Map(ands.map((and) => [and.id, and]));
    expect(byId.get('2026-08-03-1')?.version).toBe('V3.1');
    expect(byId.get('2026-10-10-1')?.version).toBe('V10.10.26.1');
    expect(byId.get('2026-10-04-1')?.version).toBeNull();
    expect(byId.get('2026-10-09-2')?.version).toBeNull();
  });

  test('reads the 25 October poem as one English stanza of 11 lines', () => {
    const poem = ands.find((and) => and.id === '2026-10-25-1');
    expect(poem).toMatchObject({ version: 'V10.25.26.1', date: '2026-10-25', language: 'en' });
    expect(poem?.lines).toHaveLength(11);
    expect(poem?.lines[0]).toBe('today I am sad, so I am here');
    expect(poem?.lines[1]).toBe('today I am floating, as I wish');
    expect(poem?.lines[9]).toBe('I lie down watching the Eternal Sky,');
    expect(poem?.lines[10]).toBe('and feel a weight lifting off my shoulders');
  });

  test('reads the 28 October poem with its title, four italic lines and a bold last line', () => {
    const poem = ands.find((and) => and.id === '2026-10-28-1');
    expect(poem).toMatchObject({ version: 'V10.28.26.1', date: '2026-10-28', title: "Çünkü Mengü'm Var", language: 'tr' });
    expect(poem?.lines).toHaveLength(34);
    expect(poem?.lines[0]).toBe('Vardır evrenin bir bildiği,');
    expect(poem?.lines[25]).toBe('Bu yükü ben taşırım,');
    expect(poem?.lines[33]).toBe("Çünkü Mengü'm var, dedim.");
    expect(poem?.emphasis?.slice(25, 29)).toEqual(['italic', 'italic', 'italic', 'italic']);
    expect(poem?.emphasis?.[33]).toBe('bold');
    expect(poem?.emphasis?.filter((emphasis) => emphasis !== null)).toHaveLength(5);
  });

  test('drops the empty draft label', () => {
    expect(ands.some((and) => and.version === 'V12.10.26.3')).toBe(false);
  });

  test('no entry starts or ends with a blank line and only the 28 October poem has a title', () => {
    for (const and of ands) {
      expect(and.lines[0]).not.toBe('');
      expect(and.lines[and.lines.length - 1]).not.toBe('');
    }
    expect(ands.filter((and) => and.title !== null).map((and) => and.id)).toEqual(['2026-10-28-1']);
  });
});

describe('parseAnds rules', () => {
  test('separators of two and of 36 hyphens both close an entry', () => {
    const ands = parse(['Ands 1 Aug', 'one', '--', 'two', '-'.repeat(36), 'three'].join('\n'));
    expect(ands.map((and) => and.lines)).toEqual([['one'], ['two'], ['three']]);
  });

  test.each([
    ['ANds 9 october', '2026-10-09'],
    ['Ands Aug 3', '2026-08-03'],
    ['Ands 4 Aug', '2026-08-04'],
    ['Ands 3 Jan 2027', '2027-01-03'],
    ['ands September 18', '2026-09-18'],
  ])('date header %p is %p', (header, date) => {
    expect(parse(`${header}\npoem`)[0]?.date).toBe(date);
  });

  test('a line starting with "ands" that is not a date is body text', () => {
    const ands = parse('Ands 1 Aug\nands of the sky\nAnds 31 february');
    expect(ands).toHaveLength(1);
    expect(ands[0]?.lines).toEqual(['ands of the sky', 'Ands 31 february']);
  });

  test('a label with a colon keeps no colon', () => {
    expect(parse('Ands 10 october\nV10.10.26.1:\npoem')[0]?.version).toBe('V10.10.26.1');
  });

  test('two labels under one header get ordinals 1 and 2', () => {
    const ands = parse('Ands 12 october\nV1\nfirst\n\nV2\nsecond');
    expect(ands.map((and) => [and.id, and.ordinal, and.version])).toEqual([
      ['2026-10-12-1', 1, 'V1'],
      ['2026-10-12-2', 2, 'V2'],
    ]);
  });

  test('a poem after a separator without a label gets a null version and the current date', () => {
    const ands = parse('Ands 9 october\nfirst\n--\n\nZij stond in de maneschijn');
    expect(ands[1]).toMatchObject({ id: '2026-10-09-2', version: null, date: '2026-10-09' });
  });

  test('a label with no text is dropped', () => {
    const ands = parse('Ands 12 october\nV1\npoem\nV2:\n\n\n---');
    expect(ands.map((and) => and.version)).toEqual(['V1']);
  });

  test('outer blank lines are trimmed, inner ones kept, trailing whitespace removed', () => {
    const ands = parse('Ands 1 Aug\nV1 \n\n\nline one  \n\nline two\t\n\n');
    expect(ands[0]?.version).toBe('V1');
    expect(ands[0]?.lines).toEqual(['line one', '', 'line two']);
  });

  test('a body line before any header is undated', () => {
    expect(parse('a poem without a date')[0]).toMatchObject({ id: 'undated-1', date: null, ordinal: 1 });
  });

  test('a "# " line before the first verse line is the title, later it is verse', () => {
    const ands = parse('Ands 1 Aug\nV1\n# The Title\n\nline one\n# not a title');
    expect(ands[0]?.title).toBe('The Title');
    expect(ands[0]?.lines).toEqual(['line one', '# not a title']);
  });

  test('a line wrapped in * is italic and in ** is bold, without the markers', () => {
    const ands = parse('Ands 1 Aug\nplain\n*leaning*\n\n**heavy**');
    expect(ands[0]?.lines).toEqual(['plain', 'leaning', '', 'heavy']);
    expect(ands[0]?.emphasis).toEqual([null, 'italic', null, 'bold']);
  });

  test('a poem without emphasis has no emphasis field', () => {
    expect(parse('Ands 1 Aug\nplain')[0]?.emphasis).toBeUndefined();
  });

  test('language falls back to English without a stop word', () => {
    expect(parse('Ands 1 Aug\nzzz qqq')[0]?.language).toBe('en');
  });
});

describe('select', () => {
  const ands = parse(
    [
      'Ands 10 october', 'V1', 'the sky and the sea', '--',
      'Ands 18 september', 'V1', 'ik en de hemel', 'V2', 'the wind is mine', '--',
      'Ands 19 october', 'V1', 'ben ve sen', 'V2', 'the end of all',
    ].join('\n'),
  );
  const ids = (list: readonly (And | null)[]): (string | null)[] => list.map((and) => and?.id ?? null);

  test('reading order ignores file order', () => {
    expect(ids(sortAnds(ands))).toEqual([
      '2026-09-18-1', '2026-09-18-2', '2026-10-10-1', '2026-10-19-1', '2026-10-19-2',
    ]);
  });

  test('undated entries sort last', () => {
    const withUndated = parse('orphan\n--\nAnds 1 Aug\npoem');
    expect(ids(sortAnds(withUndated))).toEqual(['2026-08-01-1', 'undated-1']);
  });

  test('neighbours are null on the open side at the ends', () => {
    expect(ids(Object.values(neighbours(ands, '2026-09-18-1')))).toEqual([null, '2026-09-18-2']);
    expect(ids(Object.values(neighbours(ands, '2026-10-19-2')))).toEqual(['2026-10-19-1', null]);
  });

  test('a current And outside the filter gets the nearest matching neighbours', () => {
    const result = neighbours(ands, '2026-10-19-1', { month: null, language: 'en' });
    expect(ids([result.previous, result.next])).toEqual(['2026-10-10-1', '2026-10-19-2']);
  });

  test('an empty filtered list gives null on both sides', () => {
    const filter = { month: '2026-08', language: null };
    expect(filterAnds(ands, filter)).toEqual([]);
    expect(neighbours(ands, '2026-10-10-1', filter)).toEqual({ previous: null, next: null });
  });

  test('an unknown id gives null on both sides', () => {
    expect(neighbours(ands, 'nope')).toEqual({ previous: null, next: null });
  });

  test('filterAnds combines month and language', () => {
    expect(ids(filterAnds(ands, { month: '2026-10', language: 'en' }))).toEqual(['2026-10-10-1', '2026-10-19-2']);
  });

  test('monthsOf and languagesOf count what is present', () => {
    expect(monthsOf(ands)).toEqual([
      { month: '2026-09', count: 2 },
      { month: '2026-10', count: 3 },
    ]);
    expect(languagesOf(ands)).toEqual([
      { language: 'en', count: 3 },
      { language: 'nl', count: 1 },
      { language: 'tr', count: 1 },
    ]);
  });
});
