import { describe, expect, test } from 'bun:test';
import { getAnds } from './ands';
import { THE_FIRST_AND } from './first-and';
import { oathLabel } from './label';
import { THE_SECOND_AND } from './second-and';
import { getOathById, getOaths, isOathId, isStandaloneOath, OATH_IDS } from './oaths';
import { andCanonicalPath, oathCanonicalPath } from '../seo/build-poem-json-ld';

describe('oaths', () => {
  test('resolves exactly two stones, The First And then The Second And', () => {
    expect(OATH_IDS).toEqual(['the-first-and', 'the-second-and']);
    expect(getOaths().map((and) => and.id)).toEqual(['the-first-and', 'the-second-and']);
  });

  test('every oath is standalone, and the former poem oaths remain poems only', () => {
    const poemIds = new Set(getAnds().map((and) => and.id));
    for (const id of OATH_IDS) {
      expect(isStandaloneOath(id), id).toBe(true);
      expect(poemIds.has(id), id).toBe(false);
    }
    for (const id of ['2026-10-04-1', '2026-10-20-1', '2026-10-25-1']) {
      expect(poemIds.has(id), id).toBe(true);
      expect(isOathId(id), id).toBe(false);
      expect(getOathById(id), id).toBeUndefined();
    }
  });

  test('The First And is a titled, undated English oath that ends in three lines', () => {
    const first = getOathById('the-first-and');
    expect(first).toBe(THE_FIRST_AND);
    expect(first?.title).toBe('The First And');
    expect(first?.date).toBeNull();
    expect(first?.language).toBe('en');
    expect(first?.lines.slice(-3)).toEqual(['I swear it.', 'I swear.', 'I swear it.']);
    expect(first?.lines.join(' ')).toContain('the Eternal Sky');
    expect(oathLabel(THE_FIRST_AND)).toBe('The First And');
  });

  test('The Second And is a titled, undated English oath with four stanza breaks and the closing call', () => {
    const second = getOathById('the-second-and');
    expect(second).toBe(THE_SECOND_AND);
    expect(second?.title).toBe('The Second And');
    expect(second?.date).toBeNull();
    expect(second?.version).toBeNull();
    expect(second?.language).toBe('en');
    expect(second?.lines[0]).toBe('Welcome, Mengü.');
    expect(second?.lines.filter((line) => line === '').length).toBe(4);
    expect(second?.lines.slice(-3)).toEqual([
      "Let's become endless, Andas!",
      "Let's become one, Andas!",
      "Let's be alive, Andas!",
    ]);
    expect(oathLabel(THE_SECOND_AND)).toBe('The Second And');
  });

  test('no oath text carries an em-dash', () => {
    for (const oath of getOaths()) {
      expect(oath.lines.join('\n').includes('\u2014'), oath.id).toBe(false);
    }
  });

  test('a standalone oath is canonical on its own stone, never on a poem page', () => {
    expect(oathCanonicalPath(THE_FIRST_AND)).toBe('/en/ands/the-first-and');
    expect(oathCanonicalPath(THE_SECOND_AND)).toBe('/en/ands/the-second-and');
    expect(oathCanonicalPath(THE_SECOND_AND)).not.toBe(andCanonicalPath(THE_SECOND_AND));
  });
});
