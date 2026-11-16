'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { hasLocale, useLocale, useMessages, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCard } from '@/components/book/book-card';
import { BookScrollOverlay } from '@/components/book/book-scroll-overlay';
import { Button } from '@/components/ui/button';
import { ThemeBackground } from '@/components/ui/theme-background';
import { toBookContent, toSteppeBookContent, type BookLocale, type SiteMessages } from '@/lib/book/book-content';
import { routing } from '@/lib/i18n/routing';

type Book = {
  id: string;
  title: string;
  short: string;
  long: string;
  lang: BookLocale;
  format: 'PDF' | 'ePub' | 'PDF & ePub';
  year: string;
  coverUrl?: string;
  downloadUrl?: string;
  accent: string;
};

// The Anda books themselves are not in this list: they are read from the
// messages of every locale and open as a scroll instead of the modal below.
const books: Book[] = [
  {
    id: 'skyyurt-vision-en',
    title: 'Skyyurt & Skystone Vision',
    short: 'Projectbook for the 2030 Skyyurt vision.',
    long: 'Conceptboek met uitleg over Skyyurt, Skystone en Nomad’s Heart. Schetst de route naar 2030 en hoe je kunt bijdragen.',
    lang: 'en',
    format: 'PDF',
    year: '2024',
    downloadUrl: '#',
    accent: 'from-[#f2e7d2] to-[#e1cfac]',
  },
];

type ShelfItem = { kind: 'anda' } | { kind: 'steppe' } | { kind: 'other'; book: Book };

type Shelf = { id: string; labelKey: 'coreShelf' | 'storiesShelf'; items: ShelfItem[] };

type ScrollBook = 'anda' | 'steppe';

// Fine horizontal grain over the oak of the frame and the planks.
const WOOD_GRAIN =
  'pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(60,30,10,0.10)_0_1px,transparent_1px_6px)]';

export default function BookPageView() {
  const t = useTranslations('boek');
  const tBook = useTranslations('book');
  const tSteppe = useTranslations('steppe');
  const requestedLocale = useLocale();
  const locale: BookLocale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  // The layout hands every message to the client provider, so the whole book
  // is already here and the scroll opens without a request.
  const messages = useMessages() as SiteMessages;
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [scrollOpen, setScrollOpen] = useState(false);
  // Kept apart from scrollOpen, so the scroll keeps its book while it closes.
  const [scrollBook, setScrollBook] = useState<ScrollBook>('anda');
  const andaBookRef = useRef<HTMLButtonElement>(null);
  const steppeBookRef = useRef<HTMLButtonElement>(null);

  const andaContent = useMemo(() => toBookContent(locale, messages), [locale, messages]);
  const steppeContent = useMemo(() => toSteppeBookContent(locale, messages), [locale, messages]);

  const shelves = useMemo<Shelf[]>(
    () => [
      {
        id: 'bookcase-core',
        labelKey: 'coreShelf',
        items: [
          { kind: 'anda' },
          ...books.filter((book) => book.lang === locale).map((book) => ({ kind: 'other' as const, book })),
        ],
      },
      { id: 'bookcase-stories', labelKey: 'storiesShelf', items: [{ kind: 'steppe' }] },
    ],
    [locale],
  );

  const openScroll = (book: ScrollBook) => {
    setScrollBook(book);
    setScrollOpen(true);
  };

  const renderItem = (item: ShelfItem) => {
    if (item.kind === 'anda') {
      return (
        <BookCard
          key="anda-book"
          ref={andaBookRef}
          title={tBook('title')}
          short={tBook('short')}
          format="HTML"
          year={tBook('year')}
          lang={locale}
          label={`${tBook('open')}: ${tBook('title')}`}
          coverUrl="/assets/De Anda - Kaft.webp"
          active={scrollOpen && scrollBook === 'anda'}
          priority
          onClick={() => openScroll('anda')}
        />
      );
    }
    if (item.kind === 'steppe') {
      return (
        <BookCard
          key="steppe-book"
          ref={steppeBookRef}
          title={tSteppe('title')}
          short={tSteppe('short')}
          format="HTML"
          year={tSteppe('year')}
          lang={locale}
          label={`${tSteppe('open')}: ${tSteppe('title')}`}
          active={scrollOpen && scrollBook === 'steppe'}
          onClick={() => openScroll('steppe')}
        />
      );
    }
    return (
      <BookCard
        key={item.book.id}
        title={item.book.title}
        short={item.book.short}
        format={item.book.format}
        year={item.book.year}
        lang={item.book.lang}
        label={`Open ${item.book.title}`}
        coverUrl={item.book.coverUrl}
        accent={item.book.accent}
        active={activeBook?.id === item.book.id}
        onClick={() => setActiveBook(item.book)}
      />
    );
  };

  return (
    <div>
      <ThemeBackground variant="sky" className="min-h-screen">
        <div aria-hidden className="stars-container pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl animate-brush-glow motion-reduce:animate-none md:h-96 md:w-[40rem]"
        />

        {/* The top padding clears the fixed header; it sits here so the stars start at the page top. */}
        <div className="relative px-4 pb-16 pt-28 md:pt-32">
          <h1 className="sr-only">{t('pageTitle')}</h1>

          <div className="mx-auto max-w-5xl">
            <div
              aria-hidden
              className="relative z-10 -mx-1 h-3 rounded-sm border border-accent/50 bg-gradient-to-b from-[#a06a3c] to-[#8a5a34] shadow-lg md:-mx-2"
            />

            {/* The ink ring edges the frame against light sky, the warm glow against dark sky. */}
            <div className="relative rounded-sm border border-accent/50 bg-gradient-to-b from-[#8a5a34] to-[#6b4226] p-2 pb-3 ring-1 ring-ink/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6),0_0_48px_rgba(242,193,98,0.22)] md:p-4 md:pb-5">
              <div aria-hidden className={WOOD_GRAIN} />

              <div className="relative bg-[#5b3a22] shadow-[inset_0_8px_24px_rgba(0,0,0,0.5),inset_10px_0_20px_-10px_rgba(0,0,0,0.45),inset_-10px_0_20px_-10px_rgba(0,0,0,0.45)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,193,98,0.30),transparent_70%)]"
                />

                {shelves.map((shelf) => (
                  <section key={shelf.id} aria-labelledby={shelf.id} className="relative px-3 pt-4 md:px-6">
                    <h2
                      id={shelf.id}
                      className="relative w-fit rounded-full bg-porcelain/85 px-4 py-1 font-semibold text-primary"
                    >
                      {t(shelf.labelKey)}
                    </h2>

                    {/* The plank stays put while the books scroll over it. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-6 h-3 border-t border-[#f0cf9a]/70 bg-gradient-to-r from-[#c28a52] via-[#dcae77] to-[#c28a52] shadow-lg"
                    >
                      <div className={WOOD_GRAIN} />
                    </div>

                    {/* The bottom padding leaves room for the card tooltip and puts the books on the plank. */}
                    <div className="relative flex items-end gap-4 overflow-x-auto pb-8 snap-x snap-mandatory">
                      {shelf.items.map(renderItem)}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <div aria-hidden className="mx-auto flex max-w-5xl justify-between px-4 md:px-8">
            <div className="h-2 w-8 rounded-b bg-[#4a2c18]" />
            <div className="h-2 w-8 rounded-b bg-[#4a2c18]" />
          </div>
        </div>
      </ThemeBackground>

      <BookScrollOverlay
        open={scrollOpen}
        onOpenChange={setScrollOpen}
        content={scrollBook === 'steppe' ? steppeContent : andaContent}
        downloadHref={`/${locale}/boek${scrollBook === 'steppe' ? '/steppe/html' : '/html'}`}
        downloadFileName={scrollBook === 'steppe' ? tSteppe('fileName') : tBook('fileName')}
        returnFocusRef={scrollBook === 'steppe' ? steppeBookRef : andaBookRef}
      />

      <AnimatePresence>
        {activeBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeBook.title}
            onClick={() => setActiveBook(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-3xl w-full bg-porcelain rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[200px_1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-porcelain/90">
                <div className="relative w-full h-64 md:h-full">
                  {activeBook.coverUrl ? (
                    <Image
                      src={activeBook.coverUrl}
                      alt={activeBook.title}
                      fill
                      sizes="(min-width: 768px) 200px, 60vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${activeBook.accent}`} />
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-ink/60 tracking-wide">
                      {activeBook.lang} • {activeBook.format} • {activeBook.year}
                    </p>
                    <h3 className="text-2xl font-semibold text-primary">{activeBook.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveBook(null)}
                    className="text-ink/60 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm md:text-base text-ink/80">{activeBook.long}</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                  >
                    <a href={activeBook.downloadUrl || '#'} target="_blank" rel="noreferrer">
                      📥 Download
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveBook(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
