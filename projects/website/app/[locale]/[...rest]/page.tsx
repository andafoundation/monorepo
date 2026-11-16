import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

/**
 * Every path under a locale that matches no other route.
 *
 * Its only job is to turn a miss into a real 404 with the localized
 * app/[locale]/not-found.tsx. That page and its metadata receive no params, so
 * the setRequestLocale call below is what lets them render in the visitor's
 * language.
 *
 * next.config.js rewrites an unprefixed path into the default locale, so
 * /does-not-exist lands here as /nl/does-not-exist. An unknown locale such as
 * /xx/does-not-exist is rejected by the layout's own notFound() first.
 */
export default async function CatchAllPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
