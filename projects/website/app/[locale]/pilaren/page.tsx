import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PilarenView from '@/components/pilaren/pilaren-view';
import { ANDAISM_JSON_LD_ID } from '@/lib/seo/build-andaism-json-ld';
import { buildArticleJsonLd } from '@/lib/seo/build-article-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type PilarenPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('pilaren');

/** The six pillars in reading order; their titles are the Article's sections. */
const PILLAR_KEYS = ['pillar1', 'pillar2', 'pillar3', 'pillar4', 'pillar5', 'pillar6'] as const;

export async function generateMetadata({ params }: PilarenPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default async function PilarenPage({ params }: PilarenPageProps) {
  const { locale } = await params;
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations(SEO_PAGE.namespace), getTranslations('nav')]);
  const path = localePath(locale, SEO_PAGE.path);
  const title = t(SEO_PAGE.titleKey);
  const description = t(SEO_PAGE.descriptionKey);

  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          type: 'WebPage',
          path,
          name: title,
          description,
          locale,
          breadcrumb: buildBreadcrumbJsonLd({
            items: [
              { name: tNav('home'), path: localePath(locale, '') },
              { name: tNav('pillars'), path },
            ],
            path,
          }),
          mainEntity: buildArticleJsonLd({
            path,
            headline: t('pageTitle'),
            description,
            locale,
            articleSections: PILLAR_KEYS.map((key) => t(`${key}.title`)),
            aboutId: ANDAISM_JSON_LD_ID,
          }),
        })}
      />
      <PilarenView />
    </>
  );
}
