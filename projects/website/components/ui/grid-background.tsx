'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full bg-porcelain',
        className
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#1a3f8b08_1px,transparent_1px),linear-gradient(to_bottom,#1a3f8b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      {children}
    </div>
  );
}

export function DotBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full bg-porcelain',
        className
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#1a3f8b15_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      {children}
    </div>
  );
}
