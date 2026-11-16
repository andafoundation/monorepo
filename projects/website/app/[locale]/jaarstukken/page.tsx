import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FoundationDocumentsPage } from '@/components/foundation/foundation-documents-page';
import { foundationDocuments } from '@/content/foundation/documents';
import { routing } from '@/lib/i18n/routing';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildDocumentListJsonLd } from '@/lib/seo/build-document-list-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type JaarstukkenPageProps = { params: Promise<{ locale: string }> };

const JAARSTUKKEN_SLUG = 'jaarstukken';

export async function generateMetadata({ params }: JaarstukkenPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jaarstukken' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: JAARSTUKKEN_SLUG,
    locale,
  });
}

export default async function JaarstukkenPage({ params }: JaarstukkenPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tCommon, tNav] = await Promise.all([
    getTranslations('jaarstukken'),
    getTranslations('common'),
    getTranslations('nav'),
  ]);
  const documents = foundationDocuments(['annual-accounts', 'policy-plan']);

  const path = localePath(locale, JAARSTUKKEN_SLUG);
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path,
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name: tNav('annualReports'), path },
      ],
      path,
    }),
    // Null while no document is published, so no empty list is announced.
    mainEntity: buildDocumentListJsonLd({ documents, name: t('documentsTitle'), locale, path }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <FoundationDocumentsPage
        title={t('pageTitle')}
        subtitle={t('subtitle')}
        intro={[t('intro')]}
        documentsTitle={t('documentsTitle')}
        emptyText={t('empty')}
        downloadLabel={tCommon('downloadPdf')}
        locale={locale}
        documents={documents}
      />
    </>
  );
}
