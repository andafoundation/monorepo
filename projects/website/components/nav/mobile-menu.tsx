'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAV_CTA, NAV_GROUPS, NAV_PAGES, localeHref } from '@/lib/navigation';
import { currentPagePath } from '@/components/nav/nav-menu';

export const MOBILE_MENU_ID = 'mobile-menu';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const linkClass = 'block py-2.5 font-semibold text-ink transition-colors hover:text-primary';

/**
 * The menu below `lg`: the same groups as the desktop menu, shown as eyebrow
 * headings with their pages under them so a phone visitor sees the site's shape.
 */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const activePath = currentPagePath(pathname);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      id={MOBILE_MENU_ID}
      // A collapsed panel keeps its links out of the tab order and the accessibility tree.
      inert={!open}
      className={`lg:hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
        open
          ? 'max-h-[calc(100vh-7rem)] overflow-y-auto supports-[height:100dvh]:max-h-[calc(100dvh-7rem)]'
          : 'max-h-0 overflow-hidden'
      }`}
    >
      <nav
        aria-label={t('menuLabel')}
        className="mt-3 flex flex-col rounded-3xl border border-ink/10 bg-porcelain px-4 py-3 shadow-[0_16px_36px_-28px_rgba(11,27,51,0.4)]"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="pt-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
              {t(group.labelKey)}
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={localeHref(locale, item.path)}
                    aria-current={item.path === activePath ? 'page' : undefined}
                    className={cn(linkClass, item.path === activePath && 'text-primary')}
                    onClick={onClose}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul className="mt-3 border-t border-ink/10 pt-1">
          {NAV_PAGES.map((page) => (
            <li key={page.id}>
              <Link
                href={localeHref(locale, page.path)}
                aria-current={page.path === activePath ? 'page' : undefined}
                className={cn(linkClass, page.path === activePath && 'text-primary')}
                onClick={onClose}
              >
                {t(page.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-4 h-11 bg-primary text-porcelain shadow-[0_12px_30px_-18px_var(--delft-glow)] hover:bg-primary/90">
          <Link href={localeHref(locale, NAV_CTA.path)} onClick={onClose}>
            {t(NAV_CTA.labelKey)}
          </Link>
        </Button>
      </nav>
    </div>
  );
}
