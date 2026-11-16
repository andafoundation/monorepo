import { routing } from '@/lib/i18n/routing';
import { andaismDefinition, ANDAISM_JSON_LD_ID } from './build-andaism-json-ld';
import type { JsonLdEntity } from './json-ld';
import { buildJsonLdId } from './json-ld-id';
import {
  absoluteUrl,
  CONTENT_LANGUAGES,
  FOUNDER,
  localePath,
  LOGO_IMAGE,
  OG_IMAGE,
  ORGANIZATION_ADDRESS,
  ORGANIZATION_EMAIL,
  ORGANIZATION_LEGAL_NAME,
  ORGANIZATION_SAME_AS,
  SITE_NAME,
  toSiteLocale,
} from './site';

/** Stable node id of the foundation, referenced by the WebSite, every WebPage and the content entities. */
export const ORGANIZATION_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'organization' });

/**
 * Stable node id of the founder. The Organization defines the Person once and
 * every work he wrote references it, so the name lives only in `FOUNDER`.
 */
export const FOUNDER_JSON_LD_ID = buildJsonLdId({ path: '/', fragment: 'founder' });

/**
 * Names the foundation is searched by besides `SITE_NAME` and its legal name.
 * Andaism is not among them: the tradition is its own node, which the
 * foundation links to through `knowsAbout`.
 */
export const ORGANIZATION_ALTERNATE_NAMES: readonly string[] = ['Anda Foundation', 'Anda Philosophy'];

export interface BuildOrganizationJsonLdInput {
  locale: string;
  /** The localized description of the foundation; the localized definition of Andaism is appended to it. */
  description: string;
}

/**
 * schema.org Organization for Stichting Anda, rendered once per page by the
 * locale layout. It states only what the site shows as confirmed: no
 * telephone, KvK, RSIN or IBAN while those values are placeholders. Its
 * description and `knowsAbout` tie it to Andaism, the tradition it
 * represents, so answer engines that look up Andaism land here.
 */
export function buildOrganizationJsonLd({ locale, description }: BuildOrganizationJsonLdInput): JsonLdEntity {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_JSON_LD_ID,
    name: SITE_NAME,
    alternateName: [...ORGANIZATION_ALTERNATE_NAMES],
    legalName: ORGANIZATION_LEGAL_NAME,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(LOGO_IMAGE.path),
      width: LOGO_IMAGE.width,
      height: LOGO_IMAGE.height,
    },
    image: absoluteUrl(OG_IMAGE.path),
    description: `${description} ${andaismDefinition(locale)}`,
    knowsAbout: { '@id': ANDAISM_JSON_LD_ID },
    inLanguage: CONTENT_LANGUAGES[toSiteLocale(locale)],
    email: ORGANIZATION_EMAIL,
    address: {
      '@type': 'PostalAddress',
      ...ORGANIZATION_ADDRESS,
    },
    founder: {
      '@type': 'Person',
      '@id': FOUNDER_JSON_LD_ID,
      name: FOUNDER,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'general enquiries',
        email: ORGANIZATION_EMAIL,
        url: absoluteUrl(localePath(routing.defaultLocale, 'contact')),
        availableLanguage: Object.values(CONTENT_LANGUAGES),
      },
    ],
    ...(ORGANIZATION_SAME_AS.length > 0 ? { sameAs: [...ORGANIZATION_SAME_AS] } : {}),
  };
}
