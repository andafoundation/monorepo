import { routing } from '@/lib/i18n/routing';
import { toSteppeBookContent, type BookLocale, type SiteMessages } from '@/lib/book/book-content';
import { renderBookHtml } from '@/lib/book/render-book';
import en from '@/messages/en.json';
import nl from '@/messages/nl.json';
import ru from '@/messages/ru.json';
import tr from '@/messages/tr.json';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
// Only the four site locales are prerendered; any other segment is a 404.
export const dynamicParams = false;

// Typed against the Dutch messages, so a locale missing a steppe key fails the
// build rather than serving an incomplete book.
const MESSAGES: Record<BookLocale, SiteMessages> = { en, nl, ru, tr };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function isBookLocale(value: string): value is BookLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isBookLocale(locale)) {
    return new Response('Not found', { status: 404 });
  }

  const html = renderBookHtml(toSteppeBookContent(locale, MESSAGES[locale]), { standalone: true });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
      // The chrome-less book file repeats the text shown on `/{locale}/boek`;
      // kept out of the index so search engines send readers to the page instead.
      'X-Robots-Tag': 'noindex',
    },
  });
}
