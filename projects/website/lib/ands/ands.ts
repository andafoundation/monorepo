import { ANDS_SOURCE } from './ands-source';
import { parseAnds } from './parse-ands';
import { sortAnds } from './select';
import type { And } from './types';

/** The four-part version labels ("V10.10.26.1") show the poems are from 2026; headers carry no year. */
const ANDS_DEFAULT_YEAR = 2026;

// The text of ands/ands.txt is compiled into the bundle as a module, never read from disk: the Cloudflare
// worker renders these pages again at request time and has no file system.
const ANDS: readonly And[] = sortAnds(parseAnds(ANDS_SOURCE, { defaultYear: ANDS_DEFAULT_YEAR }));

/** Every And in reading order. */
export function getAnds(): readonly And[] {
  return ANDS;
}

export function getAndById(id: string): And | undefined {
  return ANDS.find((and) => and.id === id);
}

/** The And with the latest date and the highest ordinal on that date; undated entries only when nothing is dated. */
export function getLatestAnd(): And {
  const dated = ANDS.filter((and) => and.date !== null);
  const latest = dated.length > 0 ? dated[dated.length - 1] : ANDS[ANDS.length - 1];
  if (latest === undefined) {
    throw new Error('ands/ands.txt contains no Ands');
  }
  return latest;
}
