import {
  DIEPTE_SECTIONS,
  type DiepteDocument,
  type DiepteSectionLevel,
} from '@/content/diepte';

export type DiepteOutlineEntry = {
  id: string;
  title: string;
  level: DiepteSectionLevel;
  /** The Contents number, `n` for a level 2 heading and `n.m` for a level 3 heading. */
  number: string;
};

export const DIEPTE_SEE_ALSO_ID = 'see-also';

/**
 * The numbered outline of the article, shared by the Contents box and the
 * headings so that both always show the same number for a section. Sections a
 * locale omits are skipped before numbering, so the numbers stay gapless in
 * every language. "See also" is not part of the content modules and closes
 * the outline as the last level 2 entry.
 */
export function buildOutline(
  document: DiepteDocument,
  closing: { seeAlso: string },
): DiepteOutlineEntry[] {
  const entries: DiepteOutlineEntry[] = [];
  let chapter = 0;
  let subChapter = 0;

  for (const section of DIEPTE_SECTIONS) {
    const text = document.sections[section.id];
    if (text === null) {
      continue;
    }

    if (section.level === 2) {
      chapter += 1;
      subChapter = 0;
      entries.push({ id: section.id, title: text.title, level: 2, number: String(chapter) });
    } else {
      subChapter += 1;
      entries.push({
        id: section.id,
        title: text.title,
        level: 3,
        number: `${chapter}.${subChapter}`,
      });
    }
  }

  entries.push({
    id: DIEPTE_SEE_ALSO_ID,
    title: closing.seeAlso,
    level: 2,
    number: String(chapter + 1),
  });

  return entries;
}
