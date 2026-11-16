
import { DIEPTE_LINK_CLASS } from './DiepteInline';
import type { DiepteOutlineEntry } from './outline';

type DiepteContentsProps = {
  label: string;
  entries: DiepteOutlineEntry[];
  /** The page's language, for the label. */
  lang: string;
  /** The language of the entry titles, which differs from the label's on an English fallback. */
  contentLang: string;
};

/**
 * The numbered Contents box between the lead and the first heading. A native
 * `details` keeps it collapsible without any client JavaScript, and the plain
 * anchors let the browser land each heading under the fixed header through the
 * sections' scroll margin.
 */
export default function DiepteContents({ label, entries, lang, contentLang }: DiepteContentsProps) {
  return (
    <nav
      lang={lang}
      aria-label={label}
      className="my-8 inline-block w-full max-w-full rounded-2xl border border-ink/10 bg-porcelain px-5 py-3 md:w-auto md:min-w-[16rem]"
    >
      <details open>
        <summary className="cursor-pointer select-none rounded-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {label}
        </summary>
        <ol lang={contentLang} className="mt-2 space-y-1 text-[15px]">
          {entries.map((entry) => (
            <li key={entry.id} className={entry.level === 3 ? 'pl-5' : undefined}>
              <a href={`#${entry.id}`} className={DIEPTE_LINK_CLASS}>
                <span className="mr-2 text-ink/60">{entry.number}</span>
                {entry.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
