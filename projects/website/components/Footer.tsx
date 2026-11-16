'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ThemeBackground } from '@/components/ui/theme-background';
import { NAV_CTA, NAV_GROUPS, NAV_PAGES, localeHref } from '@/lib/navigation';

const LEGAL_PATHS = ['privacy', 'cookies', 'disclaimer'] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  // The header's Connect button reads as a call to action; in the footer the
  // same page is a plain directory entry, so it carries the "Contact" label.
  const identityLinks = [
    ...NAV_PAGES.map((page) => ({ id: page.id, path: page.path, label: tNav(page.labelKey) })),
    { id: NAV_CTA.id, path: NAV_CTA.path, label: tNav('contact') },
  ];

  // The body is a full-height flex column, and ThemeBackground clips its
  // overflow, so without shrink-0 a long page squeezes the footer to nothing.
  return (
    <ThemeBackground variant="ink" className="shrink-0">
      {/* The top of the footer starts on plain ink, the colour the home page's
          night sky ends on, so the page runs into the footer without a seam. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <footer className="relative text-porcelain">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] gap-8 text-sm md:text-base">

            {/* Foundation identity, mission, ANBI line and the pages outside the groups */}
            <div className="space-y-3">
              <p className="font-semibold text-lg">
                {t('foundationName')}
              </p>
              <p className="text-porcelain/80 leading-relaxed">
                {t('shortMission')}
              </p>
              <p className="text-porcelain/70 text-sm">
                {t('anbiLine')}
              </p>
              <ul className="space-y-2 pt-2 text-porcelain/90">
                {identityLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={localeHref(locale, link.path)} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* One column per navigation group, in the header's order */}
            {NAV_GROUPS.map((group) => (
              <nav key={group.id} aria-label={tNav(group.labelKey)}>
                <p className="font-semibold mb-3">
                  {tNav(group.labelKey)}
                </p>
                <ul className="space-y-2 text-porcelain/90">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link href={localeHref(locale, item.path)} className="hover:underline">
                        {tNav(item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Legal and contact details */}
            <div className="space-y-3">
              <p className="font-semibold mb-1">
                {t('contactTitle')}
              </p>

              <div className="text-porcelain/90 leading-relaxed">
                <p>{t('address.line1')}</p>
                <p>{t('address.line2')}</p>
                <p>{t('address.line3')}</p>
              </div>

              <p className="text-porcelain/90">
                <span className="font-semibold">{t('emailLabel')}:</span>{' '}
                <a href={`mailto:${t('email')}`} className="hover:underline break-all">
                  {t('email')}
                </a>
              </p>

              <p className="text-porcelain/90">
                <span className="font-semibold">{t('phoneLabel')}:</span>{' '}
                {t('phone')}
              </p>

              <div className="pt-2 text-porcelain/80 text-sm leading-relaxed">
                <p><span className="font-semibold">KvK:</span> {t('kvk')}</p>
                <p><span className="font-semibold">RSIN:</span> {t('rsin')}</p>
                <p><span className="font-semibold">IBAN:</span> {t('iban')}</p>
                <p><span className="font-semibold">BIC:</span> {t('bic')}</p>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-10 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-porcelain/70">
            <p>{t('copyright')}</p>

            <div className="flex gap-4">
              {LEGAL_PATHS.map((path) => (
                <Link key={path} href={localeHref(locale, path)} className="hover:underline">
                  {t(path)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </ThemeBackground>
  );
}
