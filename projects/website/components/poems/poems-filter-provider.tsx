'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { AndLanguage, AndsFilter } from '@/lib/ands/types';

interface PoemsFilterContextValue {
  filter: AndsFilter;
  setMonth: (month: string | null) => void;
  setLanguage: (language: AndLanguage | null) => void;
  /** True once a reading card has been on screen; later cards fade in, the first one does not. */
  cardShownRef: RefObject<boolean>;
}

const PoemsFilterContext = createContext<PoemsFilterContextValue | null>(null);

/**
 * Holds the month and language filter above the poems pages, so the filter survives stepping from one poem to
 * the next while the URL carries only the poem being read.
 */
export function PoemsFilterProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<string | null>(null);
  const [language, setLanguage] = useState<AndLanguage | null>(null);
  const cardShownRef = useRef(false);

  const value = useMemo<PoemsFilterContextValue>(
    () => ({ filter: { month, language }, setMonth, setLanguage, cardShownRef }),
    [month, language],
  );

  return <PoemsFilterContext.Provider value={value}>{children}</PoemsFilterContext.Provider>;
}

export function usePoemsFilter(): PoemsFilterContextValue {
  const context = useContext(PoemsFilterContext);
  if (context === null) {
    throw new Error('usePoemsFilter must be used inside PoemsFilterProvider');
  }
  return context;
}
