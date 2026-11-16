'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Card3D } from '@/components/ui/card-3d';

interface PillarCardProps {
  title: string;
  description: string;
  index: number;
}

export default function PillarCard({ title, description, index }: PillarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card3D containerClassName="h-full">
        <Card className="h-full bg-porcelain/90 border-ink/10 hover:shadow-[0_24px_50px_-36px_rgba(11,27,51,0.55)] transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-ink/80">{description}</CardDescription>
          </CardContent>
        </Card>
      </Card3D>
    </motion.div>
  );
}
