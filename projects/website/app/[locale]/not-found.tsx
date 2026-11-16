import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DelftSection } from '@/components/ui/delft-section';
import { localeHref } from '@/lib/navigation';

/**
 * Next resolves this with the layout's segment params, before the page's
 * setRequestLocale has run, so the locale is read from params rather than
 * from the request-locale cache the page body relies on.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return {
    title: t('title'),
    // Next adds its own noindex to a 404; this replaces the layout's
    // index, follow so the head does not carry two contradicting robots tags.
    robots: { index: false, follow: false },
  };
}

/**
 * The 404 page for every path under a locale that matches no route.
 *
 * It renders inside app/[locale]/layout.tsx, so a lost visitor keeps the
 * header, the footer and their language instead of Next's bare English page.
 *
 * Next passes no params to this component and the site runs without
 * middleware, so the locale comes only from the request-locale cache. Every
 * notFound() call site therefore calls setRequestLocale(locale) first, as
 * app/[locale]/[...rest] does; a new call site that skips it renders this page
 * in Dutch, the default.
 * An unknown locale never reaches this page: the layout rejects it before any
 * child renders.
 *
 * The two exits are the two things a lost visitor needs: the home page, and a
 * person to ask. The site has no search to offer, and a list of suggested pages
 * would be a guess.
 */
export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations('notFound');

  return (
    <DelftSection variant="porcelain" className="min-h-screen pt-32 md:pt-36 pb-24">
      <div className="max-w-2xl mx-auto text-center">
        <Compass className="w-14 h-14 text-primary mx-auto" aria-hidden="true" />
        {/* The status code reads the same in every language, so it stays untranslated. */}
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-balance text-primary">{t('heading')}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/80">{t('description')}</p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href={`/${locale}`}>
              {t('backHome')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={localeHref(locale, 'contact')}>{t('contact')}</Link>
          </Button>
        </div>
      </div>
    </DelftSection>
  );
}
