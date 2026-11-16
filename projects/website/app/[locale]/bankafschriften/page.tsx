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

type BankafschriftenPageProps = { params: Promise<{ locale: string }> };

const BANKAFSCHRIFTEN_SLUG = 'bankafschriften';

export async function generateMetadata({ params }: BankafschriftenPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'bankafschriften' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: BANKAFSCHRIFTEN_SLUG,
    locale,
  });
}

export default async function BankafschriftenPage({ params }: BankafschriftenPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tCommon, tNav] = await Promise.all([
    getTranslations('bankafschriften'),
    getTranslations('common'),
    getTranslations('nav'),
  ]);
  const documents = foundationDocuments(['bank-statement']);

  const path = localePath(locale, BANKAFSCHRIFTEN_SLUG);
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path,
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name: tNav('bankStatements'), path },
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
        points={[t('point1'), t('point2'), t('point3')]}
        conclusion={t('conclusion')}
        documentsTitle={t('documentsTitle')}
        emptyText={t('empty')}
        downloadLabel={tCommon('downloadPdf')}
        locale={locale}
        documents={documents}
      />
    </>
  );
}
