import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { routing } from './i18n/routing';
import { localeHref, NAV_CTA, NAV_GROUPS, NAV_PAGES, type NavItem } from './navigation';

const SITE_ROOT = join(import.meta.dir, '..');
const ALL_ITEMS: NavItem[] = [...NAV_GROUPS.flatMap((group) => group.items), ...NAV_PAGES, NAV_CTA];

function lookup(messages: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object' && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

describe('navigation model', () => {
  test('groups are leer, teksten and stichting in that order', () => {
    expect(NAV_GROUPS.map((group) => group.id)).toEqual(['leer', 'teksten', 'stichting']);
  });

  test('every item id is unique', () => {
    const ids = ALL_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every dropdown item has a description and no top-level page or CTA has one', () => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        expect(item.descriptionKey).toBe(`descriptions.${item.labelKey}`);
      }
    }
    for (const item of [...NAV_PAGES, NAV_CTA]) {
      expect(item.descriptionKey).toBeUndefined();
    }
  });

  test('no path has two characters, which next.config.js would read as a locale', () => {
    for (const item of ALL_ITEMS) {
      expect(item.path).not.toMatch(/^[^/]{2}(\/|$)/);
    }
  });

  test.each(ALL_ITEMS.map((item) => [item.path]))('app/[locale]/%s/page.tsx exists', (path) => {
    expect(existsSync(join(SITE_ROOT, 'app', '[locale]', path, 'page.tsx'))).toBe(true);
  });

  test.each(routing.locales.map((locale) => [locale]))('every key resolves to a string in messages/%s.json', (locale) => {
    const messages = JSON.parse(readFileSync(join(SITE_ROOT, 'messages', `${locale}.json`), 'utf8'));
    const keys = [
      'menuLabel',
      'openMenu',
      'closeMenu',
      'home',
      ...NAV_GROUPS.map((group) => group.labelKey),
      ...ALL_ITEMS.flatMap((item) => (item.descriptionKey ? [item.labelKey, item.descriptionKey] : [item.labelKey])),
    ];
    const missing = keys.filter((key) => typeof lookup(messages.nav, key) !== 'string' || lookup(messages.nav, key) === '');
    expect(missing).toEqual([]);
  });

  test('localeHref keeps the locale in front of the page slug', () => {
    expect(localeHref('en', 'boodschap')).toBe('/en/boodschap');
  });
});
