import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { ThemeBackground } from '@/components/ui/theme-background';
import { localeHref } from '@/lib/navigation';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type OpenheidPageProps = { params: Promise<{ locale: string }> };

const OPENHEID_SLUG = 'openheid';

/** The pages that hold the documents this statement promises, with their header label. */
const DOCUMENT_PAGES = [
  { path: 'statuten', navKey: 'statutes' },
  { path: 'jaarstukken', navKey: 'annualReports' },
  { path: 'bankafschriften', navKey: 'bankStatements' },
] as const;

export async function generateMetadata({ params }: OpenheidPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'openheid' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: OPENHEID_SLUG,
    locale,
  });
}

export default async function OpenheidPage({ params }: OpenheidPageProps) {
  const { locale } = await params;
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations('openheid'), getTranslations('nav')]);

  const path = localePath(locale, OPENHEID_SLUG);
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path,
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name: tNav('openness'), path },
      ],
      path,
    }),
  });

  return (
    <div>
      <JsonLd data={jsonLd} />
      <ThemeBackground variant="sky" className="relative pt-32 md:pt-36 pb-16 md:pb-24 px-4">
        <div className="relative z-10 text-center text-porcelain max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">{t('pageTitle')}</h1>
          <p className="text-center text-lg italic text-porcelain/80">{t('subtitle')}</p>
        </div>
      </ThemeBackground>

      <DelftSection variant="porcelain">
        <div className="max-w-5xl mx-auto space-y-8">
          <PorcelainCard>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm md:text-base text-ink/80 leading-relaxed">{t('paragraph1')}</p>
              <p className="text-sm md:text-base text-ink/80 leading-relaxed">{t('paragraph2')}</p>
              <p className="text-sm md:text-base text-ink/80 leading-relaxed">{t('paragraph3')}</p>
            </CardContent>
          </PorcelainCard>

          <PorcelainCard>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-primary">{t('linksTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-ink/10">
                {DOCUMENT_PAGES.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={localeHref(locale, page.path)}
                      className="group flex items-center justify-between gap-4 rounded-2xl px-3 py-3 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="space-y-0.5">
                        <span className="block text-sm md:text-base font-semibold text-ink group-hover:text-primary">
                          {tNav(page.navKey)}
                        </span>
                        <span className="block text-xs md:text-sm text-ink/60">
                          {tNav(`descriptions.${page.navKey}`)}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </PorcelainCard>
        </div>
      </DelftSection>
    </div>
  );
}
