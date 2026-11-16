import type { Metadata } from 'next';
import Link from 'next/link';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { ANDAISM_JSON_LD_ID } from '@/lib/seo/build-andaism-json-ld';
import { buildArticleJsonLd } from '@/lib/seo/build-article-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getSeoPage } from '@/lib/seo/pages';
import { localePath } from '@/lib/seo/site';

type BoodschapPageProps = { params: Promise<{ locale: string }> };

const SEO_PAGE = getSeoPage('boodschap');

export async function generateMetadata({ params }: BoodschapPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: SEO_PAGE.namespace });
  return buildPageMetadata({
    title: t(SEO_PAGE.titleKey),
    description: t(SEO_PAGE.descriptionKey),
    path: SEO_PAGE.path,
    locale,
  });
}

export default function Boodschap({ params }: BoodschapPageProps) {
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
    mainEntity: buildArticleJsonLd({ path, headline: t('title'), description, locale, aboutId: ANDAISM_JSON_LD_ID }),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* The message reads as one sky, from the steppe by day into the night
          of the Eternal Sky: the old blood oath by daylight, the turn
          towards the covenant with yourself at dusk, and the closing promise
          under the stars, which run on into the footer. The stretches meet on
          the same colour, so no band edge shows between them. */}
      <article className="relative isolate">
        <section className="relative bg-porcelain px-4 pt-36 pb-16 md:pt-44 md:pb-20">
          <div className="relative z-10 mx-auto max-w-2xl">
            <header className="text-center">
              <h1 className="text-balance text-5xl font-semibold leading-[1.05] text-primary md:text-7xl">
                {t('title')}
              </h1>
              <div aria-hidden className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <p className="mt-8 text-balance [font-family:var(--font-display),Georgia,serif] text-2xl italic leading-snug text-ink/80 md:text-3xl">
                {t('paragraph1')}
              </p>
            </header>

            <p className="mt-14 text-lg leading-[1.85] text-ink/85 md:mt-20 md:text-xl md:leading-[1.85]">
              {t('paragraph2')}
            </p>

            {/* The cut of the blade that sealed the old oath. */}
            <div aria-hidden className="mx-auto mt-14 h-0.5 w-48 bg-gradient-to-r from-transparent via-blush to-transparent md:mt-16" />
          </div>
        </section>

        {/* The horizon: the steppe rises into the sky. It has a band of its
            own so the text above always stays on porcelain. */}
        <div aria-hidden className="h-48 bg-sky-day md:h-64" />

        <section className="relative bg-sky-dusk px-4 py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center [font-family:var(--font-display),Georgia,serif] md:space-y-8">
            <p className="text-balance text-2xl leading-snug text-porcelain/90 md:text-4xl">{t('paragraph3')}</p>
            <p className="text-balance text-2xl leading-snug text-porcelain/70 md:text-4xl">{t('paragraph4')}</p>
            <p className="text-balance pt-4 text-4xl font-semibold leading-tight text-accent [text-shadow:0_0_40px_rgb(242_193_98/0.45)] md:text-6xl">
              {t('paragraph5')}
            </p>
          </div>
        </section>

        <section className="relative bg-sky-night px-4 pt-24 pb-32 md:pt-32 md:pb-44">
          <div aria-hidden className="stars-container pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-lg leading-[1.85] text-porcelain/90 md:text-xl md:leading-[1.85]">
              {t('paragraph6')}
            </p>

            <div className="mt-20 text-center md:mt-28">
              <p className="text-balance [font-family:var(--font-display),Georgia,serif] text-3xl italic leading-snug text-porcelain md:text-5xl">
                {t('paragraph7')}
              </p>
              <Link
                href={`/${locale}/eed`}
                className="mt-12 inline-flex items-center gap-2 text-base font-semibold text-accent underline-offset-4 hover:underline md:text-lg"
              >
                {tNav('descriptions.oath')}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-brush-texture opacity-40" />
      </article>
    </>
  );
}
