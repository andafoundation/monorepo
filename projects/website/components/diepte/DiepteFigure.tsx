import Image from 'next/image';

type DiepteFigureProps = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** The caption's language, which differs from the text's on an English fallback. */
  lang: string;
};

/** A captioned thumbnail beside the text, as Wikipedia frames the images of an article. */
export default function DiepteFigure({ src, alt, caption, width, height, lang }: DiepteFigureProps) {
  return (
    <figure lang={lang} className="mb-4 mt-4 w-full rounded-2xl border border-ink/10 bg-porcelain p-1.5 text-xs leading-snug text-ink/70 md:float-right md:ml-6 md:mt-1 md:w-64">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 244px, 100vw"
        className="h-auto w-full rounded-xl"
      />
      <figcaption className="px-1.5 pb-1 pt-2">{caption}</figcaption>
    </figure>
  );
}
