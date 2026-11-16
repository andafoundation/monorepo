import * as React from "react";
import { cn } from "@/lib/utils";
import { ThemeBackground } from "@/components/ui/theme-background";

interface DelftSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  container?: boolean;
  variant?: "delft" | "sky" | "porcelain" | "ink";
  innerClassName?: string;
}

export function DelftSection({
  className,
  innerClassName,
  children,
  container = true,
  variant = "porcelain",
  ...props
}: DelftSectionProps) {
  return (
    <ThemeBackground variant={variant} className={cn("py-16 md:py-20 px-4", className)}>
      <section className={cn("relative z-10", innerClassName)} {...props}>
        {container ? (
          <div className="mx-auto max-w-anda">{children}</div>
        ) : (
          children
        )}
      </section>
    </ThemeBackground>
  );
}
