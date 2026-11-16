import { NextRequest, NextResponse } from 'next/server';

import { routing } from '@/lib/i18n/routing';

/**
 * Locale negotiation for the bare "/" URL.
 *
 * next-intl normally does this in middleware, but Next 16 runs middleware on
 * Node.js only and Cloudflare Workers cannot host it. A route handler needs no
 * layout, so "/" becomes a real route here rather than a rewrite — which also
 * avoids OpenNext's router throwing on an empty rewrite param.
 *
 * Redirects to the best Accept-Language match, or to the default locale when
 * the browser asks for nothing we serve.
 */

type LocaleWeight = { locale: string; quality: number };

/** Parse an Accept-Language header into locales ordered by descending q-value. */
function parseAcceptLanguage(header: string | null): LocaleWeight[] {
  if (!header) return [];

  return header
    .split(',')
    .map((part) => {
      const segments = part.trim().split(';');
      const tag = segments[0] ?? '';
      const params = segments.slice(1);
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);

      return {
        locale: tag.trim().toLowerCase(),
        quality: Number.isNaN(quality) ? 0 : quality,
      };
    })
    .filter((entry) => entry.locale.length > 0 && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);
}

/**
 * Pick the first supported locale. Matches the base language too, so "en-GB"
 * and "nl-BE" resolve to "en" and "nl".
 */
function negotiateLocale(header: string | null): string {
  const supported = routing.locales as readonly string[];

  for (const { locale } of parseAcceptLanguage(header)) {
    if (locale === '*') break;

    const exact = supported.find((candidate) => candidate === locale);
    if (exact) return exact;

    const base = locale.split('-')[0] ?? locale;
    const partial = supported.find((candidate) => candidate === base);
    if (partial) return partial;
  }

  return routing.defaultLocale;
}

export function GET(request: NextRequest): NextResponse {
  const locale = negotiateLocale(request.headers.get('accept-language'));

  // 307, not 301: the target depends on the visitor's headers, so it must not
  // be cached as a permanent redirect for everyone.
  const response = NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
  response.headers.set('Vary', 'Accept-Language');

  return response;
}
