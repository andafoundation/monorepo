import type { MetadataRoute } from 'next';

import { routing } from '@/lib/i18n/routing';
import { ORGANIZATION_LEGAL_NAME, SITE_NAME, THEME_COLOR } from '@/lib/seo/site';
import nl from '@/messages/nl.json';

/** The porcelain page background (`--delft-porcelain` in `app/globals.css`), shown on the splash screen. */
const BACKGROUND_COLOR = '#f7f3ec';

/**
 * Web app manifest. Next serves one manifest for the whole site, so it cannot
 * follow the visitor's language: the description and `lang` are the default
 * locale's, and `start_url` is the bare `/`, which `app/route.ts` redirects to
 * the visitor's own locale.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: ORGANIZATION_LEGAL_NAME,
    short_name: SITE_NAME,
    description: nl.seo.homeDescription,
    lang: routing.defaultLocale,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: '/assets/icon-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/icon-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Separate art: a maskable icon is cropped to the platform's shape, so the mark sits inside the safe middle 80 percent.
      { src: '/assets/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
