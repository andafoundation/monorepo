import { describe, expect, test } from 'bun:test';
import type { DateTimeFormatOptions } from 'next-intl';
import { formatDateOnly, parseDateOnly } from './date-only';

describe('parseDateOnly', () => {
  test('reads a real day as UTC midnight', () => {
    expect(parseDateOnly('2026-11-04')?.toISOString()).toBe('2026-11-04T00:00:00.000Z');
  });

  test('keeps a leap day and rejects a non-leap one', () => {
    expect(parseDateOnly('2028-02-29')?.toISOString()).toBe('2028-02-29T00:00:00.000Z');
    expect(parseDateOnly('2026-02-29')).toBeNull();
  });

  test.each(['2026-02-30', '2026-13-01', '2026-11-4', '', '2026-11-04T00:00:00Z', ' 2026-11-04', '04-11-2026'])(
    'returns null for %p',
    (value) => {
      expect(parseDateOnly(value)).toBeNull();
    },
  );
});

describe('formatDateOnly', () => {
  function stub(): { format: { dateTime: (date: Date, options?: DateTimeFormatOptions) => string }; calls: unknown[][] } {
    const calls: unknown[][] = [];
    return {
      calls,
      format: {
        dateTime: (date, options) => {
          calls.push([date, options]);
          return 'formatted';
        },
      },
    };
  }

  test('passes the UTC midnight date and the options with timeZone UTC', () => {
    const { format, calls } = stub();
    const result = formatDateOnly(format as never, '2026-11-04', { day: 'numeric', month: 'long', year: 'numeric' });
    expect(result).toBe('formatted');
    expect(calls).toHaveLength(1);
    expect((calls[0][0] as Date).toISOString()).toBe('2026-11-04T00:00:00.000Z');
    expect(calls[0][1]).toEqual({ day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  });

  test('overrides a timeZone given by the caller', () => {
    const { format, calls } = stub();
    formatDateOnly(format as never, '2026-11-04', { month: 'long', timeZone: 'America/Los_Angeles' });
    expect(calls[0][1]).toEqual({ month: 'long', timeZone: 'UTC' });
  });

  test('returns an invalid value unchanged without calling the formatter', () => {
    const { format, calls } = stub();
    expect(formatDateOnly(format as never, '2026-13-01', { month: 'long' })).toBe('2026-13-01');
    expect(calls).toHaveLength(0);
  });

  test('shows the same day with the real Intl formatter in the process zone', () => {
    const format = {
      dateTime: (date: Date, options?: DateTimeFormatOptions) =>
        new Intl.DateTimeFormat('en', options as Intl.DateTimeFormatOptions).format(date),
    };
    expect(formatDateOnly(format as never, '2026-11-04', { day: 'numeric', month: 'long', year: 'numeric' })).toBe(
      'November 4, 2026',
    );
    expect(formatDateOnly(format as never, '2026-01-01', { day: 'numeric', month: 'long', year: 'numeric' })).toBe(
      'January 1, 2026',
    );
  });
});
