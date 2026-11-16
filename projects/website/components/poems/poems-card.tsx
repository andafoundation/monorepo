'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment, useEffect } from 'react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import type { And } from '@/lib/ands/types';
import { formatDateOnly } from '@/lib/date-only';
import { cn } from '@/lib/utils';
import { usePoemsFilter } from './poems-filter-provider';

interface PoemsCardProps {
  and: And;
  position: number;
  total: number;
  previousHref: string | null;
  nextHref: string | null;
  reduceMotion: boolean;
}

interface StepButtonProps {
  href: string | null;
  label: string;
  direction: 'previous' | 'next';
}

function StepButton({ href, label, direction }: StepButtonProps) {
  const icon =
    direction === 'previous' ? <ChevronLeft className="h-4 w-4" aria-hidden /> : <ChevronRight className="h-4 w-4" aria-hidden />;
  const content = (
    <>
      {direction === 'previous' && icon}
      <span className="hidden sm:inline">{label}</span>
      {direction === 'next' && icon}
    </>
  );
  const className = 'min-w-11 px-3 sm:px-5';

  if (href === null) {
    return (
      <Button type="button" variant="outline" disabled aria-label={label} className={className}>
        {content}
      </Button>
    );
  }
  return (
    <Button asChild variant="outline" className={className}>
      <Link href={href} scroll={false} aria-label={label} rel={direction === 'previous' ? 'prev' : 'next'}>
        {content}
      </Link>
    </Button>
  );
}

export default function PoemsCard({ and, position, total, previousHref, nextHref, reduceMotion }: PoemsCardProps) {
  const t = useTranslations('poems');
  const format = useFormatter();
  const locale = useLocale();
  const { cardShownRef } = usePoemsFilter();

  // The first card arrives already visible in the prerendered HTML; only the steps after it fade in, so the
  // poem never waits for JavaScript to become readable.
  const animateEntry = !reduceMotion && cardShownRef.current;
  useEffect(() => {
    cardShownRef.current = true;
  }, [cardShownRef]);

  const dateLabel =
    and.date === null
      ? t('untitled', { ordinal: and.ordinal })
      : formatDateOnly(format, and.date, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

  return (
    <PorcelainCard className="relative overflow-hidden border-ink/15 bg-[linear-gradient(160deg,rgba(247,243,236,0.98),rgba(247,243,236,0.9))] shadow-[0_24px_60px_-45px_rgba(11,27,51,0.5)]">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

      <motion.article
        key={and.id}
        lang={and.language}
        aria-labelledby={`poem-${and.id}-date`}
        initial={animateEntry ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative px-6 py-10 md:px-14 md:py-14"
      >
        {/* The article carries the poem's language; its chrome stays in the page's language. */}
        <header lang={locale}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{t('eyebrow')}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
            <h2 id={`poem-${and.id}-date`} className="text-2xl text-primary md:text-3xl">
              {dateLabel}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {and.version !== null && (
                <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {and.version}
                </span>
              )}
              <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-ink/70">
                {t(`language.${and.language}`)}
              </span>
            </div>
          </div>
        </header>

        <div aria-hidden className="my-8 flex items-center gap-3 md:my-10">
          <span className="h-px flex-1 bg-primary/10" />
          <span className="h-1.5 w-1.5 rotate-45 bg-accent/80" />
          <span className="h-px flex-1 bg-primary/10" />
        </div>

        <div className="[font-family:var(--font-display),Georgia,serif] text-xl leading-relaxed text-ink/90 md:text-2xl">
          {and.title !== null && (
            <h3 className="mb-6 text-2xl font-semibold text-primary md:text-3xl">{and.title}</h3>
          )}
          {/* Each line is followed by a newline text node. Layout ignores it between block spans, but the
              page's plain text (copying, reader views, crawlers) keeps one line per verse line instead of
              running the last word of a line into the first word of the next. */}
          {and.lines.map((line, index) => (
            <Fragment key={index}>
              {line === '' ? (
                <span aria-hidden className="block h-6" />
              ) : (
                // A wrapped line hangs under its first word, so the reader still sees where the poet broke it.
                <span
                  className={cn(
                    'block whitespace-pre-wrap break-words pl-6 -indent-6',
                    and.emphasis?.[index] === 'italic' && 'italic',
                    and.emphasis?.[index] === 'bold' && 'font-semibold',
                  )}
                >
                  {line}
                </span>
              )}
              {'\n'}
            </Fragment>
          ))}
        </div>
      </motion.article>

      <footer className="relative border-t border-primary/10 px-6 py-5 md:px-14">
        <div className="flex items-center justify-between gap-3">
          <StepButton href={previousHref} label={t('previous')} direction="previous" />
          <p className="text-sm tabular-nums text-ink/60" aria-live="polite">
            {t('counter', { current: position, total })}
          </p>
          <StepButton href={nextHref} label={t('next')} direction="next" />
        </div>
      </footer>
    </PorcelainCard>
  );
}
