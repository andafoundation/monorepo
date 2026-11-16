'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}

export function AnimatedGradient({
  children,
  className,
  gradientClassName
}: AnimatedGradientProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div
        className={cn(
          'absolute inset-0 opacity-30',
          gradientClassName
        )}
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
