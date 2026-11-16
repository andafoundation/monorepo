import { AND_LANGUAGES } from './types';
import type { And, AndLanguageCount, AndMonthCount, AndNeighbours, AndsFilter } from './types';

export const NO_FILTER: AndsFilter = { month: null, language: null };

/** Reading order: date ascending with undated entries last, then ordinal within the date. */
export function compareAnds(a: And, b: And): number {
  if (a.date !== b.date) {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date < b.date ? -1 : 1;
  }
  return a.ordinal - b.ordinal;
}

export function sortAnds(ands: readonly And[]): And[] {
  return [...ands].sort(compareAnds);
}

export function monthOf(and: And): string | null {
  return and.date === null ? null : and.date.slice(0, 7);
}

export function matchesFilter(and: And, filter: AndsFilter): boolean {
  if (filter.month !== null && monthOf(and) !== filter.month) return false;
  if (filter.language !== null && and.language !== filter.language) return false;
  return true;
}

/** The matching Ands in reading order. */
export function filterAnds(ands: readonly And[], filter: AndsFilter): And[] {
  return sortAnds(ands).filter((and) => matchesFilter(and, filter));
}

/**
 * Previous and next matching And around `currentId` in reading order. The current And need not match the
 * filter: the visitor keeps reading it and steps to the nearest match on either side. Both sides are null
 * when `currentId` is unknown.
 */
export function neighbours(ands: readonly And[], currentId: string, filter: AndsFilter = NO_FILTER): AndNeighbours {
  const ordered = sortAnds(ands);
  const index = ordered.findIndex((and) => and.id === currentId);
  if (index === -1) return { previous: null, next: null };
  let previous: And | null = null;
  for (let i = index - 1; i >= 0 && previous === null; i -= 1) {
    if (matchesFilter(ordered[i], filter)) previous = ordered[i];
  }
  let next: And | null = null;
  for (let i = index + 1; i < ordered.length && next === null; i += 1) {
    if (matchesFilter(ordered[i], filter)) next = ordered[i];
  }
  return { previous, next };
}

/** Every month with at least one dated And, chronologically, with its count. */
export function monthsOf(ands: readonly And[]): AndMonthCount[] {
  const counts = new Map<string, number>();
  for (const and of ands) {
    const month = monthOf(and);
    if (month !== null) counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([month, count]) => ({ month, count }));
}

/** Every language present, in the order of `AND_LANGUAGES`, with its count. */
export function languagesOf(ands: readonly And[]): AndLanguageCount[] {
  return AND_LANGUAGES.map((language) => ({
    language,
    count: ands.filter((and) => and.language === language).length,
  })).filter((entry) => entry.count > 0);
}
