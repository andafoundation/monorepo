import type { Metadata } from 'next';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { ANDAISM_JSON_LD_ID } from '@/lib/seo/build-andaism-json-ld';
import { buildArticleJsonLd } from '@/lib/seo/build-article-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type EedPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('eed');

export async function generateMetadata({ params }: EedPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default function Eed({ params }: EedPageProps) {
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations(SEO_PAGE.namespace);
  const tNav = useTranslations('nav');

  const path = localePath(locale, SEO_PAGE.path);
  const name = t(SEO_PAGE.titleKey);
  const description = t(SEO_PAGE.descriptionKey);
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path,
    name,
    description,
    locale,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name, path },
      ],
      path,
    }),
    mainEntity: buildArticleJsonLd({ path, headline: t('title'), description, locale, aboutId: ANDAISM_JSON_LD_ID }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <DelftSection variant="porcelain" className="min-h-screen pt-32 md:pt-36 pb-24">
        <PorcelainCard className="max-w-4xl mx-auto border-ink/15 bg-[linear-gradient(160deg,rgba(247,243,236,0.98),rgba(247,243,236,0.9))] shadow-[0_24px_60px_-45px_rgba(11,27,51,0.5)]">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center text-primary">
              {t('title')}
            </CardTitle>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none text-sm md:text-base leading-relaxed text-ink/85">
            <div className="mx-auto max-w-3xl space-y-6">
              <p className="text-base md:text-lg text-ink/80">{t('oath1')}</p>
              <div className="h-px w-full bg-primary/10" />
              <p>{t('oath2')}</p>
              <p>{t('oath3')}</p>
              <p>{t('oath4')}</p>
              <p>{t('oath5')}</p>
              <p>{t('oath6')}</p>
            </div>

            <p className="text-xl md:text-2xl font-semibold text-center mt-10 pt-6 border-t border-primary/20 text-primary">
              {t('oathFinal')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>
    </>
  );
}
