import type { Metadata } from 'next';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { ThemeBackground } from '@/components/ui/theme-background';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type StatutenPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('statuten');

export async function generateMetadata({ params }: StatutenPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default function Statuten({ params }: StatutenPageProps) {
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
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div>
        {/* ✅ Hero section like Download / Contact */}
        <ThemeBackground variant="sky" className="relative pt-32 md:pt-36 pb-16 md:pb-24 px-4">
          <div className="relative z-10 text-center text-porcelain max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-center text-lg italic text-porcelain/80">
              {t('subtitle')}
            </p>
          </div>
        </ThemeBackground>

        {/* ✅ Main content stays exactly your old layout/background */}
        <DelftSection variant="porcelain" className="pb-0">
          <div className="max-w-5xl mx-auto">
            {/* (Removed old h1/subtitle from here because now in hero) */}

            <PorcelainCard className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {t('transparency.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-ink/80">
                  {t('transparency.paragraph1')}
                </p>
                <p className="text-sm md:text-base text-ink/80">
                  {t('transparency.paragraph2')}
                </p>
              </CardContent>
            </PorcelainCard>

            <div className="space-y-8">
              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article1.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article1.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article2.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article2.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-ink/80">
                    <li>{t('article2.goals.0')}</li>
                    <li>{t('article2.goals.1')}</li>
                    <li>{t('article2.goals.2')}</li>
                    <li>{t('article2.goals.3')}</li>
                  </ul>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article2.conclusion')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article3.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article3.intro')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-ink/80">
                    <li>{t('article3.means.0')}</li>
                    <li>{t('article3.means.1')}</li>
                    <li>{t('article3.means.2')}</li>
                    <li>{t('article3.means.3')}</li>
                    <li>{t('article3.means.4')}</li>
                  </ul>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article4.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article4.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article5.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article5.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article6.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article6.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article7.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article7.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article8.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article8.paragraph1')}
                  </p>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article8.paragraph2')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article9.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article9.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article10.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article10.content')}
                  </p>
                </CardContent>
              </PorcelainCard>

              <PorcelainCard>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-primary">
                    {t('article11.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-ink/80">
                    {t('article11.content')}
                  </p>
                </CardContent>
              </PorcelainCard>
            </div>
          </div>
        </DelftSection>
      </div>
    </>
  );
}
