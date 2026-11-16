import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import DiepteArticle from '@/components/diepte/DiepteArticle';
import type { DiepteInfoboxRow } from '@/components/diepte/DiepteInfobox';
import { buildOutline } from '@/components/diepte/outline';
import { CardContent } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import {
  DIEPTE_SECTIONS,
  getDiepteDocument,
  type DiepteBlock,
  type DiepteDocument,
  type DiepteSectionId,
} from '@/content/diepte';
import { ANDAISM_JSON_LD_ID, buildMenguJsonLd, buildTengrismJsonLd } from '@/lib/seo/build-andaism-json-ld';
import { buildArticleJsonLd, diepteArticleSections } from '@/lib/seo/build-article-json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/build-breadcrumb-json-ld';
import { buildPageJsonLd } from '@/lib/seo/build-page-json-ld';
import { JsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { localePath } from '@/lib/seo/site';

type DieptePageProps = { params: Promise<{ locale: string }> };

const DIEPTE_SLUG = 'diepte';

const WORDS_PER_MINUTE = 200;

/** The infobox rows in display order, each with the section that explains its value. */
const INFOBOX_ROWS: readonly { key: string; sectionId?: DiepteSectionId }[] = [
  { key: 'type' },
  { key: 'founded', sectionId: 'history' },
  { key: 'founder', sectionId: 'founder' },
  { key: 'origin', sectionId: 'cultural-background' },
  { key: 'centralConcept', sectionId: 'mengu' },
  { key: 'texts', sectionId: 'texts' },
  { key: 'pillars', sectionId: 'six-pillars' },
  { key: 'aim', sectionId: 'becoming-endless' },
  { key: 'followers', sectionId: 'becoming-anda' },
  { key: 'leaders', sectionId: 'onba' },
  { key: 'prayerHouse', sectionId: 'gokevi' },
  { key: 'sacredDay', sectionId: 'friday-ceremony' },
  { key: 'greeting', sectionId: 'etymology' },
  { key: 'influences', sectionId: 'other-traditions' },
  { key: 'slogan', sectionId: 'summary' },
];

/** The site's own pages that "See also" points to, with their header label. */
const SEE_ALSO_PAGES = [
  { path: 'pilaren', navKey: 'pillars' },
  { path: 'eed', navKey: 'oath' },
  { path: 'ands', navKey: 'ands' },
  { path: 'skyyurt', navKey: 'skyyurt' },
] as const;

export async function generateMetadata({ params }: DieptePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'diepte' });
  return buildPageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: DIEPTE_SLUG,
    locale,
  });
}

function countWords(blocks: DiepteBlock[]): number {
  return blocks.reduce((total, block) => {
    const texts = block.type === 'paragraph' ? [block.text] : block.type === 'quote' ? block.lines : block.items;
    return total + texts.reduce((sum, text) => sum + text.split(/\s+/).filter(Boolean).length, 0);
  }, 0);
}

/** A row links only to a section this locale renders, so no link ever points at a missing anchor. */
function linkedSection(document: DiepteDocument, sectionId: DiepteSectionId | undefined) {
  return sectionId !== undefined && document.sections[sectionId] !== null ? sectionId : undefined;
}

export default async function DieptePage({ params }: DieptePageProps) {
  const { locale } = await params;
  // Next renders the page in parallel with the layout, so the page sets the
  // locale for its own server translations as well.
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([getTranslations('diepte'), getTranslations('nav')]);
  const { document, translated } = getDiepteDocument(locale);
  const outline = buildOutline(document, { seeAlso: t('seeAlso') });

  const words = DIEPTE_SECTIONS.reduce(
    (total, entry) => total + countWords(document.sections[entry.id]?.blocks ?? []),
    countWords(document.lead),
  );
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  const path = localePath(locale, DIEPTE_SLUG);
  const jsonLd = buildPageJsonLd({
    type: 'WebPage',
    path,
    name: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    breadcrumb: buildBreadcrumbJsonLd({
      items: [
        { name: tNav('home'), path: localePath(locale, '') },
        { name: tNav('depth'), path },
      ],
      path,
    }),
    // The Article states the language the text is written in, which stays
    // English on a locale that does not have a translation yet.
    mainEntity: buildArticleJsonLd({
      path,
      headline: t('pageTitle'),
      description: t('metaDescription'),
      locale: document.locale,
      wordCount: words,
      articleSections: diepteArticleSections(document),
      aboutId: ANDAISM_JSON_LD_ID,
      // The text centres on Mengü and compares Andaism with Tengrism by name.
      mentions: [buildMenguJsonLd(locale), buildTengrismJsonLd(locale)],
    }),
  });

  const rows: DiepteInfoboxRow[] = INFOBOX_ROWS.map((row) => ({
    label: t(`infobox.${row.key}.label`),
    value: t(`infobox.${row.key}.value`),
    sectionId: linkedSection(document, row.sectionId),
  }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <DelftSection variant="porcelain" className="min-h-screen pb-24 pt-32 md:pt-36">
        <PorcelainCard
          id="top"
          className="mx-auto max-w-anda scroll-mt-28 border-ink/15 bg-[linear-gradient(160deg,rgba(247,243,236,0.98),rgba(247,243,236,0.9))] shadow-[0_24px_60px_-45px_rgba(11,27,51,0.5)] lg:scroll-mt-32"
        >
          <CardContent className="px-5 py-8 text-[15px] leading-relaxed text-ink/85 md:px-10 md:py-12 md:text-base">
            <DiepteArticle
              document={document}
              translated={translated}
              uiLang={locale}
              outline={outline}
              infobox={{ title: t('pageTitle'), rows, imageAlt: t('infobox.imageAlt') }}
              seeAlso={SEE_ALSO_PAGES.map((page) => ({
                href: `/${locale}/${page.path}`,
                label: tNav(page.navKey),
              }))}
              labels={{
                title: t('pageTitle'),
                tagline: `${t('subtitle')} · ${t('readingTime', { minutes })}`,
                englishOnly: t('englishOnly'),
                contents: t('contents'),
                backToTop: t('backToTop'),
                figureCaption: t('figures.skyyurt'),
              }}
            />
          </CardContent>
        </PorcelainCard>
      </DelftSection>
    </>
  );
}
