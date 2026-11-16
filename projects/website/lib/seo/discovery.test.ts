import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import robots from '../../app/robots';
import sitemap from '../../app/sitemap';
import { getAnds } from '@/lib/ands/ands';
import { STANDALONE_OATHS } from '@/lib/ands/oaths';
import { routing } from '@/lib/i18n/routing';
import { andCanonicalPath, oathCanonicalPath } from './build-poem-json-ld';
import { AI_TRAINING_CRAWLERS, SEARCH_AND_CITATION_CRAWLERS } from './crawlers';
import { SEO_PAGES } from './pages';
import { SITE_URL } from './site';

const SITE_ROOT = join(import.meta.dir, '..', '..');
const entries = sitemap();
const urls = entries.map((entry) => entry.url);

describe('sitemap', () => {
  test('has 17 pages in 4 locales, the two standalone oaths once each, plus one entry per poem', () => {
    expect(SEO_PAGES.length * routing.locales.length).toBe(17 * 4);
    expect(STANDALONE_OATHS.length).toBe(2);
    expect(entries.length).toBe(17 * 4 + STANDALONE_OATHS.length + getAnds().length);
  });

  test('lists each standalone oath once, at its canonical stone, without alternates', () => {
    for (const oath of STANDALONE_OATHS) {
      const canonical = `${SITE_URL}${oathCanonicalPath(oath)}`;
      const stones = entries.filter((entry) => entry.url.endsWith(`/ands/${oath.id}`));
      expect(stones.map((entry) => entry.url)).toEqual([canonical]);
      expect(stones[0]?.alternates).toBeUndefined();
    }
  });

  test('lists no stone for a poem: the former poem oaths have only their poem page', () => {
    expect(urls.some((url) => /\/ands\/\d{4}-\d{2}-\d{2}-\d+$/.test(url))).toBe(false);
  });

  test('has no duplicate url', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  test('every page appears once per locale with hreflang alternates and x-default', () => {
    for (const page of SEO_PAGES) {
      for (const locale of routing.locales) {
        const url = `${SITE_URL}/${locale}${page.path === '' ? '' : `/${page.path}`}`;
        const entry = entries.find((candidate) => candidate.url === url);
        expect(entry, url).toBeDefined();
        const languages = entry?.alternates?.languages as Record<string, string>;
        expect(Object.keys(languages).sort()).toEqual([...routing.locales, 'x-default'].sort());
        expect(entry?.priority).toBe(page.priority);
        expect(entry?.changeFrequency).toBe(page.changeFrequency);
      }
    }
  });

  test('each poem is listed once, on the poems page in its own language, without alternates', () => {
    for (const and of getAnds()) {
      const url = `${SITE_URL}${andCanonicalPath(and)}`;
      const matches = entries.filter((entry) => entry.url === url);
      expect(matches.length, url).toBe(1);
      expect(url).toContain(`/${and.language}/poems/`);
      expect(matches[0].alternates).toBeUndefined();
    }
  });

  test('lists no redirecting route: not the bare root, not /download, not the noindex HTML book', () => {
    expect(urls).not.toContain(SITE_URL);
    expect(urls).not.toContain(`${SITE_URL}/`);
    for (const url of urls) {
      expect(url).toMatch(new RegExp(`^${SITE_URL}/(${routing.locales.join('|')})(/|$)`));
      expect(url).not.toContain('/download');
      expect(url).not.toContain('/boek/html');
      expect(url).not.toContain('/boek/steppe/html');
    }
  });
});

describe('robots', () => {
  test('lists the three groups, blocks the API and both HTML books, and names the sitemap', () => {
    const result = robots();
    const rules = result.rules as { userAgent: string | string[]; allow?: string; disallow?: string[] }[];
    expect(rules.length).toBe(3);
    expect(rules[0].userAgent).toBe('*');
    expect(rules[1].userAgent).toEqual([...SEARCH_AND_CITATION_CRAWLERS]);
    expect(rules[2].userAgent).toEqual([...AI_TRAINING_CRAWLERS]);
    for (const rule of rules) {
      expect(rule.allow).toBe('/');
      expect(rule.disallow).toEqual(['/api/', '/*/boek/html', '/*/boek/steppe/html']);
    }
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  test('NEXT_PUBLIC_SEO_INDEXABLE=false disallows everything and names no sitemap', () => {
    const run = Bun.spawnSync(
      [process.execPath, '-e', `import('./app/robots').then((m) => console.log(JSON.stringify(m.default())));`],
      { cwd: SITE_ROOT, env: { ...process.env, NEXT_PUBLIC_SEO_INDEXABLE: 'false' } },
    );
    expect(run.exitCode).toBe(0);
    expect(JSON.parse(run.stdout.toString())).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
  });
});
