import type { DateTimeFormatOptions, useFormatter } from 'next-intl';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** The part of the next-intl formatter that `formatDateOnly` needs, so a test can pass a stub. */
export type DateTimeFormatter = Pick<ReturnType<typeof useFormatter>, 'dateTime'>;

/**
 * Reads a calendar day (`YYYY-MM-DD`) as UTC midnight, or null when it is not a real day.
 *
 * A date-only value names a day, not a moment, so it is pinned to UTC midnight and must also be formatted in UTC;
 * read in the visitor's zone it would show the previous day west of Greenwich. The round trip rejects days such
 * as `2026-02-30`, which `Date` would otherwise roll over into March.
 */
export function parseDateOnly(value: string): Date | null {
  if (!DATE_ONLY.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }
  return date;
}

/**
 * Formats a calendar day (`YYYY-MM-DD`) with the given options in UTC, so every visitor sees the same day and the
 * server and the browser render the same string. A value that is not a real day comes back unchanged.
 */
export function formatDateOnly(format: DateTimeFormatter, value: string, options: DateTimeFormatOptions): string {
  const date = parseDateOnly(value);
  if (date === null) {
    return value;
  }
  return format.dateTime(date, { ...options, timeZone: 'UTC' });
}
