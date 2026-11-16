import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ThemeBackground } from "@/components/ui/theme-background";

/**
 * A server component: the entrance runs in CSS (`animate-rise` in
 * `app/globals.css`) from the first paint, without waiting for hydration.
 * The heading is the page's largest text and so its LCP element; it only
 * slides into place and never starts transparent, so it counts as painted
 * the moment the HTML arrives. The lines below it fade in after it.
 */
export default function VanGoghHero() {
  const t = useTranslations("home.hero");

  return (
    <ThemeBackground
      variant="sky"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20 md:min-h-[80vh]"
    >
      <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl animate-brush-glow" />
      <div className="absolute right-10 top-16 h-72 w-72 rounded-full bg-porcelain/20 blur-3xl animate-brush-drift" />
      <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-blush/25 blur-3xl animate-brush-float" />

      <div className="relative z-10 mx-auto max-w-4xl text-center text-porcelain">
        <h1 className="animate-rise-visible motion-reduce:animate-none text-4xl md:text-6xl font-semibold leading-tight drop-shadow-[0_10px_24px_rgba(11,27,51,0.35)]">
          {t("title")}
        </h1>

        <h2 className="animate-rise [animation-delay:200ms] motion-reduce:animate-none mt-5 text-xl md:text-2xl text-porcelain/90">
          {t("subtitle")}
        </h2>

        <p className="animate-rise [animation-delay:300ms] motion-reduce:animate-none mt-6 text-base md:text-lg text-porcelain/85">
          {t("description")}
        </p>

        <div className="animate-rise [animation-delay:400ms] motion-reduce:animate-none mt-8 flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-porcelain text-primary shadow-[0_10px_30px_-15px_rgba(242,193,98,0.6)] hover:bg-porcelain/90"
          >
            <Link href="/boodschap">{t("cta")}</Link>
          </Button>
        </div>
      </div>

    </ThemeBackground>
  );
}
