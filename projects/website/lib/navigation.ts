/**
 * The site's navigation structure, shared by the desktop menu, the mobile menu
 * and the footer so the three never drift apart.
 *
 * Labels are next-intl keys relative to the `nav` namespace, not strings, so
 * every locale renders the same structure. Paths are page slugs without a
 * locale; build hrefs with `localeHref` so a link never drops the visitor's
 * language. A slug must not be two characters long: next.config.js treats a
 * two-character first segment as a locale.
 */

export type NavItem = {
  id: string;
  path: string;
  labelKey: string;
  /** Only dropdown items carry a description; top-level pages and the CTA do not. */
  descriptionKey?: string;
};

export type NavGroup = {
  id: 'leer' | 'teksten' | 'stichting';
  labelKey: string;
  items: readonly NavItem[];
};

function groupItem(id: string, path: string, labelKey: string): NavItem {
  return { id, path, labelKey, descriptionKey: `descriptions.${labelKey}` };
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'leer',
    labelKey: 'groups.leer',
    items: [
      groupItem('message', 'boodschap', 'message'),
      groupItem('pillars', 'pilaren', 'pillars'),
      groupItem('oath', 'eed', 'oath'),
      groupItem('depth', 'diepte', 'depth'),
    ],
  },
  {
    id: 'teksten',
    labelKey: 'groups.teksten',
    items: [groupItem('ands', 'ands', 'ands'), groupItem('poems', 'poems', 'poems'), groupItem('book', 'boek', 'book')],
  },
  {
    id: 'stichting',
    labelKey: 'groups.stichting',
    items: [
      groupItem('statutes', 'statuten', 'statutes'),
      groupItem('annualReports', 'jaarstukken', 'annualReports'),
      groupItem('bankStatements', 'bankafschriften', 'bankStatements'),
      groupItem('openness', 'openheid', 'openness'),
    ],
  },
];

export const NAV_PAGES: readonly NavItem[] = [{ id: 'skyyurt', path: 'skyyurt', labelKey: 'skyyurt' }];

export const NAV_CTA: NavItem = { id: 'contact', path: 'contact', labelKey: 'connect' };

export function localeHref(locale: string, path: string): string {
  return `/${locale}/${path}`;
}
