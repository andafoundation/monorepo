import { en as diepte } from '@/content/diepte/en';
import { getAnds } from '@/lib/ands/ands';
import { buildLlmsFullTxt } from '@/lib/seo/build-llms-txt';
import en from '@/messages/en.json';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

// Prerendered at build, so a missing message key fails the build instead of serving a broken file.
export function GET(): Response {
  return new Response(buildLlmsFullTxt({ messages: en, ands: getAnds(), diepte }), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
