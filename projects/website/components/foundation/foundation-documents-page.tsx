import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DelftSection } from '@/components/ui/delft-section';
import { PorcelainCard } from '@/components/ui/porcelain-card';
import { ThemeBackground } from '@/components/ui/theme-background';
import type { FoundationDocument, FoundationLocale } from '@/content/foundation/documents';

type FoundationDocumentsPageProps = {
  title: string;
  subtitle: string;
  intro: string[];
  points?: string[];
  conclusion?: string;
  documentsTitle: string;
  emptyText: string;
  downloadLabel: string;
  locale: FoundationLocale;
  documents: readonly FoundationDocument[];
};

/** The layout shared by the foundation's document pages: hero, intro card and the document list. */
export function FoundationDocumentsPage({
  title,
  subtitle,
  intro,
  points,
  conclusion,
  documentsTitle,
  emptyText,
  downloadLabel,
  locale,
  documents,
}: FoundationDocumentsPageProps) {
  return (
    <div>
      <ThemeBackground variant="sky" className="relative pt-32 md:pt-36 pb-16 md:pb-24 px-4">
        <div className="relative z-10 text-center text-porcelain max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">{title}</h1>
          <p className="text-center text-lg italic text-porcelain/80">{subtitle}</p>
        </div>
      </ThemeBackground>

      <DelftSection variant="porcelain">
        <div className="max-w-5xl mx-auto space-y-8">
          <PorcelainCard>
            <CardContent className="space-y-4 pt-6">
              {intro.map((paragraph) => (
                <p key={paragraph} className="text-sm md:text-base text-ink/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {points && points.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-ink/80">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {conclusion ? (
                <p className="text-sm md:text-base text-ink/80 leading-relaxed">{conclusion}</p>
              ) : null}
            </CardContent>
          </PorcelainCard>

          <PorcelainCard>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-primary">{documentsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-sm md:text-base text-ink/70">{emptyText}</p>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {documents.map((document) => (
                    <li
                      key={document.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <div className="space-y-2">
                          <p className="text-sm md:text-base font-semibold text-ink">
                            {document.title[locale]}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-porcelain text-primary border border-primary/10">
                              PDF
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-porcelain text-ink/70 border border-ink/10">
                              {document.year}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
                        <a href={document.href} download>
                          <Download className="h-4 w-4" aria-hidden="true" />
                          {downloadLabel}
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </PorcelainCard>
        </div>
      </DelftSection>
    </div>
  );
}
