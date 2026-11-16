'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import { ThemeBackground } from '@/components/ui/theme-background';
import { filterAnds, languagesOf, monthsOf, neighbours } from '@/lib/ands/select';
import type { And } from '@/lib/ands/types';
import PoemsCard from './poems-card';
import PoemsFilterBar from './poems-filter-bar';
import { usePoemsFilter } from './poems-filter-provider';
import PoemsIndex, { POEMS_INDEX_ATTRIBUTE } from './poems-index';

interface PoemsReaderProps {
  ands: And[];
  currentId: string;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  // Arrow keys pressed inside the index belong to the list, not to the pager.
  if (target.closest(`[${POEMS_INDEX_ATTRIBUTE}]`) !== null) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export default function PoemsReader({ ands, currentId }: PoemsReaderProps) {
  const t = useTranslations('poems');
  const locale = useLocale();
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;
  const { filter, setMonth, setLanguage } = usePoemsFilter();
  const [indexOpen, setIndexOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const indexId = useId();

  const current = ands.find((and) => and.id === currentId) ?? ands[ands.length - 1];
  const filtered = useMemo(() => filterAnds(ands, filter), [ands, filter]);
  const { previous, next } = useMemo(() => neighbours(ands, current.id, filter), [ands, current.id, filter]);
  const months = useMemo(() => monthsOf(ands), [ands]);
  const languages = useMemo(() => languagesOf(ands), [ands]);

  // The counter describes the filtered list while the And on screen belongs to it. An And outside the
  // filter keeps its place in the whole collection, so the number never points at a list it is not in.
  const filteredPosition = filtered.findIndex((and) => and.id === current.id);
  const position = filteredPosition === -1 ? ands.findIndex((and) => and.id === current.id) + 1 : filteredPosition + 1;
  const total = filteredPosition === -1 ? ands.length : filtered.length;

  const hrefOf = useCallback((id: string) => `/${locale}/poems/${id}`, [locale]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      // Alt and Meta with an arrow are the browser's own back and forward.
      if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (event.defaultPrevented || isTypingTarget(event.target)) return;
      const target = event.key === 'ArrowLeft' ? previous : next;
      if (target === null) return;
      event.preventDefault();
      router.push(hrefOf(target.id), { scroll: false });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previous, next, router, hrefOf]);

  function openFromIndex(id: string) {
    setIndexOpen(false);
    if (id !== current.id) {
      router.push(hrefOf(id), { scroll: false });
    }
    cardRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <ThemeBackground variant="ink" className="min-h-screen px-4 pb-24 pt-32 md:pt-36">
      <div aria-hidden className="stars-container pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-brush-glow motion-reduce:animate-none" />
      <div aria-hidden className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-porcelain/10 blur-3xl animate-brush-drift motion-reduce:animate-none" />
      <div aria-hidden className="pointer-events-none absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-blush/20 blur-3xl animate-brush-float motion-reduce:animate-none" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl text-porcelain drop-shadow-[0_10px_24px_rgba(11,27,51,0.35)] md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-porcelain/80 text-balance md:text-lg">{t('intro')}</p>
        </header>

        <PoemsFilterBar
          className="mt-10"
          months={months}
          languages={languages}
          filter={filter}
          onMonthChange={setMonth}
          onLanguageChange={setLanguage}
          indexOpen={indexOpen}
          indexId={indexId}
          onToggleIndex={() => setIndexOpen((open) => !open)}
        />

        <div ref={cardRef} className="mt-8 scroll-mt-28">
          <PoemsCard
            and={current}
            position={position}
            total={total}
            previousHref={previous === null ? null : hrefOf(previous.id)}
            nextHref={next === null ? null : hrefOf(next.id)}
            reduceMotion={reduceMotion}
          />
        </div>

        <PoemsIndex
          id={indexId}
          ands={filtered}
          currentId={current.id}
          open={indexOpen}
          onSelect={openFromIndex}
          onClose={() => setIndexOpen(false)}
          reduceMotion={reduceMotion}
        />
      </div>
    </ThemeBackground>
  );
}
