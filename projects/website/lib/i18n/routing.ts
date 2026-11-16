import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'nl', 'tr', 'ru'],
  defaultLocale: 'nl',
  // Every route is emitted with its locale prefix so the site is fully static
  // and needs no request-time middleware (Cloudflare Workers cannot run Next
  // 16's Node-only proxy). Unprefixed paths are rewritten to the default
  // locale by the rewrites() rule in next.config.js, so public URLs such as
  // /contact are unchanged.
  localePrefix: 'always',
});
