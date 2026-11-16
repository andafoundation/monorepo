'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MovingBorderProps = {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>;

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = 'button',
  ...otherProps
}: MovingBorderProps) {
  return (
    <Component
      className={cn(
        'relative bg-transparent p-[1px] overflow-hidden',
        containerClassName
      )}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ padding: '1px' }}
      >
        <motion.div
          transition={{
            duration: duration / 1000,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          className={cn(
            'absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(26,63,139,0.8),transparent_50%)] opacity-75',
            borderClassName
          )}
        />
      </div>
      <div
        className={cn(
          'relative bg-porcelain border border-ink/10 backdrop-blur-xl text-ink flex items-center justify-center w-full h-full text-sm antialiased rounded-3xl',
          className
        )}
      >
        {children}
      </div>
    </Component>
  );
}

export const BorderButton = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <MovingBorder
      duration={2000}
      className="bg-porcelain text-primary font-semibold px-6 py-3"
      {...props}
    >
      {children}
    </MovingBorder>
  );
};
