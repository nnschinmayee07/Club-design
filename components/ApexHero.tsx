'use client';
    import { useRef } from 'react';
    import Link from 'next/link';
    import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
    const EASE = [0.22, 1, 0.36, 1] as const;
    export default function ApexHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 0.92, 0]);
    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    return (
      <section ref={sectionRef} className="relative w-full overflow-hidden bg-black" style={{ minHeight: '100svh' }} aria-label="APEX Club Hero">
        <motion.div style={{ opacity: heroOpacity, scale: videoScale }} className="absolute inset-0 z-[1] h-full w-full">
          <video src="/videos/apex-hero.mp4" autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" aria-label="APEX club motion banner" />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, transparent 24%, transparent 70%, rgba(0,0,0,0.72) 100%)' }} />
        </motion.div>
        <div className="absolute left-0 right-0 top-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 md:px-10 md:pt-8 lg:px-16">
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Link href="/campus/clubs" className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-white">← Clubs &amp; Societies</Link>
          </motion.div>
          <motion.span initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="hidden font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/40 md:inline">MLRIT · APEX · Esports &amp; Game Development</motion.span>
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <h1 className="flex flex-col font-sans text-[clamp(5rem,17vw,15rem)] font-black leading-[0.72] tracking-[-0.09em] text-white">
            <motion.span initial={reducedMotion ? false : { opacity: 0, y: -120 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: EASE }}>APEX</motion.span>
            <motion.span initial={reducedMotion ? false : { opacity: 0, y: 120 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: EASE }} className="ml-[16vw] text-[#D80000]">CLUB</motion.span>
          </h1>
        </div>
        <motion.div initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2" aria-hidden="true"><span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-white/45">Scroll</span><span className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent" /></motion.div>
      </section>
    );
    }
    