'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeBackground } from '@/components/ui/theme-background';
import { oathLabel } from '@/lib/ands/label';
import type { And } from '@/lib/ands/types';
import { formatDateOnly } from '@/lib/date-only';
import { cn } from '@/lib/utils';

interface AndsStonesProps {
  /** The oaths in the order the stones stand. */
  oaths: And[];
  /** The oath shown when the URL names none, as on the bare Ands page. */
  initialId: string;
}

/** -1 steps back, 1 steps forward, 0 is the first stone on screen. */
type Direction = -1 | 0 | 1;

// Pale limestone: soft light from the top left, weathering towards the base, and two fine grains so the
// surface reads as stone without an image. The carved text stays dark on it for contrast on a phone.
const STONE_STYLE: CSSProperties = {
  clipPath: 'polygon(3% 0, 97% 0, 100% 100%, 0 100%)',
  borderRadius: '50% 50% 0.75rem 0.75rem / clamp(5rem, 22vw, 10rem) clamp(5rem, 22vw, 10rem) 0.75rem 0.75rem',
  backgroundImage: [
    'radial-gradient(ellipse 80% 50% at 30% 15%, rgba(255, 255, 255, 0.35), transparent 70%)',
    'radial-gradient(ellipse 70% 40% at 75% 90%, rgba(60, 50, 38, 0.28), transparent 70%)',
    'radial-gradient(circle at 18% 62%, rgba(90, 80, 66, 0.14), transparent 22%)',
    'radial-gradient(circle at 82% 34%, rgba(90, 80, 66, 0.12), transparent 18%)',
    'repeating-radial-gradient(circle at 37% 41%, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 5px)',
    'repeating-linear-gradient(112deg, rgba(70, 60, 48, 0.05) 0 1px, transparent 1px 9px)',
    'linear-gradient(180deg, #d6d0c4 0%, #c4bdaf 45%, #aea698 100%)',
  ].join(', '),
  boxShadow: [
    'inset 0 3px 0 rgba(255, 255, 255, 0.45)',
    'inset 0 -40px 60px -20px rgba(55, 46, 34, 0.45)',
    'inset 18px 0 40px -18px rgba(55, 46, 34, 0.35)',
    'inset -18px 0 40px -18px rgba(55, 46, 34, 0.4)',
  ].join(', '),
};

// Letters cut into the face: a light lip under each stroke and a shadow above it.
const CARVED_TEXT_STYLE: CSSProperties = {
  color: '#38322a',
  textShadow: '0 1px 0 rgba(255, 255, 255, 0.55), 0 -1px 1px rgba(40, 32, 22, 0.35)',
};

// The stone on screen slides away to the side it is left towards, while the next one rises out of the ground.
const STONE_VARIANTS: Variants = {
  enter: { opacity: 0, y: '35%', x: 0, rotate: 0 },
  center: { opacity: 1, y: 0, x: 0, rotate: 0 },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction < 0 ? '115%' : '-115%',
    rotate: direction < 0 ? 5 : -5,
  }),
};

const REDUCED_VARIANTS: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const STONE_TRANSITION: Transition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] };

// A line this long wraps into four or more lines on a phone, and an oath of this many lines (stanza breaks
// included) is already taller than a phone screen, so the whole oath steps down one type size and the stone
// stays readable without growing far past the screen.
const LONG_LINE_LENGTH = 100;
const LONG_OATH_LENGTH = 600;
const LONG_OATH_LINE_COUNT = 16;

const OATH_TEXT_CLASS = 'text-[clamp(1.15rem,0.85rem+1.5vw,1.85rem)] leading-[1.55]';
const LONG_OATH_TEXT_CLASS = 'text-[clamp(1.05rem,0.8rem+1.2vw,1.6rem)] leading-[1.5]';

function isLongOath(oath: And): boolean {
  const total = oath.lines.reduce((sum, line) => sum + line.length, 0);
  return (
    total > LONG_OATH_LENGTH ||
    oath.lines.length > LONG_OATH_LINE_COUNT ||
    oath.lines.some((line) => line.length > LONG_LINE_LENGTH)
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/** A plain click that the page may take over; a modified or middle click keeps the browser's own behaviour. */
function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

interface StepLinkProps {
  href: string | null;
  label: string;
  onStep: () => void;
  children: ReactNode;
}

const STEP_CLASS =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink';

function StepLink({ href, label, onStep, children }: StepLinkProps) {
  if (href === null) {
    return (
      <span aria-hidden className={cn(STEP_CLASS, 'border-porcelain/10 text-porcelain/25')}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      aria-label={label}
      onClick={(event) => {
        if (!isPlainClick(event)) return;
        event.preventDefault();
        onStep();
      }}
      className={cn(STEP_CLASS, 'border-porcelain/30 bg-ink/30 text-porcelain backdrop-blur-sm hover:bg-porcelain/10')}
    >
      {children}
    </a>
  );
}

/**
 * The oaths, each carved on one stele. Stepping between stones changes the URL with the History API instead
 * of a Next navigation: the page segment stays mounted, so the leaving stone can finish its exit while the
 * next one rises, and every stone still has its own address to share or reload.
 */
export default function AndsStones({ oaths, initialId }: AndsStonesProps) {
  const t = useTranslations('ands');
  const tSeo = useTranslations('seo');
  const format = useFormatter();
  const locale = useLocale();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;

  const lastSegment = pathname.split('/').filter(Boolean).pop() ?? '';
  const pathIndex = oaths.findIndex((oath) => oath.id === lastSegment);
  const index = pathIndex !== -1 ? pathIndex : Math.max(0, oaths.findIndex((oath) => oath.id === initialId));

  // The direction is derived from the index the stones last showed, so the browser's back and forward
  // buttons slide the stones the right way too.
  const [shown, setShown] = useState<{ index: number; direction: Direction }>({ index, direction: 0 });
  if (shown.index !== index) {
    setShown({ index, direction: index > shown.index ? 1 : -1 });
  }

  const hrefOf = useCallback((id: string) => `/${locale}/ands/${id}`, [locale]);

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= oaths.length || target === index) return;
      window.history.pushState(null, '', hrefOf(oaths[target].id));
    },
    [oaths, index, hrefOf],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      // Alt and Meta with an arrow are the browser's own back and forward.
      if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (event.defaultPrevented || isTypingTarget(event.target)) return;
      const target = event.key === 'ArrowLeft' ? index - 1 : index + 1;
      if (target < 0 || target >= oaths.length) return;
      event.preventDefault();
      goTo(target);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, oaths.length, goTo]);

  // A step changes the URL without a Next navigation, so the page metadata does not run again: the tab
  // title is set here to what a reload of the same address would show.
  const titleLabel = oaths[index] === undefined ? null : oathLabel(oaths[index]);
  const siteName = tSeo('siteName');
  const pageTitle =
    pathIndex === -1
      ? `${t('metaTitle')} | ${siteName}`
      : `${t('title')} · ${titleLabel ?? t('untitled', { ordinal: index + 1 })} | ${siteName}`;
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const oath = oaths[index];
  if (oath === undefined) {
    throw new Error('AndsStones needs at least one oath');
  }

  const dateLabel =
    oath.date === null
      ? null
      : formatDateOnly(format, oath.date, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
  const name = oath.title ?? oath.version ?? dateLabel ?? t('untitled', { ordinal: index + 1 });
  const previous = index > 0 ? oaths[index - 1] : null;
  const next = index < oaths.length - 1 ? oaths[index + 1] : null;

  return (
    <ThemeBackground variant="ink" className="min-h-screen px-4 pb-20 pt-28 md:pt-32">
      <div aria-hidden className="stars-container pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-brush-glow motion-reduce:animate-none" />
      <div aria-hidden className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-porcelain/10 blur-3xl animate-brush-drift motion-reduce:animate-none" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl text-porcelain drop-shadow-[0_10px_24px_rgba(11,27,51,0.35)] md:text-5xl">{t('title')}</h1>
          <p className="mt-3 text-sm leading-relaxed text-porcelain/75 text-balance md:text-base">{t('intro')}</p>
        </header>

        {/* The stage clips at the ground line, so a new stone rises out of the earth and a leaving one
            never widens the page. */}
        <div className="mt-8 grid overflow-hidden pt-4 md:mt-10">
          <AnimatePresence initial={false} custom={shown.direction}>
            <motion.div
              key={oath.id}
              custom={shown.direction}
              variants={reduceMotion ? REDUCED_VARIANTS : STONE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : STONE_TRANSITION}
              style={{ transformOrigin: '50% 100%' }}
              className="mx-auto flex w-full max-w-2xl [grid-area:1/1] drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]"
            >
              <article
                lang={oath.language}
                aria-labelledby={`oath-${oath.id}-name`}
                style={STONE_STYLE}
                className="flex min-h-[70svh] w-full flex-col items-center px-6 pb-6 pt-[clamp(4.5rem,18vw,8rem)] sm:px-12"
              >
                <h2 id={`oath-${oath.id}-name`} lang={locale} className="sr-only">
                  {dateLabel === null ? name : `${name}, ${dateLabel}`}
                </h2>

                <div
                  style={CARVED_TEXT_STYLE}
                  className={cn(
                    'my-auto w-full text-center [font-family:var(--font-display),Georgia,serif]',
                    isLongOath(oath) ? LONG_OATH_TEXT_CLASS : OATH_TEXT_CLASS,
                  )}
                >
                  {/* Each line is followed by a newline text node. Layout ignores it between block spans, but the
                      page's plain text (copying, reader views, crawlers) keeps one line per oath line instead of
                      running the last word of a line into the first word of the next. */}
                  {oath.lines.map((line, lineIndex) => (
                    <Fragment key={lineIndex}>
                      {line === '' ? (
                        <span aria-hidden className="block h-5 md:h-7" />
                      ) : (
                        <span className="block whitespace-pre-wrap break-words text-balance">{line}</span>
                      )}
                      {'\n'}
                    </Fragment>
                  ))}
                </div>

                <footer lang={locale} className="mt-10 flex w-full flex-col items-center gap-2" style={{ color: '#4f473c' }}>
                  <span aria-hidden className="h-px w-16 bg-[#4f473c]/30 shadow-[0_1px_0_rgba(255,255,255,0.5)]" />
                  <p className="flex flex-wrap items-center justify-center gap-x-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] sm:text-xs">
                    {/* An undated oath carries its title where a dated one carries its date. */}
                    {oath.title !== null && <span>{oath.title}</span>}
                    {dateLabel !== null && <span>{dateLabel}</span>}
                    {oath.version !== null && <span className="tabular-nums">{oath.version}</span>}
                  </p>
                </footer>
              </article>
            </motion.div>
          </AnimatePresence>
        </div>

        <div aria-hidden className="relative h-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-porcelain/45 to-transparent" />
          <div className="absolute left-1/2 top-0 h-5 w-4/5 -translate-x-1/2 rounded-[50%] bg-black/35 blur-xl" />
        </div>

        <nav aria-label={t('stones')} className="mt-2 flex items-center justify-center gap-4">
          <StepLink href={previous === null ? null : hrefOf(previous.id)} label={t('previous')} onStep={() => goTo(index - 1)}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </StepLink>

          <ol className="flex items-center">
            {oaths.map((entry, entryIndex) => {
              const current = entryIndex === index;
              return (
                <li key={entry.id}>
                  <a
                    href={hrefOf(entry.id)}
                    aria-label={t('goTo', { number: entryIndex + 1 })}
                    aria-current={current ? 'page' : undefined}
                    onClick={(event) => {
                      if (!isPlainClick(event)) return;
                      event.preventDefault();
                      goTo(entryIndex);
                    }}
                    className="flex h-11 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span
                      className={cn(
                        'block h-2.5 rounded-full transition-all duration-300',
                        current ? 'w-6 bg-porcelain' : 'w-2.5 bg-porcelain/35 hover:bg-porcelain/60',
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ol>

          <StepLink href={next === null ? null : hrefOf(next.id)} label={t('next')} onStep={() => goTo(index + 1)}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </StepLink>
        </nav>

        <p className="mt-2 text-center text-sm tabular-nums text-porcelain/60" aria-live="polite">
          {t('counter', { current: index + 1, total: oaths.length })}
        </p>
      </div>
    </ThemeBackground>
  );
}
