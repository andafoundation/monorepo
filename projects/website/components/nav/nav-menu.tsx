'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_GROUPS, NAV_PAGES, localeHref, type NavGroup } from '@/lib/navigation';
import { routing } from '@/lib/i18n/routing';

const topLevelClass =
  "relative inline-flex items-center gap-1 rounded-sm text-ink/80 text-sm font-semibold transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-porcelain after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

const OPEN_KEYS = ['Enter', ' ', 'ArrowDown'];

/**
 * The page slug of the current URL without its locale, so both `/en/eed` and
 * the rewritten `/eed` mark the same item as current.
 */
export function currentPagePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const isLocale = (routing.locales as readonly string[]).includes(segments[0] ?? '');
  return (isLocale ? segments[1] : segments[0]) ?? '';
}

/**
 * Desktop navigation: one disclosure panel per group, built on the Radix
 * navigation menu so hover intent, roving arrow keys, Escape with focus return,
 * outside dismissal and touch toggling behave the same in every browser.
 */
export default function NavMenu() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [value, setValue] = useState('');
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // A group opened from the keyboard moves focus into its panel; one opened by
  // hover or tap leaves focus where the pointer user put it.
  const focusOnOpen = useRef<string | null>(null);

  useEffect(() => {
    setValue('');
  }, [pathname]);

  useEffect(() => {
    if (!value || focusOnOpen.current !== value) return;
    focusOnOpen.current = null;
    // The panel mounts in the commit after the value changes, so wait a frame.
    const frame = requestAnimationFrame(() => {
      contentRefs.current[value]?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const activePath = currentPagePath(pathname);

  // Radix keeps a panel open while focus stays anywhere in the menu; tabbing
  // from a panel to another top-level item should leave that panel closed.
  const closeOtherPanel = (itemId: string) => () => {
    if (value && value !== itemId) setValue('');
  };

  const handleTriggerKeyDown = (group: NavGroup) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (value === group.id || !OPEN_KEYS.includes(event.key)) return;
    focusOnOpen.current = group.id;
    if (event.key === 'ArrowDown') {
      // Radix treats ArrowDown on a closed trigger as "next trigger"; here it opens the panel.
      event.preventDefault();
      setValue(group.id);
    }
  };

  return (
    <NavigationMenu.Root
      aria-label={t('menuLabel')}
      value={value}
      onValueChange={setValue}
      delayDuration={150}
      skipDelayDuration={300}
      className="hidden lg:block"
    >
      <NavigationMenu.List className="flex items-center gap-6">
        {NAV_GROUPS.map((group) => {
          const holdsCurrentPage = group.items.some((item) => item.path === activePath);
          return (
            <NavigationMenu.Item key={group.id} value={group.id} className="relative">
              <NavigationMenu.Trigger
                onKeyDown={handleTriggerKeyDown(group)}
                onFocus={closeOtherPanel(group.id)}
                className={cn(topLevelClass, 'group data-[state=open]:text-primary', holdsCurrentPage && 'text-primary')}
              >
                {t(group.labelKey)}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                ref={(node) => {
                  contentRefs.current[group.id] = node;
                }}
                className="absolute left-0 top-full z-50 mt-3 w-72 rounded-3xl border border-ink/10 bg-porcelain/95 p-2 shadow-[0_18px_40px_-32px_rgba(11,27,51,0.45)] backdrop-blur-sm motion-safe:data-[state=open]:animate-nav-in motion-safe:data-[state=closed]:animate-nav-out"
              >
                <ul className="flex flex-col">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <NavigationMenu.Link asChild active={item.path === activePath}>
                        <Link
                          href={localeHref(locale, item.path)}
                          className="block rounded-2xl px-3 py-2 leading-normal transition-colors duration-200 hover:bg-primary/5 hover:[&>span:first-child]:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-[active]:bg-primary/5"
                        >
                          <span className="block text-sm font-semibold text-ink">{t(item.labelKey)}</span>
                          {item.descriptionKey && (
                            <span className="block text-xs leading-snug text-ink/60">{t(item.descriptionKey)}</span>
                          )}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
        {NAV_PAGES.map((page) => (
          <NavigationMenu.Item key={page.id}>
            <NavigationMenu.Link asChild active={page.path === activePath}>
              <Link
                href={localeHref(locale, page.path)}
                onFocus={closeOtherPanel(page.id)}
                className={cn(topLevelClass, page.path === activePath && 'text-primary')}
              >
                {t(page.labelKey)}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
