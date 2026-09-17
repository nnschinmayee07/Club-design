'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  endRef: React.RefObject<HTMLElement | null>;
}

export default function ApexRedGlow({ endRef }: Props) {
  const { scrollY } = useScroll();

  // Compute the scroll range where glow should fade out.
  // Re-compute on mount and resize (client-only).
  const [range, setRange] = useState<[number, number]>([99999, 99999]);

  useEffect(() => {
    const compute = () => {
      if (!endRef.current) return;
      const bottom    = endRef.current.offsetTop + endRef.current.offsetHeight;
      const fadeStart = Math.max(0, bottom - window.innerHeight * 0.8);
      setRange([fadeStart, bottom]);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [endRef]);

  const opacity = useTransform(scrollY, range, [1, 0]);

  const leftGlow  = 'radial-gradient(ellipse 100% 70% at 0% 50%, rgba(200,8,8,0.38) 0%, rgba(140,4,4,0.14) 55%, transparent 80%)';
  const rightGlow = 'radial-gradient(ellipse 100% 70% at 100% 50%, rgba(200,8,8,0.38) 0%, rgba(140,4,4,0.14) 55%, transparent 80%)';

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[2]">
      <motion.div
        style={{ opacity, background: leftGlow, filter: 'blur(30px)' }}
        className="absolute inset-y-0 left-0 w-[38%]"
      />
      <motion.div
        style={{ opacity, background: rightGlow, filter: 'blur(30px)' }}
        className="absolute inset-y-0 right-0 w-[38%]"
      />
    </div>
  );
}
