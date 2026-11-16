const withNextIntl = require('next-intl/plugin')('./lib/i18n/request.ts');

const isProduction = process.env.NODE_ENV === 'production';

// Previously set by proxy.ts on every response. The proxy was removed because
// Next 16 runs it on Node.js only, which Cloudflare Workers cannot host, so
// these are emitted as static response headers instead.
const securityHeaders = [
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
      ]
    : []),
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Deliberately narrow: it pins framing, <base>, plugins and form targets only.
  // A script or style policy would block the inline Next bootstrap and JSON-LD
  // scripts and the Google Fonts stylesheets, which carry no nonce.
  // frame-ancestors 'none' matches X-Frame-Options: DENY for modern browsers.
  // form-action 'self' keeps injected markup from posting a form off-site.
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `x-powered-by: Next.js`: it tells a scanner the stack for free.
  poweredByHeader: false,
  // "standalone" builds the container image. The Cloudflare Workers build
  // (@opennextjs/cloudflare) needs Next's default output instead, so the
  // deploy scripts set CF_WORKERS_BUILD=1.
  output: process.env.CF_WORKERS_BUILD === '1' ? undefined : 'standalone',
  images: {
    // WebP only: AVIF is smaller, but encoding it makes the first request for
    // every width noticeably slow, which shows as images popping in late.
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
  },
  async redirects() {
    // The publications page moved from /download to /boek. Redirects run before
    // the rewrites below, so the bare /download is answered here and its target
    // is then rewritten to /nl/boek like every other unprefixed URL.
    return [
      { source: '/download', destination: '/boek', permanent: true },
      { source: '/:locale([a-z]{2})/download', destination: '/:locale/boek', permanent: true },
    ];
  },
  async rewrites() {
    // Plain array == afterFiles: runs after static files but BEFORE dynamic
    // routes, so /contact is prefixed here instead of being swallowed by
    // /[locale] (which would treat "contact" as a locale and 404).
    // ".+" keeps this from matching "/", where an empty required param makes
    // OpenNext's router throw; the bare "/" is handled by app/route.ts.
    return [
      {
        source: '/:path((?![a-z]{2}(?:/|$)|_next|api|.*\\.).+)',
        destination: '/nl/:path',
      },
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // Routes are generated with a locale prefix (localePrefix: 'always'), but the
  // public URLs have always been unprefixed for the default locale. Rewrite --
  // not redirect -- so /contact keeps its address and serves /nl/contact.
  // The lookahead skips any two-letter first segment (every locale is two
  // letters), Next internals, and anything with a file extension. This holds as
  // long as no top-level route is itself two characters.
};

module.exports = withNextIntl(nextConfig);
