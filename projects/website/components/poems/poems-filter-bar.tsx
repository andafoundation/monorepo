'use client';

import { List } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AndLanguage, AndLanguageCount, AndMonthCount, AndsFilter } from '@/lib/ands/types';
import { formatDateOnly } from '@/lib/date-only';

interface PoemsFilterBarProps {
  months: AndMonthCount[];
  languages: AndLanguageCount[];
  filter: AndsFilter;
  onMonthChange: (month: string | null) => void;
  onLanguageChange: (language: AndLanguage | null) => void;
  indexOpen: boolean;
  indexId: string;
  onToggleIndex: () => void;
  className?: string;
}

interface PillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  /** Month names are lower case in some locales ("oktober"); a pill starts with a capital. */
  capitalize?: boolean;
}

function Pill({ active, onClick, label, count, capitalize = false }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
        active
          ? 'border-porcelain bg-porcelain font-semibold text-primary'
          : 'border-porcelain/20 bg-ink/30 text-porcelain/80 backdrop-blur-sm hover:bg-porcelain/10 hover:text-porcelain',
      )}
    >
      <span className={cn(capitalize && 'inline-block first-letter:uppercase')}>{label}</span>
      {count !== undefined && (
        <span className={cn('text-xs tabular-nums', active ? 'text-primary/70' : 'text-porcelain/50')}>{count}</span>
      )}
    </button>
  );
}

export default function PoemsFilterBar({
  months,
  languages,
  filter,
  onMonthChange,
  onLanguageChange,
  indexOpen,
  indexId,
  onToggleIndex,
  className,
}: PoemsFilterBarProps) {
  const t = useTranslations('poems');
  const format = useFormatter();

  // The year only earns its place on a pill once the poems span more than one year.
  const showYear = new Set(months.map((entry) => entry.month.slice(0, 4))).size > 1;
  const monthLabel = (month: string) =>
    formatDateOnly(format, `${month}-01`, {
      month: 'long',
      ...(showYear ? { year: 'numeric' } : {}),
    });

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t('allMonths')}>
        <Pill active={filter.month === null} onClick={() => onMonthChange(null)} label={t('allMonths')} />
        {months.map((entry) => (
          <Pill
            key={entry.month}
            active={filter.month === entry.month}
            onClick={() => onMonthChange(entry.month)}
            label={monthLabel(entry.month)}
            capitalize
            count={entry.count}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={t('allLanguages')}>
        <Pill active={filter.language === null} onClick={() => onLanguageChange(null)} label={t('allLanguages')} />
        {languages.map((entry) => (
          <Pill
            key={entry.language}
            active={filter.language === entry.language}
            onClick={() => onLanguageChange(entry.language)}
            label={t(`language.${entry.language}`)}
            count={entry.count}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleIndex}
          aria-expanded={indexOpen}
          aria-controls={indexId}
          className="rounded-full text-porcelain/80 hover:bg-porcelain/10 hover:text-porcelain focus-visible:ring-accent focus-visible:ring-offset-ink"
        >
          <List className="h-4 w-4" aria-hidden />
          {indexOpen ? t('closeIndex') : t('openIndex')}
        </Button>
      </div>
    </div>
  );
}
