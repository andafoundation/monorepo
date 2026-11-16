import { describe, expect, test } from 'bun:test';
import { NAV_CTA, NAV_GROUPS, NAV_PAGES } from '@/lib/navigation';
import en from '../../messages/en.json';
import nl from '../../messages/nl.json';
import ru from '../../messages/ru.json';
import tr from '../../messages/tr.json';
import { META_DESCRIPTION_MAX_LENGTH } from './metadata';
import { getSeoPage, SEO_PAGES } from './pages';

const LEGAL_PATHS = ['privacy', 'cookies', 'disclaimer'];
const NAV_PATHS = [...NAV_GROUPS.flatMap((group) => group.items), ...NAV_PAGES, NAV_CTA].map((item) => item.path);
const MESSAGES: Record<string, Record<string, unknown>> = { en, nl, ru, tr };

describe('SEO_PAGES', () => {
  test('covers the home page, every navigation path and every legal path, and nothing else', () => {
    const expected = ['', ...NAV_PATHS, ...LEGAL_PATHS].sort();
    expect(SEO_PAGES.map((page) => page.path).sort()).toEqual(expected);
  });

  test('has 17 unique paths and priorities within 0 to 1', () => {
    const paths = SEO_PAGES.map((page) => page.path);
    expect(paths.length).toBe(17);
    expect(new Set(paths).size).toBe(17);
    for (const page of SEO_PAGES) {
      expect(page.priority).toBeGreaterThan(0);
      expect(page.priority).toBeLessThanOrEqual(1);
    }
  });

  test('the home page leads with the top priority', () => {
    expect(SEO_PAGES[0]).toMatchObject({ path: '', namespace: 'home', priority: 1 });
  });

  test('getSeoPage returns an entry and throws for an unlisted slug', () => {
    expect(getSeoPage('boek').namespace).toBe('boek');
    expect(() => getSeoPage('nope')).toThrow('nope');
  });

  for (const [locale, messages] of Object.entries(MESSAGES)) {
    test(`${locale}: every page has a metaTitle and a metaDescription of ${META_DESCRIPTION_MAX_LENGTH} characters or fewer`, () => {
      for (const page of SEO_PAGES) {
        const namespace = messages[page.namespace] as Record<string, unknown> | undefined;
        const title = namespace?.[page.titleKey];
        const description = namespace?.[page.descriptionKey];
        expect(typeof title, `${locale} ${page.namespace}.${page.titleKey}`).toBe('string');
        expect(typeof description, `${locale} ${page.namespace}.${page.descriptionKey}`).toBe('string');
        expect((title as string).length).toBeGreaterThan(0);
        expect((description as string).length, `${locale} ${page.namespace}`).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
        expect((description as string).length).toBeGreaterThan(0);
      }
    });
  }
});
