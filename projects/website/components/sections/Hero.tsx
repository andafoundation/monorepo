'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Spotlight } from '@/components/ui/spotlight';
import { Section } from '../ui/section';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <Section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-van-gogh-sky">
      {/* Animated starfield background - optimized */}
      <div className="absolute inset-0 stars-container" />

      {/* Spotlight effect - toned down more */}
      <div className="opacity-20">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      </div>

      {/* Background image removed for cleaner hero */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center text-porcelain px-4 py-8 md:py-12 max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        >
          {t('title')}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]"
        >
          {t('subtitle')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg mb-6 drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
            <Button
            asChild
            size="lg"
            className="text-base shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] bg-porcelain text-primary hover:bg-porcelain/90"
          >
            <Link href="/boodschap">{t('cta')}</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-32 md:w-48 hidden sm:block z-10"
      >
        <Image
          src="/assets/De Anda - Kaft.webp"
          alt="Boek Kaft Anda Filosofie"
          width={300}
          height={400}
          sizes="(min-width: 768px) 180px, 120px"
          className="rounded-3xl shadow-2xl"
        />
      </motion.div>
    </Section>
  );
}
