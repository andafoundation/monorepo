import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PoemsReader from '@/components/poems/poems-reader';
import { getAnds, getLatestAnd } from '@/lib/ands/ands';
import { ANDAISM_JSON_LD_ID } from '@/lib/seo/build-andaism-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { buildAndsListJsonLd } from '@/lib/seo/build-poem-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type PoemsPageProps = { params: Promise<{ locale: string }> };

const POEMS_SLUG = 'poems';

export async function generateMetadata({ params }: PoemsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'poems' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: POEMS_SLUG,
    locale,
  });
}

export default async function PoemsPage({ params }: PoemsPageProps) {
  // Next renders the page in parallel with the layout, so the page sets the locale for itself.
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations('poems'), getTranslations('nav')]);
  const ands = getAnds();
  const path = localePath(locale, POEMS_SLUG);

  const jsonLd = buildPageJsonLd({
    type: 'CollectionPage',
    path,
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    aboutId: ANDAISM_JSON_LD_ID,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name: tNav('poems'), path },
      ],
      path,
    }),
    // Each poem is named as the reader's index names it, so the list states what the page shows.
    mainEntity: buildAndsListJsonLd({
      items: ands.map((and) => ({ and, name: and.version ?? t('untitled', { ordinal: and.ordinal }) })),
      name: t('title'),
      path,
    }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <PoemsReader ands={[...ands]} currentId={getLatestAnd().id} />
    </>
  );
}
