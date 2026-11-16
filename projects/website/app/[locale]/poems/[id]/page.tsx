import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PoemsReader from '@/components/poems/poems-reader';
import { getAndById, getAnds } from '@/lib/ands/ands';
import type { And } from '@/lib/ands/types';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { andCanonicalPath, andSnippet, buildPoemJsonLd } from '@/lib/seo/build-poem-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata, buildUntranslatedAlternates } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type PoemPageProps = { params: Promise<{ locale: string; id: string }> };

const POEMS_SLUG = 'poems';

// Every poem is prerendered for every locale; an id that is not in the file is a 404, not a render.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAnds().map((and) => ({ id: and.id }));
}

/** The name a poem goes by in the title and the structured data: its title, else its version, else its date, else its ordinal. */
function andLabel(and: And, untitled: (ordinal: number) => string): string {
  return and.title ?? and.version ?? and.date ?? untitled(and.ordinal);
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const and = getAndById(id);
  if (and === undefined) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'poems' });
  const label = andLabel(and, (ordinal) => t('untitled', { ordinal }));

  return buildPageMetadata({
    title: `${t('title')} · ${label}`,
    description: andSnippet(and) || t('metaDescription'),
    path: `${POEMS_SLUG}/${and.id}`,
    locale,
    // The poem is never translated, so every locale URL points at the one in the poem's own language.
    alternates: buildUntranslatedAlternates(andCanonicalPath(and)),
  });
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const and = getAndById(id);
  if (and === undefined) {
    notFound();
  }

  // The structured data describes the canonical page, the one in the poem's
  // language, so every locale URL of the poem emits the same graph under the
  // same `@id`s instead of four competing descriptions of one poem.
  const [t, tNav] = await Promise.all([
    getTranslations({ locale: and.language, namespace: 'poems' }),
    getTranslations({ locale: and.language, namespace: 'nav' }),
  ]);
  const label = andLabel(and, (ordinal) => t('untitled', { ordinal }));
  const path = andCanonicalPath(and);

  const jsonLd = buildPageJsonLd({
    type: 'ItemPage',
    path,
    name: `${t('title')} · ${label}`,
    description: andSnippet(and),
    locale: and.language,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(and.language, '') },
        { name: tNav('poems'), path: localePath(and.language, POEMS_SLUG) },
        { name: label, path },
      ],
      path,
    }),
    mainEntity: buildPoemJsonLd({ and, name: label }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <PoemsReader ands={[...getAnds()]} currentId={and.id} />
    </>
  );
}
