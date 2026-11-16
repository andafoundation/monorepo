import Image from 'next/image';
import { LOGO_MARK_SRC } from '@/components/site-images';

import type { DiepteSectionId } from '@/content/diepte';

import { DIEPTE_LINK_CLASS } from './DiepteInline';

export type DiepteInfoboxRow = { label: string; value: string; sectionId?: DiepteSectionId };

type DiepteInfoboxProps = {
  title: string;
  rows: DiepteInfoboxRow[];
  imageAlt: string;
  /** The page's language; the box keeps it when the text falls back to English. */
  lang: string;
};

/**
 * The summary table at the top right of the article, as a Wikipedia infobox.
 * Every value the text explains links to the section that explains it, so the
 * box doubles as a second way into the article.
 */
export default function DiepteInfobox({ title, rows, imageAlt, lang }: DiepteInfoboxProps) {
  return (
    <aside
      lang={lang}
      aria-label={title}
      className="mb-6 w-full overflow-hidden rounded-2xl border border-ink/10 bg-primary/5 text-sm leading-snug md:float-right md:ml-8 md:w-[22rem]"
    >
      <table className="w-full border-collapse">
        <caption className="bg-primary/10 py-2 font-[family-name:var(--font-display)] text-base font-semibold text-primary">
          {title}
        </caption>
        <tbody>
          <tr>
            <td colSpan={2} className="px-3 py-3">
              <Image
                src={LOGO_MARK_SRC}
                alt={imageAlt}
                width={160}
                height={160}
                sizes="160px"
                className="mx-auto h-40 w-40"
              />
            </td>
          </tr>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-ink/10">
              <th scope="row" className="w-[38%] px-3 py-1.5 text-left align-top font-semibold text-ink">
                {row.label}
              </th>
              <td className="px-3 py-1.5 align-top text-ink/85">
                {row.sectionId ? (
                  <a href={`#${row.sectionId}`} className={DIEPTE_LINK_CLASS}>
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
