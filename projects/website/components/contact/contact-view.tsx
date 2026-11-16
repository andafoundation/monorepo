'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { Button } from '@/components/ui/button';
import { ThemeBackground } from '@/components/ui/theme-background';

export default function ContactView() {
  const t = useTranslations('contact');
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus(t('formSending'));

    setTimeout(() => {
      setFormStatus(t('formSuccess'));
    }, 1500);
  };

  return (
    <div>
      <ThemeBackground variant="sky" className="relative pt-32 md:pt-36 pb-16 md:pb-24 px-4">
        <div className="relative z-10 text-center text-porcelain max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-sm md:text-base text-porcelain/85">
            {t('heroDescription')}
          </p>
        </div>
      </ThemeBackground>

      <DelftSection variant="porcelain">
        <PorcelainCard className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary text-center">
              {t('addressTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm md:text-base text-ink/80">
              <strong>{t('foundationName')}</strong><br />
              {t('street')}<br />
              {t('city')}<br />
              {t('region')}
            </p>
            <p className="mb-4 text-sm md:text-base text-ink/80">
              <strong>E-mail:</strong>{' '}
              <a href={`mailto:${t('email')}`} className="text-primary hover:underline">
                {t('email')}
              </a>
            </p>
            <p className="mb-4 text-sm md:text-base text-ink/80">
              <strong>Telefoon:</strong> {t('phone')}
            </p>
            <p className="text-sm md:text-base text-ink/80">
              <strong>KvK:</strong> {t('kvk')} – <strong>RSIN:</strong> {t('rsin')}<br />
              <strong>IBAN:</strong> {t('iban')} – <strong>BIC:</strong> {t('bic')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="delft">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              {t('aboutFoundationTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base text-ink/80">
              {t('aboutFoundationParagraph1')}
            </p>
            <p className="text-sm md:text-base text-ink/80">
              {t('aboutFoundationParagraph2')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="porcelain">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              {t('approachTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base text-ink/80">
              {t('approachParagraph1')}
            </p>
            <p className="text-sm md:text-base text-ink/80">
              {t('approachParagraph2')}
            </p>
            <p className="text-sm md:text-base text-ink/80">
              {t('approachParagraph3')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="delft">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              {t('partnershipsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base text-ink/80">
              {t('partnershipsIntro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-ink/80">
              <li>{t('partnershipsArea1')}</li>
              <li>{t('partnershipsArea2')}</li>
              <li>{t('partnershipsArea3')}</li>
              <li>{t('partnershipsArea4')}</li>
            </ul>
            <p className="text-sm md:text-base text-ink/80">
              {t('partnershipsConclusion')}
            </p>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="porcelain">
        <PorcelainCard className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              {t('accessibilityTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base text-ink/80">
              {t('accessibilityIntro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-ink/80">
              <li>{t('accessibilityOption1')}</li>
              <li>{t('accessibilityOption2')}</li>
              <li>{t('accessibilityOption3')}</li>
            </ul>
          </CardContent>
        </PorcelainCard>
      </DelftSection>

      <DelftSection variant="delft" className="pb-0">
        <PorcelainCard className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary text-center">
              {t('formTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-8 text-sm md:text-base text-ink/70">
              {t('formIntro')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="naam" className="block mb-2 font-semibold text-sm md:text-base">
                  {t('formName')}
                </label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  placeholder={t('formNamePlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-ink/20 rounded-2xl bg-porcelain/80 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-sm md:text-base">
                  {t('formEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('formEmailPlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-ink/20 rounded-2xl bg-porcelain/80 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                />
              </div>

              <div>
                <label htmlFor="onderwerp" className="block mb-2 font-semibold text-sm md:text-base">
                  {t('formSubject')}
                </label>
                <input
                  type="text"
                  id="onderwerp"
                  name="onderwerp"
                  placeholder={t('formSubjectPlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-ink/20 rounded-2xl bg-porcelain/80 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                />
              </div>

              <div>
                <label htmlFor="bericht" className="block mb-2 font-semibold text-sm md:text-base">
                  {t('formMessage')}
                </label>
                <textarea
                  id="bericht"
                  name="bericht"
                  rows={6}
                  placeholder={t('formMessagePlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-ink/20 rounded-2xl bg-porcelain/80 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full px-6 py-3 font-semibold"
              >
                {t('formSubmit')}
              </Button>
            </form>

            {formStatus && (
              <p className="mt-4 text-center text-sm md:text-base font-semibold text-primary">
                {formStatus}
              </p>
            )}
          </CardContent>
        </PorcelainCard>
      </DelftSection>
    </div>
  );
}
