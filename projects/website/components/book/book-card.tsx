'use client';

import type { Ref } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type BookCardProps = {
  title: string;
  short: string;
  format: string;
  year: string;
  lang: string;
  /** Accessible name of the button, such as "Read the book: {title}". */
  label: string;
  coverUrl?: string;
  /** Tailwind gradient classes for a book without a cover image. */
  accent?: string;
  active: boolean;
  priority?: boolean;
  onClick: () => void;
  ref?: Ref<HTMLButtonElement>;
};

/** A book cover standing on the download page's shelf. */
export function BookCard({
  title,
  short,
  format,
  year,
  lang,
  label,
  coverUrl,
  accent,
  active,
  priority = false,
  onClick,
  ref,
}: BookCardProps) {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      className="group relative snap-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
      aria-label={label}
    >
      <motion.div
        className={`relative aspect-[2/3] w-32 overflow-hidden rounded-2xl border border-white/40 shadow-lg transition-all duration-300 md:w-36 ${
          active ? 'ring-4 ring-primary' : 'hover:shadow-2xl'
        }`}
        style={{ transformOrigin: 'bottom center' }}
        animate={{ scale: active ? 1.12 : 1, opacity: 1, zIndex: active ? 10 : 1 }}
      >
        {coverUrl ? (
          <Image src={coverUrl} alt="" fill sizes="150px" className="object-cover" priority={priority} />
        ) : (
          <div className={`flex h-full w-full items-end bg-gradient-to-br p-3 text-white ${accent ?? 'from-primary to-ink'}`}>
            <p className="text-xs font-semibold drop-shadow-lg">{title}</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/0 to-black/30" />
      </motion.div>

      <div className="pointer-events-none absolute -bottom-10 left-1/2 z-20 w-40 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="rounded-2xl border border-ink/10 bg-porcelain p-3 text-left shadow-lg">
          <p className="text-sm font-semibold text-primary">{title}</p>
          <p className="line-clamp-2 text-xs text-ink/70">{short}</p>
          <div className="mt-2 flex justify-between text-[11px] text-ink/60">
            <span>{format}</span>
            <span>{year}</span>
            <span>{lang}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
