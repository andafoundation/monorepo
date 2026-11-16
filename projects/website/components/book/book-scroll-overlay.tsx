'use client';

import { useCallback, useMemo, useRef, type MouseEvent, type RefObject } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BookContent } from '@/lib/book/book-content';
import { BOOK_CSS } from '@/lib/book/book-styles';
import { renderBookBody } from '@/lib/book/render-book';

type BookScrollOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: BookContent;
  downloadHref: string;
  downloadFileName: string;
  /** Receives focus when the scroll closes, because the card is not a Dialog.Trigger. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

const TITLE_ID = 'anda-book-scroll-title';

const UNROLL_EASE: Transition['ease'] = [0.22, 1, 0.36, 1];

// The wooden rods at both ends of the scroll: gold turned to blush at the
// finials, with a soft highlight so they read as round.
const ROD_STYLE = {
  backgroundImage:
    'linear-gradient(90deg, rgb(var(--delft-blush)) 0%, rgb(var(--delft-accent)) 14%, rgb(250 226 170) 50%, rgb(var(--delft-accent)) 86%, rgb(var(--delft-blush)) 100%)',
  boxShadow:
    'inset 0 2px 0 rgb(255 255 255 / 0.45), inset 0 -3px 5px rgb(11 27 51 / 0.22), 0 8px 18px -8px rgb(0 0 0 / 0.55)',
};

function Rod({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute -inset-x-3 z-20 h-5 rounded-full ${className}`} style={ROD_STYLE}>
      <span className="absolute -left-1 top-1/2 h-7 w-2.5 -translate-y-1/2 rounded-full bg-blush shadow-md" />
      <span className="absolute -right-1 top-1/2 h-7 w-2.5 -translate-y-1/2 rounded-full bg-blush shadow-md" />
    </div>
  );
}

export function BookScrollOverlay({
  open,
  onOpenChange,
  content,
  downloadHref,
  downloadFileName,
  returnFocusRef,
}: BookScrollOverlayProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const bookHtml = useMemo(() => ({ __html: renderBookBody(content) }), [content]);

  const handleScroll = useCallback(() => {
    const scroller = scrollRef.current;
    const progress = progressRef.current;
    if (!scroller || !progress) {
      return;
    }
    const distance = scroller.scrollHeight - scroller.clientHeight;
    const ratio = distance > 0 ? Math.min(1, scroller.scrollTop / distance) : 1;
    progress.style.transform = `scaleX(${ratio})`;
  }, []);

  // In-page links of the book scroll the paper instead of changing the URL of
  // the download page, and hand focus to the heading they point to.
  const handleBookClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const scroller = scrollRef.current;
      if (!link || !scroller) {
        return;
      }
      const target = scroller.querySelector<HTMLElement>(`#${CSS.escape(link.hash.slice(1))}`);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    },
    [reduceMotion],
  );

  const fade: Transition = { duration: 0.35, ease: 'easeOut' };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[60] bg-ink-wash backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="stars-container absolute inset-0 opacity-70" />
              </motion.div>
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                scrollRef.current?.focus({ preventScroll: true });
              }}
              onCloseAutoFocus={(event) => {
                if (returnFocusRef?.current) {
                  event.preventDefault();
                  returnFocusRef.current.focus();
                }
              }}
            >
              <motion.div
                className="fixed inset-x-0 bottom-4 top-4 z-[70] mx-auto w-[min(46rem,calc(100%-2rem))] focus:outline-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
              >
                <motion.div
                  className="absolute inset-x-0 top-0 z-20"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.92 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={fade}
                >
                  <Rod className="-top-2.5" />
                </motion.div>

                <motion.div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.25rem] bg-porcelain-paper text-ink shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ring-1 ring-accent/25"
                  initial={reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0% round 1.25rem)' }}
                  animate={reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 1.25rem)' }}
                  transition={reduceMotion ? fade : { duration: 0.7, delay: 0.2, ease: UNROLL_EASE }}
                >
                  <div className="flex flex-none items-center gap-2 border-b border-primary/10 bg-porcelain/80 px-4 pb-3 pt-5 sm:gap-3 sm:px-6">
                    <Dialog.Title
                      id={TITLE_ID}
                      className="min-w-0 flex-1 truncate text-lg font-semibold text-primary sm:text-xl"
                    >
                      {content.title}
                    </Dialog.Title>
                    <Button asChild size="sm" className="h-10 w-10 px-0 sm:w-auto sm:px-4">
                      <a href={downloadHref} download={downloadFileName} aria-label={content.labels.download}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{content.labels.download}</span>
                      </a>
                    </Button>
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon" className="flex-none" aria-label={content.labels.close}>
                        <X className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Dialog.Close>
                  </div>

                  <div className="h-0.5 flex-none bg-primary/10" aria-hidden="true">
                    <div ref={progressRef} className="h-full origin-left scale-x-0 bg-accent transition-transform duration-150 ease-out" />
                  </div>

                  <div className="relative min-h-0 flex-1">
                    <div
                      ref={scrollRef}
                      role="region"
                      aria-labelledby={TITLE_ID}
                      tabIndex={0}
                      onScroll={handleScroll}
                      onClick={handleBookClick}
                      className="h-full overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                    >
                      <style dangerouslySetInnerHTML={{ __html: BOOK_CSS }} />
                      <div dangerouslySetInnerHTML={bookHtml} />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-porcelain to-porcelain/0"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute inset-x-0 bottom-0 z-20"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={reduceMotion ? fade : { duration: 0.45, delay: 0.6, ease: UNROLL_EASE }}
                >
                  <Rod className="-bottom-2.5" />
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
