'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { cn } from '@/lib/utils';
import type { And } from '@/lib/ands/types';
import { formatDateOnly } from '@/lib/date-only';

/** Marks the index panel, so the reader can leave arrow keys pressed inside it to the list. */
export const POEMS_INDEX_ATTRIBUTE = 'data-poems-index';

interface PoemsIndexProps {
  id: string;
  ands: And[];
  currentId: string;
  open: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  reduceMotion: boolean;
}

interface DateGroup {
  date: string | null;
  ands: And[];
}

function groupByDate(ands: And[]): DateGroup[] {
  const groups: DateGroup[] = [];
  for (const and of ands) {
    const last = groups[groups.length - 1];
    if (last !== undefined && last.date === and.date) {
      last.ands.push(and);
    } else {
      groups.push({ date: and.date, ands: [and] });
    }
  }
  return groups;
}

/** The poem's title when it has one, else its first verse line. */
function firstLine(and: And): string {
  return and.title ?? and.lines.find((line) => line.trim() !== '') ?? '';
}

export default function PoemsIndex({ id, ands, currentId, open, onSelect, onClose, reduceMotion }: PoemsIndexProps) {
  const t = useTranslations('poems');
  const format = useFormatter();
  const groups = groupByDate(ands);

  const dateLabel = (date: string | null) =>
    date === null
      ? t('title')
      : formatDateOnly(format, date, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          {...{ [POEMS_INDEX_ATTRIBUTE]: '' }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          onKeyDown={(event) => {
            if (event.key === 'Escape') onClose();
          }}
        >
          <PorcelainCard className="mt-6 border-ink/15 bg-porcelain/95 px-4 py-6 md:px-8 md:py-8">
            <div className="mb-4 flex items-center justify-between gap-3 px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{t('eyebrow')}</p>
              <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t('closeIndex')} className="h-9 w-9 rounded-full">
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>

            {groups.length === 0 ? (
              <p className="px-2 py-6 text-center text-ink/70">{t('empty')}</p>
            ) : (
              <div className="space-y-6">
                {groups.map((group) => (
                  <section key={group.date ?? 'undated'} aria-label={dateLabel(group.date)}>
                    <h3 className="px-2 text-xl text-primary">{dateLabel(group.date)}</h3>
                    <ul className="mt-2 space-y-1">
                      {group.ands.map((and) => {
                        const current = and.id === currentId;
                        return (
                          <li key={and.id}>
                            <button
                              type="button"
                              onClick={() => onSelect(and.id)}
                              aria-current={current ? 'page' : undefined}
                              className={cn(
                                'flex w-full flex-col gap-1 rounded-2xl px-3 py-2.5 text-left transition-colors duration-200 sm:flex-row sm:items-baseline sm:gap-4',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                current ? 'bg-primary/10' : 'hover:bg-primary/5',
                              )}
                            >
                              <span className="flex shrink-0 items-center gap-2 sm:w-56">
                                <span className="text-sm font-semibold text-primary">
                                  {and.version ?? t('untitled', { ordinal: and.ordinal })}
                                </span>
                                <span className="text-xs text-ink/55">{t(`language.${and.language}`)}</span>
                              </span>
                              <span lang={and.language} className="min-w-0 truncate [font-family:var(--font-display),Georgia,serif] text-lg text-ink/80">
                                {firstLine(and)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </PorcelainCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
