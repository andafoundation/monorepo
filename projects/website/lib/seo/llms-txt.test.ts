import { describe, expect, test } from 'bun:test';
import { getAnds } from '@/lib/ands/ands';
import { en as diepteEn } from '@/content/diepte/en';
import messages from '../../messages/en.json';
import { buildLlmsFullTxt, buildLlmsTxt } from './build-llms-txt';
import { andCanonicalPath } from './build-poem-json-ld';
import { SEO_PAGES } from './pages';
import { FOUNDER, ORGANIZATION_EMAIL, SITE_URL } from './site';

const ands = getAnds();
const llms = buildLlmsTxt({ messages, ands });
const llmsFull = buildLlmsFullTxt({ messages, ands, diepte: diepteEn });

describe('buildLlmsTxt', () => {
  test('starts with an H1, then a blockquote that defines Andaism, the mission and the foundation facts', () => {
    const lines = llms.split('\n');
    expect(lines[0]).toBe('# Anda');
    expect(lines[2]).toMatch(/^> Andaism is a modern religious and philosophical tradition centered on Mengü, the Eternal Sky\./);
    expect(lines[2]).toContain('also called Anda or Anda philosophy');
    expect(lines[2]).toContain('https://andaism.com points here');
    expect(lines[2]).not.toContain('**');
    expect(lines[4]).toMatch(/^Stichting Anda: /);
    expect(llms).toContain(`- Tradition: Andaism (also Anda, Anda philosophy), defined at ${SITE_URL}/en/diepte`);
    expect(llms).toContain(`- Founder: ${FOUNDER}`);
    expect(llms).toContain(`- Website: ${SITE_URL}`);
    expect(llms).toContain(`- E-mail: ${ORGANIZATION_EMAIL}`);
  });

  test('uses the llmstxt.org sections and ends with a newline', () => {
    for (const heading of ['## Texts', '## Foundation', '## Policies', '## Book', '## Poems', '## Optional']) {
      expect(llms).toContain(`\n${heading}\n`);
    }
    expect(llms.endsWith('\n')).toBe(true);
  });

  test('links every page in English with its meta title and description', () => {
    for (const page of SEO_PAGES) {
      const slug = page.path === '' ? '/en' : `/en/${page.path}`;
      const namespace = (messages as unknown as Record<string, Record<string, string>>)[page.namespace];
      expect(llms).toContain(`](${SITE_URL}${slug}): ${namespace.metaDescription}`);
      expect(llms).toContain(`- [${namespace.metaTitle}](${SITE_URL}${slug})`);
    }
  });

  test('links every poem once by its canonical URL', () => {
    for (const and of ands) {
      const url = `${SITE_URL}${andCanonicalPath(and)}`;
      expect(llms.split(`](${url})`).length - 1, url).toBe(1);
    }
  });

  test('lists the steppe page and its single HTML file once each, in both files', () => {
    const pageLink = `[${messages.steppe.title}](${SITE_URL}/en/boek)`;
    const htmlLink = `[${messages.steppe.title} (single HTML file)](${SITE_URL}/en/boek/steppe/html)`;
    for (const text of [llms, llmsFull]) {
      expect(text.split(pageLink).length - 1).toBe(1);
      expect(text.split(htmlLink).length - 1).toBe(1);
    }
    expect(llms).toContain(`${messages.steppe.long}`);
  });

  test('points at the sibling full file and the sitemap', () => {
    expect(llms).toContain(`(${SITE_URL}/llms-full.txt)`);
    expect(llms).toContain(`(${SITE_URL}/sitemap.xml)`);
  });

  test('throws when a message key is missing instead of publishing a half file', () => {
    expect(() => buildLlmsTxt({ messages: {}, ands })).toThrow('llms.txt');
  });
});

describe('buildLlmsFullTxt', () => {
  test('opens with the same Andaism definition as llms.txt', () => {
    expect(llmsFull.split('\n')[2]).toBe(llms.split('\n')[2]);
  });

  test('carries the full English Diepte text, not only its contents', () => {
    expect(llmsFull).toContain(`\n## ${diepteEn.title}\n`);
    for (const block of diepteEn.lead) {
      if (block.type === 'paragraph') expect(llmsFull).toContain(block.text);
    }
    for (const section of Object.values(diepteEn.sections)) {
      if (section === null) continue;
      expect(llmsFull).toContain(` ${section.title}\n`);
      const first = section.blocks.find((block) => block.type === 'paragraph');
      if (first?.type === 'paragraph') expect(llmsFull).toContain(first.text);
    }
    expect(llmsFull).toContain(`URL: ${SITE_URL}/en/diepte#overview`);
  });

  test('contains no em-dash', () => {
    expect(llms).not.toContain('\u2014');
    expect(llmsFull).not.toContain('\u2014');
  });

  test('keeps the pages and adds the Diepte text and every poem in full', () => {
    for (const page of SEO_PAGES) {
      expect(llmsFull).toContain(`${SITE_URL}/en${page.path === '' ? '' : `/${page.path}`})`);
    }
    expect(llmsFull).toContain(`${SITE_URL}/en/diepte#`);
    for (const and of ands) {
      expect(llmsFull).toContain(`URL: ${SITE_URL}${andCanonicalPath(and)}`);
      expect(llmsFull).toContain(and.lines.filter((line) => line !== '').join('\n').split('\n')[0]);
    }
    expect(llmsFull).toContain(`(${SITE_URL}/llms.txt)`);
  });
});
