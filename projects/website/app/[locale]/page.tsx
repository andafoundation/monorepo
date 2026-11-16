import { use } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/section';
import VanGoghHero from '@/components/sections/VanGoghHero';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { BOOK_COVER, LOGO_MARK_SRC, SKYYURT_PAINTING } from '@/components/site-images';
import { ORGANIZATION_JSON_LD_ID } from '@/lib/seo/build-organization-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type HomeProps = { params: Promise<{ locale: string }> };

/** The home page is the slug `''`; its canonical is `/{locale}`, never the redirecting `/`. */
const HOME_SLUG = '';

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, tSeo] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'seo' }),
  ]);
  // The layout's title template applies to the segments below it, not to this
  // page, which shares the layout's segment; the brand is appended here so the
  // home title reads like every other page's.
  return buildPageMetadata({
    title: `${t('metaTitle')} | ${tSeo('siteName')}`,
    description: t('metaDescription'),
    path: HOME_SLUG,
    locale,
  });
}

export default function Home({ params }: HomeProps) {
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations('home');

  const pillars = [
    {
      title: t('pillars.pillar1.title'),
      description: t('pillars.pillar1.description'),
    },
    {
      title: t('pillars.pillar2.title'),
      description: t('pillars.pillar2.description'),
    },
    {
      title: t('pillars.pillar3.title'),
      description: t('pillars.pillar3.description'),
    },
    {
      title: t('pillars.pillar4.title'),
      description: t('pillars.pillar4.description'),
    },
    {
      title: t('pillars.pillar5.title'),
      description: t('pillars.pillar5.description'),
    },
    {
      title: t('pillars.pillar6.title'),
      description: t('pillars.pillar6.description'),
    },
  ];

  // The home page has no main entity of its own: it introduces the foundation,
  // so its WebPage is about the Organization the layout renders.
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path: localePath(locale, HOME_SLUG),
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    aboutId: ORGANIZATION_JSON_LD_ID,
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <VanGoghHero />

      {/* ABOUT */}
      <DelftSection variant="porcelain">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <PorcelainCard className="order-2 md:order-1">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-primary">
                {t('about.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm md:text-base text-ink/80">{t('about.paragraph1')}</p>
              <p className="text-sm md:text-base text-ink/80">{t('about.paragraph2')}</p>
              <Button asChild>
                <Link href="/pilaren">{t('about.cta')}</Link>
              </Button>
            </CardContent>
          </PorcelainCard>
          {/* The transparent mark sits on the section background itself, with
              no card around it, so the yurt reads as part of the page. */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src={LOGO_MARK_SRC}
              alt={t('about.imageAlt')}
              width={1024}
              height={1024}
              sizes="(min-width: 768px) 400px, 300px"
              priority
              fetchPriority="high"
              className="w-full max-w-[300px] md:max-w-[400px] h-auto"
            />
          </div>
        </div>
      </DelftSection>

      {/* PILLARS */}
      <DelftSection variant="delft">
        <SectionHeader>
          <SectionTitle>{t('pillars.title')}</SectionTitle>
          <SectionDescription>{t('pillars.intro')}</SectionDescription>
        </SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <PorcelainCard key={index} className="hover:shadow-[0_24px_50px_-36px_rgba(11,27,51,0.55)] transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary">
                  {pillar.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-ink/80">{pillar.description}</CardDescription>
              </CardContent>
            </PorcelainCard>
          ))}
        </div>
        <div className="flex justify-center mt-8 md:mt-12">
          <Button asChild size="lg">
            <Link href="/pilaren">{t('pillars.cta')}</Link>
          </Button>
        </div>
      </DelftSection>

      {/* SKY QUOTE */}
      <DelftSection variant="sky">
        <PorcelainCard className="bg-porcelain/90 border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center text-primary">
              {t('sky.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <blockquote className="text-lg md:text-2xl italic font-light text-ink/90">
              "{t('sky.quote')}"
            </blockquote>
            <p className="text-sm md:text-base text-ink/70">
              {t('sky.description')}
            </p>
            <Button asChild size="lg" variant="outline">
              <Link href="/eed">{t('sky.cta')}</Link>
            </Button>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      {/* SKYYURT */}
      <DelftSection variant="porcelain">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <Image
              {...SKYYURT_PAINTING}
              alt="Skyyurt onder de hemel"
              placeholder="blur"
              sizes="(min-width: 1024px) 500px, (min-width: 768px) 45vw, 90vw"
              className="rounded-3xl shadow-md w-full max-w-[500px] h-auto"
            />
          </div>
          <PorcelainCard>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-primary">
                {t('skyyurt.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm md:text-base text-ink/80">{t('skyyurt.paragraph1')}</p>
              <p className="text-sm md:text-base text-ink/80">{t('skyyurt.paragraph2')}</p>
              <Button asChild>
                <Link href="/skyyurt">{t('skyyurt.cta')}</Link>
              </Button>
            </CardContent>
          </PorcelainCard>
        </div>
      </DelftSection>

      {/* MISSION, DOWNLOAD AND CONTACT: one sky that darkens from day into
          night as the visitor reads on, so the closing sections flow into
          each other and into the footer instead of standing as separate
          bands. Each section paints its own stretch of the gradient, and the
          stretches meet on the same colour; one texture layer spans all three
          so the brush strokes run on unbroken across the seams. */}
      <div className="relative isolate">
        {/* MISSION & VISION */}
        <section className="relative bg-sky-day px-4 pt-20 pb-32 md:pt-28 md:pb-40">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <Image
              src={LOGO_MARK_SRC}
              alt=""
              width={72}
              height={72}
              className="mx-auto mb-8 h-16 w-16 opacity-80 md:h-[72px] md:w-[72px]"
            />
            <SectionTitle>{t('mission.title')}</SectionTitle>
            <div aria-hidden className="mx-auto mt-6 mb-10 h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="space-y-6 [font-family:var(--font-display),Georgia,serif] text-xl leading-relaxed text-ink/80 md:text-2xl">
              <p>{t('mission.paragraph1')}</p>
              <p>{t('mission.paragraph2')}</p>
            </div>
          </div>
        </section>

        {/* DOWNLOAD */}
        <section className="relative bg-sky-dusk px-4 py-12 md:py-16">
          <div className="relative z-10 mx-auto grid max-w-anda grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12">
            <div className="flex justify-center">
              <Image
                {...BOOK_COVER}
                alt={t('downloadCta.title')}
                placeholder="blur"
                sizes="(min-width: 768px) 420px, 80vw"
                className="mask-sky-fade w-full max-w-[320px] h-auto md:max-w-[440px]"
              />
            </div>
            <div className="space-y-6 text-center md:text-left">
              <SectionTitle className="text-porcelain mb-0">{t('downloadCta.title')}</SectionTitle>
              <p className="text-base md:text-lg text-porcelain/85 max-w-md mx-auto md:mx-0">
                {t('downloadCta.description')}
              </p>
              <Button
                asChild
                size="lg"
                className="bg-porcelain text-primary shadow-[0_10px_30px_-15px_rgba(242,193,98,0.6)] hover:bg-porcelain/90"
              >
                <Link href={`/${locale}/boek`}>
                  <Download className="h-4 w-4" />
                  {t('downloadCta.cta')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CONTACT: a closing invitation under the night sky that runs on
            into the footer */}
        <section className="relative bg-sky-night px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <div aria-hidden className="stars-container pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <SectionTitle className="text-porcelain">{t('contactCta.title')}</SectionTitle>
            <p className="text-base md:text-lg text-porcelain/85">
              {t('contactCta.description')}{' '}
              <a
                href="mailto:info@andaphilosophy.com"
                className="inline-flex items-center gap-1.5 font-semibold text-accent underline-offset-4 hover:underline break-all"
              >
                <Mail aria-hidden className="h-4 w-4 shrink-0" />
                info@andaphilosophy.com
              </a>
            </p>
            <div className="mt-10 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-porcelain text-primary shadow-[0_10px_30px_-15px_rgba(242,193,98,0.6)] hover:bg-porcelain/90"
              >
                <Link href="/contact">{t('contactCta.cta')}</Link>
              </Button>
            </div>
          </div>
        </section>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-brush-texture opacity-40" />
      </div>
    </>
  );
}
