'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PILLARS = ['pillar1', 'pillar2', 'pillar3', 'pillar4', 'pillar5', 'pillar6'];

type ExpandedCard = {
  index: number;
  /** Height the other cards keep, so they look as they did before the click. */
  collapsedHeight: number;
};

/**
 * Height a card needs for its own title, text and button, without the free
 * space above the button that a stretched grid row or a fixed height adds.
 */
function contentHeight(card: HTMLElement): number {
  const cardBox = card.getBoundingClientRect();
  const text = card.querySelector<HTMLElement>('[data-pillar-text]');
  const footer = card.querySelector<HTMLElement>('[data-pillar-footer]');
  if (!text || !footer) {
    return cardBox.height;
  }
  const freeSpace = footer.getBoundingClientRect().top - text.getBoundingClientRect().bottom;
  return cardBox.height - freeSpace;
}

export default function PilarenView() {
  const t = useTranslations('pilaren');
  const tCommon = useTranslations('common');
  const [expanded, setExpanded] = useState<ExpandedCard | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** The tallest content among the collapsed cards: the height they all share. */
  const measureCollapsedHeight = (expandedIndex: number | null): number =>
    Math.ceil(
      Math.max(
        0,
        ...cardRefs.current
          .filter((card, index): card is HTMLDivElement => card !== null && index !== expandedIndex)
          .map(contentHeight),
      ),
    );

  const toggleExpand = (index: number) => {
    if (expanded?.index === index) {
      setExpanded(null);
      return;
    }
    // While nothing is expanded the stretched grid rows already give every
    // card the shared height; once a card is open that height is kept.
    const collapsedHeight = expanded?.collapsedHeight ?? measureCollapsedHeight(null);
    setExpanded({ index, collapsedHeight });
  };

  // A new viewport width rewraps the teasers, so the shared height of the
  // cards that stay collapsed is measured again.
  const expandedIndex = expanded?.index ?? null;
  useEffect(() => {
    if (expandedIndex === null) {
      return undefined;
    }
    const onResize = () => {
      setExpanded({ index: expandedIndex, collapsedHeight: measureCollapsedHeight(expandedIndex) });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [expandedIndex]);

  return (
    <DelftSection variant="delft" className="min-h-screen pt-32 md:pt-36 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-primary mb-10 text-center">
          {t('pageTitle')}
        </h1>

        {/*
          Collapsed, the rows stretch and share one height, so every card is as
          tall as the one with the longest teaser. With a card open, only that
          card grows: items align to the start and the others keep the
          measured collapsed height.
        */}
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
            expanded ? 'items-start' : 'auto-rows-fr',
          )}
        >
          {PILLARS.map((pillar, index) => {
            const isExpanded = expanded?.index === index;

            return (
              <PorcelainCard
                key={pillar}
                ref={(card) => {
                  cardRefs.current[index] = card;
                }}
                className="flex flex-col hover:shadow-[0_24px_50px_-36px_rgba(11,27,51,0.55)] transition-shadow"
                style={
                  expanded && !isExpanded ? { minHeight: expanded.collapsedHeight } : undefined
                }
              >
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-primary text-center uppercase tracking-wide">
                    {t(`${pillar}.title`)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col items-start">
                  <p
                    data-pillar-text
                    className={`whitespace-pre-line text-ink/85 ${isExpanded ? 'text-base md:text-[15px] leading-7' : 'text-sm md:text-base leading-6'}`}
                  >
                    {isExpanded ? t(`${pillar}.full`) : t(`${pillar}.short`)}
                  </p>

                  {/* Pinned to the bottom, so the buttons line up across cards. */}
                  <div data-pillar-footer className="mt-auto w-full pt-4 flex justify-start">
                    <Button
                      onClick={() => toggleExpand(index)}
                      variant="default"
                      className="w-fit"
                    >
                      {isExpanded ? tCommon('readLess') : tCommon('readMore')}
                    </Button>
                  </div>
                </CardContent>
              </PorcelainCard>
            );
          })}
        </div>
      </div>
    </DelftSection>
  );
}
