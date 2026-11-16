import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AndsStones from '@/components/ands/ands-stones';
import { oathLabel } from '@/lib/ands/label';
import { getOathById, getOaths, isOathId, OATH_IDS } from '@/lib/ands/oaths';
import { andSnippet, oathCanonicalPath } from '@/lib/seo/build-poem-json-ld';
import { buildPageMetadata, buildUntranslatedAlternates } from '@/lib/seo/metadata';

type OathPageProps = { params: Promise<{ locale: string; id: string }> };

const ANDS_SLUG = 'ands';

// Only the oaths stand on this page; any other poem id is a 404, and the poem itself lives on the poems page.
export const dynamicParams = false;

export function generateStaticParams() {
  return OATH_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: OathPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const oath = getOathById(id);
  if (oath === undefined) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: 'ands' });
  const label = oathLabel(oath) ?? t('untitled', { ordinal: OATH_IDS.indexOf(oath.id) + 1 });

  return buildPageMetadata({
    title: `${t('title')} · ${label}`,
    description: andSnippet(oath) || t('metaDescription'),
    path: `${ANDS_SLUG}/${oath.id}`,
    locale,
    // A stone that shows a poem points its canonical at the poem's page and emits no structured data of its
    // own, so a poem keeps one canonical URL. A standalone oath is canonical on its own stone.
    alternates: buildUntranslatedAlternates(oathCanonicalPath(oath)),
  });
}

export default async function OathPage({ params }: OathPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (!isOathId(id)) {
    notFound();
  }

  return <AndsStones oaths={getOaths()} initialId={id} />;
}
