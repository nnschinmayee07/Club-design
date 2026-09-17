'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function ApexAtmosphere({ containerRef: _containerRef }: Props) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300, 700, 99999], [0, 0, 0.15, 0.15]);
  const scale   = useTransform(scrollY, [300, 900], [1.08, 1.0]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <motion.div style={{ scale }} className="absolute inset-0 w-full h-full">
        <video
          src="/videos/apex-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(64px) saturate(1.4) brightness(0.5)' }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}
