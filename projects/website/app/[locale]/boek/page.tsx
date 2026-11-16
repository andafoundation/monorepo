import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BookPageView from '@/components/book/book-page-view';
import { buildBookJsonLd } from '@/lib/seo/build-book-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type BookPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('boek');

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { locale } = await params;
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tBook, tSteppe, tNav] = await Promise.all([
    getTranslations(SEO_PAGE.namespace),
    getTranslations('book'),
    getTranslations('steppe'),
    getTranslations('nav'),
  ]);
  const path = localePath(locale, SEO_PAGE.path);

  return (
    <>
      <JsonLd
        data={buildPageJsonLd({
          type: 'WebPage',
          path,
          name: t(SEO_PAGE.titleKey),
          description: t(SEO_PAGE.descriptionKey),
          locale,
          breadcrumb: buildBreadcrumbJsonLd({
            items: [
              { name: tNav('home'), path: localePath(locale, '') },
              { name: tNav('book'), path },
            ],
            path,
          }),
          mainEntity: buildBookJsonLd({
            book: {
              title: tBook('title'),
              subtitle: tBook('subtitle'),
              year: tBook('year'),
            },
            description: tBook('long'),
            locale,
            path,
          }),
        })}
      />
      <JsonLd
        data={buildBookJsonLd({
          book: {
            title: tSteppe('title'),
            subtitle: tSteppe('subtitle'),
            year: tSteppe('year'),
          },
          description: tSteppe('long'),
          locale,
          path,
          fragment: 'steppe-book',
          htmlSlug: 'boek/steppe/html',
        })}
      />
      <BookPageView />
    </>
  );
}
