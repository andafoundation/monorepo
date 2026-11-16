'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import NavMenu from '@/components/nav/nav-menu';
import MobileMenu, { MOBILE_MENU_ID } from '@/components/nav/mobile-menu';
import { Button } from '@/components/ui/button';
import { LOGO_MARK_SRC } from '@/components/site-images';
import { NAV_CTA, localeHref } from '@/lib/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    // 1) Fixed wrapper so it always stays visible
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between rounded-full border border-ink/10 bg-porcelain/90 px-4 py-2 shadow-[0_18px_40px_-28px_rgba(11,27,51,0.45)] backdrop-blur-md md:px-6">
          <Link href={`/${locale}`} aria-label={t('home')} className="flex items-center gap-3">
            {/*
              The mark file is square with empty bands above and below the
              wide yurt. The box is a little taller than the yurt's own ratio
              (1024:608 against 1024:573) and object-cover trims the rest of
              those bands, so the yurt fills the height without touching an edge.
              The 64px height keeps the pill at 98px, well under the pages' top
              padding (pt-32) and anchor offsets (scroll-mt-28, lg:scroll-mt-32).
            */}
            <Image
              src={LOGO_MARK_SRC}
              alt="Anda"
              width={108}
              height={64}
              sizes="108px"
              className="h-16 w-[108px] object-cover hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>

          <NavMenu />

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild className="h-10 px-6 bg-primary text-porcelain shadow-[0_12px_30px_-18px_var(--delft-glow)] hover:bg-primary/90">
              <Link href={localeHref(locale, NAV_CTA.path)}>{t(NAV_CTA.labelKey)}</Link>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            >
              <span
                className={`bg-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}
              />
              <span
                className={`bg-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`bg-primary block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <MobileMenu open={isMenuOpen} onClose={closeMenu} />
      </div>
    </header>
  );
}
