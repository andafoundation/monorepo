import * as React from "react";
import { cn } from "@/lib/utils";

type ThemeVariant = "delft" | "sky" | "porcelain" | "ink";

const variantStyles: Record<ThemeVariant, string> = {
  delft: "bg-delft-gradient",
  sky: "bg-van-gogh-sky",
  porcelain: "bg-porcelain-paper",
  ink: "bg-ink-wash",
};

interface ThemeBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ThemeVariant;
  showTexture?: boolean;
}

export function ThemeBackground({
  variant = "porcelain",
  showTexture = true,
  className,
  children,
  ...props
}: ThemeBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <div className={cn("absolute inset-0 pointer-events-none", variantStyles[variant])} />
      {showTexture && (
        <div className="absolute inset-0 pointer-events-none bg-brush-texture opacity-40" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
