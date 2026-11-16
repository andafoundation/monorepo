/**
 * Order and nesting of the Andaism reference text, shared by every locale.
 *
 * Section ids are the URL anchors of the page, so they never change with the
 * language. Parts are a navigation layer for the table of contents and the
 * eyebrow labels only; the source text itself has no parts.
 */
export const DIEPTE_PARTS = [
  {
    id: 'foundations',
    sections: [
      { id: 'overview', level: 2 },
      { id: 'etymology', level: 2 },
      { id: 'mengu', level: 2 },
      { id: 'ands', level: 2 },
      { id: 'becoming-endless', level: 2 },
      { id: 'uncertainty', level: 2 },
    ],
  },
  {
    id: 'oath-and-texts',
    sections: [
      { id: 'texts', level: 2 },
      { id: 'the-main-and', level: 2 },
      { id: 'becoming-anda', level: 2 },
      { id: 'daily-practice', level: 2 },
    ],
  },
  {
    id: 'six-pillars',
    sections: [
      { id: 'six-pillars', level: 2 },
      { id: 'nomadism', level: 3 },
      { id: 'straight-back', level: 3 },
      { id: 'infinity', level: 3 },
      { id: 'reverence-for-nature', level: 3 },
      { id: 'intention-as-thread', level: 3 },
    ],
  },
  {
    id: 'prayer-and-ritual',
    sections: [
      { id: 'prayer', level: 2 },
      { id: 'prayer-to-mengu', level: 2 },
      { id: 'prayer-original', level: 3 },
      { id: 'prayer-translated', level: 3 },
      { id: 'ritual-movement', level: 2 },
      { id: 'gokevi', level: 2 },
      { id: 'friday-ceremony', level: 2 },
      { id: 'music', level: 2 },
    ],
  },
  {
    id: 'community',
    sections: [
      { id: 'onba', level: 2 },
      { id: 'ranks-of-onba', level: 2 },
      { id: 'safeguarding', level: 2 },
    ],
  },
  {
    id: 'ethics-and-life',
    sections: [
      { id: 'ethics', level: 2 },
      { id: 'passion', level: 2 },
      { id: 'hospitality', level: 2 },
      { id: 'science-technology-ai', level: 2 },
      { id: 'knowledge-study', level: 2 },
      { id: 'mental-health', level: 2 },
      { id: 'death', level: 2 },
    ],
  },
  {
    id: 'origins',
    sections: [
      { id: 'other-traditions', level: 2 },
      { id: 'cultural-background', level: 2 },
      { id: 'history', level: 2 },
      { id: 'founder', level: 2 },
      { id: 'summary', level: 2 },
    ],
  },
] as const satisfies readonly {
  id: string;
  sections: readonly { id: string; level: 2 | 3 }[];
}[];

export type DieptePartId = (typeof DIEPTE_PARTS)[number]['id'];

export type DiepteSectionId =
  (typeof DIEPTE_PARTS)[number]['sections'][number]['id'];

export type DiepteSectionLevel = 2 | 3;

export type DiepteSectionEntry = {
  id: DiepteSectionId;
  level: DiepteSectionLevel;
  partId: DieptePartId;
  /** True for the first section of its part, which carries the part's eyebrow label. */
  firstInPart: boolean;
};

/** Every section in reading order, with the part it belongs to. */
export const DIEPTE_SECTIONS: readonly DiepteSectionEntry[] = DIEPTE_PARTS.flatMap(
  (part) =>
    part.sections.map(
      (section, index): DiepteSectionEntry => ({
        id: section.id,
        level: section.level,
        partId: part.id,
        firstInPart: index === 0,
      }),
    ),
);
