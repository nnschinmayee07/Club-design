'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// The single-line APEX quotation — impactful, one line, bold
const QUOTE = 'Not here to take part. Here to take over.';

export default function ApexQuote() {
  const ref = useRef<HTMLElement>(null);
  // once:false so re-entering section re-triggers the dropdown
  const inView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });

  return (
    <section
      ref={ref}
      className="relative z-10 flex items-center justify-center py-32 md:py-44 lg:py-56 px-6 overflow-hidden"
      aria-label="APEX quotation"
    >
      {/* Generous whitespace — quote must breathe */}
      <div className="max-w-[1100px] mx-auto text-center">
        {/* Eyebrow */}
        <div className="overflow-hidden mb-6">
          <motion.div
            animate={inView ? { y: 0, opacity: 1 } : { y: -14, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
            className="font-mono text-[0.68rem] font-bold tracking-[0.32em] uppercase text-white/35"
          >
            APEX · MLRIT
          </motion.div>
        </div>

        {/* Main quote — dropdown from top, clipped so it appears to fall into place */}
        <div className="overflow-hidden">
          <motion.blockquote
            animate={inView
              ? { y: 0, opacity: 1 }
              : { y: '-60px', opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="font-sans font-black text-white leading-[1.05] tracking-tighter-2"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
          >
            &ldquo;{QUOTE}&rdquo;
          </motion.blockquote>
        </div>

        {/* Thin rule beneath */}
        <div className="overflow-hidden mt-10 flex justify-center">
          <motion.div
            animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
            style={{ transformOrigin: 'center' }}
            className="h-px w-16 bg-white/20"
          />
        </div>
      </div>
    </section>
  );
}
