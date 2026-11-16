import { getAndById } from './ands';
import { THE_FIRST_AND } from './first-and';
import { THE_SECOND_AND } from './second-and';
import type { And } from './types';

/** Oaths that are not poems of `ands/ands.txt`: they stand only on the Ands page, which is their canonical page. */
export const STANDALONE_OATHS: readonly And[] = [THE_FIRST_AND, THE_SECOND_AND];

/**
 * The oaths shown on the Ands page, in the order the stones stand. The page opens on the first id, so
 * prepending an id pins that oath first. An id names a standalone oath or a poem; every other poem lives
 * only on the poems page.
 */
export const OATH_IDS: readonly string[] = [THE_FIRST_AND.id, THE_SECOND_AND.id];

export function isOathId(id: string): boolean {
  return OATH_IDS.includes(id);
}

/** True for an oath that is not a poem, so it has no page in the poems collection. */
export function isStandaloneOath(id: string): boolean {
  return STANDALONE_OATHS.some((oath) => oath.id === id);
}

/** The oath with this id, or undefined when the id is not in `OATH_IDS`. */
export function getOathById(id: string): And | undefined {
  if (!isOathId(id)) return undefined;
  return STANDALONE_OATHS.find((oath) => oath.id === id) ?? getAndById(id);
}

/** The oaths in `OATH_IDS` order. An id that names nothing fails the build instead of dropping a stone. */
export function getOaths(): And[] {
  return OATH_IDS.map((id) => {
    const oath = getOathById(id);
    if (oath === undefined) {
      throw new Error(`OATH_IDS names "${id}", which is neither a standalone oath nor a poem in ands/ands.txt`);
    }
    return oath;
  });
}
