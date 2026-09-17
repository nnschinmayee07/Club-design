'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ApexHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ minHeight: '100svh' }}
      aria-label="APEX Club Hero"
    >
      {/* ── Red cloud glow — left side ─────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[48%] pointer-events-none z-[3]"
        style={{
          opacity: heroOpacity,
          background:
            'radial-gradient(ellipse 90% 80% at 0% 50%, rgba(200,8,8,0.60) 0%, rgba(140,4,4,0.28) 45%, transparent 75%)',
          filter: 'blur(22px)',
        }}
      />

      {/* ── Red cloud glow — right side ────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[48%] pointer-events-none z-[3]"
        style={{
          opacity: heroOpacity,
          background:
            'radial-gradient(ellipse 90% 80% at 100% 50%, rgba(200,8,8,0.60) 0%, rgba(140,4,4,0.28) 45%, transparent 75%)',
          filter: 'blur(22px)',
        }}
      />

      {/* ── Video — full-bleed, object-cover ──────────────────────────────── */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute inset-0 w-full h-full z-[1]"
      >
        <video
          src="/videos/apex-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Top + bottom vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 72%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </motion.div>

      {/* ── Back nav + breadcrumb ──────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-6 md:pt-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/campus/clubs"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.24em] uppercase text-white/50 hover:text-white transition-colors"
          >
            ← Clubs &amp; Societies
          </Link>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="font-mono text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/35 hidden md:inline"
        >
          MLRIT · APEX · Esports &amp; Game Development
        </motion.span>
      </div>

      {/* ── Scroll cue ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.58rem] tracking-[0.28em] uppercase text-white/35">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/35 to-transparent"
        />
      </motion.div>
    </section>
  );
}
