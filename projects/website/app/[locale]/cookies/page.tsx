import type { Metadata } from 'next';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type CookiesPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('cookies');

export async function generateMetadata({ params }: CookiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default function CookiesPage({ params }: CookiesPageProps) {
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
      <DelftSection variant="porcelain" className="min-h-screen pt-32 md:pt-36 pb-24">
        <PorcelainCard className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center text-primary">
              {t('title')}
            </CardTitle>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none space-y-6 text-sm md:text-base leading-relaxed text-ink">
            <p>{t('intro')}</p>

            <h3>{t('sections.whatAreCookies.title')}</h3>
            <p>{t('sections.whatAreCookies.text')}</p>

            <h3>{t('sections.whichCookies.title')}</h3>
            <ul>
              <li>
                <strong>{t('sections.whichCookies.items.necessary.title')}:</strong>{' '}
                {t('sections.whichCookies.items.necessary.text')}
              </li>
              <li>
                <strong>{t('sections.whichCookies.items.analytics.title')}:</strong>{' '}
                {t('sections.whichCookies.items.analytics.text')}
              </li>
            </ul>

            <h3>{t('sections.manage.title')}</h3>
            <p>{t('sections.manage.text')}</p>

            <p className="text-sm text-ink/60">{t('lastUpdated')}</p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>
    </>
  );
}
