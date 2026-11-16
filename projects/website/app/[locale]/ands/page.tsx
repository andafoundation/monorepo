import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AndsStones from '@/components/ands/ands-stones';
import { getOaths, OATH_IDS } from '@/lib/ands/oaths';
import { ANDAISM_JSON_LD_ID } from '@/lib/seo/build-andaism-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { buildAndsListJsonLd, oathCanonicalPath } from '@/lib/seo/build-poem-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type AndsPageProps = { params: Promise<{ locale: string }> };

const ANDS_SLUG = 'ands';

export async function generateMetadata({ params }: AndsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ands' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: ANDS_SLUG,
    locale,
  });
}

export default async function AndsPage({ params }: AndsPageProps) {
  // Next renders the page in parallel with the layout, so the page sets the locale for itself.
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations('ands'), getTranslations('nav')]);
  const oaths = getOaths();
  const path = localePath(locale, ANDS_SLUG);

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
        { name: tNav('ands'), path },
      ],
      path,
    }),
    // Each oath links its canonical page: the poem's page, where the poem's own structured data lives, or
    // the stone itself for an oath that is not a poem.
    mainEntity: buildAndsListJsonLd({
      items: oaths.map((oath, index) => ({
        and: oath,
        name: oath.title ?? oath.version ?? t('untitled', { ordinal: index + 1 }),
        canonicalPath: oathCanonicalPath(oath),
      })),
      name: t('title'),
      path,
    }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <AndsStones oaths={oaths} initialId={OATH_IDS[0]} />
    </>
  );
}
