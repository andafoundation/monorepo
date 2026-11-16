import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type PorcelainCardProps = React.HTMLAttributes<HTMLDivElement>;

export const PorcelainCard = React.forwardRef<HTMLDivElement, PorcelainCardProps>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "rounded-3xl border border-ink/10 bg-porcelain/90 shadow-[0_18px_40px_-32px_rgba(11,27,51,0.45)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
);

PorcelainCard.displayName = "PorcelainCard";
