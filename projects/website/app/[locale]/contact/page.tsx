import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactView from '@/components/contact/contact-view';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { ORGANIZATION_JSON_LD_ID } from '@/lib/seo/build-organization-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type ContactPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('contact');

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations(SEO_PAGE.namespace), getTranslations('nav')]);
  const path = localePath(locale, SEO_PAGE.path);

  return (
    <>
      {/* The page is about the foundation itself, whose Organization the layout already renders on every page. */}
      <JsonLd
        data={buildPageJsonLd({
          type: 'ContactPage',
          path,
          name: t(SEO_PAGE.titleKey),
          description: t(SEO_PAGE.descriptionKey),
          locale,
          breadcrumb: buildBreadcrumbJsonLd({
            items: [
              { name: tNav('home'), path: localePath(locale, '') },
              { name: tNav('contact'), path },
            ],
            path,
          }),
          mainEntityId: ORGANIZATION_JSON_LD_ID,
        })}
      />
      <ContactView />
    </>
  );
}
