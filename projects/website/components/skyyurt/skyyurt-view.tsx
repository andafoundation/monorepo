'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { Button } from '@/components/ui/button';
import { ThemeBackground } from '@/components/ui/theme-background';
import { NOMADS_HEART_CONCEPT, SKYSTONE_CONCEPT, SKYYURT_CONCEPT } from '@/components/site-images';

export default function SkyyurtView() {
  const t = useTranslations('skyyurt');

  const handleDonation = () => {
    alert(t('donationComingSoon'));
  };

  return (
    <div>
      <ThemeBackground variant="sky" className="relative pt-32 md:pt-36 pb-16 md:pb-24 px-4">
        <div className="relative z-10 text-center text-porcelain max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-porcelain/85">
            {t('heroDescription')}
          </p>
        </div>
      </ThemeBackground>


      <DelftSection variant="porcelain">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary text-center">
              {t('introTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base leading-relaxed text-ink/80">
              {t('introParagraph1')}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-ink/80">
              {t('introParagraph2')}
            </p>
            <p className="text-sm md:text-base leading-relaxed text-ink/80">
              {t('introParagraph3')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="delft">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-96">
              <Image
                src={SKYYURT_CONCEPT.src}
                placeholder="blur"
                blurDataURL={SKYYURT_CONCEPT.blurDataURL}
                alt="Skyyurt concept"
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 90vw"
                className="object-cover rounded-3xl shadow-md"
              />
            </div>
            <PorcelainCard>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-primary">
                  {t('skyyurtTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-ink/80">
                  {t('skyyurtParagraph')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base ml-4 text-ink/80">
                  <li>{t('skyyurtFeature1')}</li>
                  <li>{t('skyyurtFeature2')}</li>
                  <li>{t('skyyurtFeature3')}</li>
                </ul>
              </CardContent>
            </PorcelainCard>
          </div>
        </div>
      </DelftSection>

      <DelftSection variant="porcelain">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <PorcelainCard className="order-2 md:order-1">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-primary">
                  {t('skystoneTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-ink/80">
                  {t('skystoneParagraph')}
                </p>
                <blockquote className="italic text-primary text-base md:text-lg border-l-4 border-primary pl-4">
                  {t('skystoneQuote')}
                </blockquote>
              </CardContent>
            </PorcelainCard>
            <div className="order-1 md:order-2 relative h-64 md:h-96">
              <Image
                src={SKYSTONE_CONCEPT.src}
                placeholder="blur"
                blurDataURL={SKYSTONE_CONCEPT.blurDataURL}
                alt="Skystone concept"
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 90vw"
                className="object-contain rounded-3xl"
              />
            </div>
          </div>
        </div>
      </DelftSection>

      <DelftSection variant="delft">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-96">
              <Image
                src={NOMADS_HEART_CONCEPT.src}
                placeholder="blur"
                blurDataURL={NOMADS_HEART_CONCEPT.blurDataURL}
                alt="Nomads Heart concept"
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 90vw"
                className="object-cover rounded-3xl shadow-md"
              />
            </div>
            <PorcelainCard>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-primary">
                  {t('nomadsHeartTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm md:text-base text-ink/80">
                  {t('nomadsHeartParagraph')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base ml-4 text-ink/80">
                  <li>{t('nomadsHeartFeature1')}</li>
                  <li>{t('nomadsHeartFeature2')}</li>
                  <li>{t('nomadsHeartFeature3')}</li>
                </ul>
              </CardContent>
            </PorcelainCard>
          </div>
        </div>
      </DelftSection>

      {/* ✅ PURPOSE / VISION SECTION — redesigned for readability */}
      <DelftSection variant="porcelain">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary text-center">
              {t('purposeTitle')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 text-sm md:text-base leading-relaxed">
            <p className="text-center max-w-3xl mx-auto text-ink/80">
              {t('purposeIntro')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: t('purposePoint1Title'), text: t('purposePoint1Text') },
                { title: t('purposePoint2Title'), text: t('purposePoint2Text') },
                { title: t('purposePoint3Title'), text: t('purposePoint3Text') },
                { title: t('purposePoint4Title'), text: t('purposePoint4Text') },
                { title: t('purposePoint5Title'), text: t('purposePoint5Text') },
                { title: t('purposePoint6Title'), text: t('purposePoint6Text') },
                { title: t('purposePoint7Title'), text: t('purposePoint7Text') },
                { title: t('purposePoint8Title'), text: t('purposePoint8Text') },
              ].map((p, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-ink/10 bg-porcelain/70 p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-primary mb-2">
                    {p.title}
                  </h3>
                  <p className="text-ink/80">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center max-w-3xl mx-auto text-ink/80">
              {t('purposeConclusion')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="sky" className="pb-0">
        <PorcelainCard className="max-w-4xl mx-auto bg-porcelain/90 border-white/20">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              {t('donationTitle')}
            </h2>
            <p className="mb-8 text-sm md:text-base text-ink/75">
              {t('donationParagraph')}
            </p>
            <Button
              onClick={handleDonation}
              className="px-8 py-3"
            >
              {t('donationButton')}
            </Button>
          </CardContent>
        </PorcelainCard>
      </DelftSection>
    </div>
  );
}
