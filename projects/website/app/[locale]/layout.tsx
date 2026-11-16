import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import { buildAndaismJsonLd } from '@/lib/seo/build-andaism-json-ld';
import { buildOrganizationJsonLd } from '@/lib/seo/build-organization-json-ld';
import { buildWebSiteJsonLd } from '@/lib/seo/build-website-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { LLMS_TXT_ALTERNATE_TYPES } from '@/lib/seo/metadata';
import { OG_IMAGE, OG_LOCALE, SEO_INDEXABLE, SITE_NAME, SITE_URL, THEME_COLOR, toSiteLocale } from '@/lib/seo/site';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cormorant_Garamond, Public_Sans } from "next/font/google";
import "../globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

// Prerender every locale. Required now that there is no proxy to resolve the
// locale at request time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const INDEXABLE_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  'max-snippet': -1,
  'max-image-preview': 'large',
  'max-video-preview': -1,
  googleBot: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

/**
 * Site-wide defaults. Next merges metadata shallowly per top-level key, so a
 * page that builds its own metadata through `buildPageMetadata` replaces
 * `alternates`, `openGraph` and `twitter` wholesale; these blocks reach only a
 * page with no metadata of its own, such as a not-found boundary.
 *
 * `metadataBase` makes the site-relative Open Graph and Twitter image URLs
 * absolute; crawlers ignore a relative `og:image`. No canonical is set here:
 * an inherited canonical would point every page without its own at the home
 * page and tell search engines to drop it as a duplicate.
 *
 * The icons are the files of Next's icon convention, `app/icon.png` and
 * `app/apple-icon.png`, named explicitly: once `icons` is set, Next stops
 * emitting the convention files by itself, and the explicit list keeps the
 * head stating every icon in one place. The tab icon is the blue yurt on a
 * transparent background, so no square shows on a dark or light tab strip;
 * `public/icon-dark.png` is the same yurt in porcelain, which a browser
 * picks only when the visitor's colour scheme is dark. The `?v=2` query
 * makes browsers that cached the earlier cream-square icon fetch it again.
 * The 192 and 512 px PNGs are for installed apps and are named by the
 * manifest only.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  const tHome = await getTranslations({ locale, namespace: 'home' });

  const siteName = t('siteName');
  const defaultTitle = `${tHome('metaTitle')} | ${siteName}`;
  const description = t('homeDescription');
  const imageAlt = t('ogImageAlt');

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    robots: SEO_INDEXABLE ? INDEXABLE_ROBOTS : { index: false, follow: false },
    icons: {
      icon: [
        { url: '/icon.png?v=2', sizes: '512x512', type: 'image/png' },
        { url: '/icon-dark.png?v=2', sizes: '512x512', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
    alternates: { types: { ...LLMS_TXT_ALTERNATE_TYPES } },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[toSiteLocale(locale)],
      title: defaultTitle,
      description,
      images: [{ url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      images: [{ url: OG_IMAGE.path, alt: imageAlt }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // No proxy resolves the locale at request time, so the route segment is the
  // only source. Setting it here lets getMessages() and every server
  // translation below read it during static rendering.
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations('seo');

  return (
    <html lang={locale} className="h-full">
      <body className={`${bodyFont.variable} ${displayFont.variable} flex min-h-screen flex-col bg-porcelain text-ink`}>
        {/* Rendered once per page; every WebPage node links the first two by @id, and they link Andaism. */}
        <JsonLd
          data={[
            buildOrganizationJsonLd({ locale, description: t('homeDescription') }),
            buildWebSiteJsonLd({ locale }),
            buildAndaismJsonLd(locale),
          ]}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
