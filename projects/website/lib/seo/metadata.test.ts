import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { routing } from '@/lib/i18n/routing';
import {
  buildAlternates,
  buildPageMetadata,
  buildUntranslatedAlternates,
  hreflangLanguages,
  LLMS_TXT_ALTERNATE_TYPES,
  localeUrl,
} from './metadata';
import { OG_IMAGE, SITE_URL } from './site';

const SITE_ROOT = join(import.meta.dir, '..', '..');

function metadataWithIndexableEnv(value: string): { robots: unknown } {
  const result = Bun.spawnSync(
    [
      process.execPath,
      '-e',
      `import('@/lib/seo/metadata').then((m) => console.log(JSON.stringify({ robots: m.buildPageMetadata({ title: 't', description: 'd', path: 'boodschap', locale: 'nl' }).robots ?? null })));`,
    ],
    { cwd: SITE_ROOT, env: { ...process.env, NEXT_PUBLIC_SEO_INDEXABLE: value } },
  );
  expect(result.exitCode).toBe(0);
  return JSON.parse(result.stdout.toString());
}

describe('buildPageMetadata', () => {
  const metadata = buildPageMetadata({ title: 'Boodschap', description: 'Een tekst.', path: 'boodschap', locale: 'nl' });

  test('canonical is absolute and carries the locale', () => {
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/nl/boodschap`);
  });

  test('hreflang lists the four locales plus x-default pointing at the default locale', () => {
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(Object.keys(languages).sort()).toEqual([...routing.locales, 'x-default'].sort());
    for (const locale of routing.locales) {
      expect(languages[locale]).toBe(`${SITE_URL}/${locale}/boodschap`);
    }
    expect(languages['x-default']).toBe(`${SITE_URL}/${routing.defaultLocale}/boodschap`);
  });

  test('the llms.txt alternate type is advertised', () => {
    expect(metadata.alternates?.types).toEqual(LLMS_TXT_ALTERNATE_TYPES);
  });

  test('open graph and twitter reuse the title, description and default image', () => {
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Anda',
      locale: 'nl_NL',
      title: 'Boodschap',
      description: 'Een tekst.',
      url: `${SITE_URL}/nl/boodschap`,
      images: [{ url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: 'Boodschap' }],
    });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', title: 'Boodschap' });
  });

  test('the home page canonical has no trailing slash', () => {
    const home = buildPageMetadata({ title: 'Anda', description: 'd', path: '', locale: 'en' });
    expect(home.alternates?.canonical).toBe(`${SITE_URL}/en`);
  });

  test('a custom image replaces the default and keeps its alt', () => {
    const custom = buildPageMetadata({
      title: 't',
      description: 'd',
      path: 'boek',
      locale: 'en',
      image: { url: '/x.png', width: 10, height: 20, alt: 'Cover' },
    });
    expect(custom.openGraph).toMatchObject({ images: [{ url: '/x.png', width: 10, height: 20, alt: 'Cover' }] });
  });

  test('robots is absent by default and noindex only when asked', () => {
    expect(metadata.robots).toBeUndefined();
    const hidden = buildPageMetadata({ title: 't', description: 'd', path: 'x', locale: 'nl', index: false });
    expect(hidden.robots).toEqual({ index: false, follow: false });
  });

  test('NEXT_PUBLIC_SEO_INDEXABLE=false turns every page noindex', () => {
    expect(metadataWithIndexableEnv('false').robots).toEqual({ index: false, follow: false });
    expect(metadataWithIndexableEnv('true').robots).toBeNull();
  });

  test('untranslated alternates give the canonical and no languages, and are used as given', () => {
    const alternates = buildUntranslatedAlternates('/en/ands/2026-08-03-1');
    expect(alternates).toEqual({ canonical: `${SITE_URL}/en/ands/2026-08-03-1` });
    expect(alternates).not.toHaveProperty('languages');

    const page = buildPageMetadata({ title: 't', description: 'd', path: 'ands/2026-08-03-1', locale: 'nl', alternates });
    expect(page.alternates?.canonical).toBe(`${SITE_URL}/en/ands/2026-08-03-1`);
    expect(page.alternates).not.toHaveProperty('languages');
    expect(page.openGraph).toMatchObject({ url: `${SITE_URL}/en/ands/2026-08-03-1` });
  });
});

describe('locale url helpers', () => {
  test('localeUrl and buildAlternates agree', () => {
    expect(localeUrl('tr', 'eed')).toBe(`${SITE_URL}/tr/eed`);
    expect(buildAlternates('tr', 'eed')).toEqual({ canonical: localeUrl('tr', 'eed'), languages: hreflangLanguages('eed') });
  });
});
