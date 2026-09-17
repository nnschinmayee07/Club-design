'use client';
    import { useRef } from 'react';
    import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
    const QUOTE = 'Not here to take part. Here to take over.';
    export default function ApexQuote() {
    const ref = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 10%'] });
    const y = useTransform(scrollYProgress, [0, 0.62, 1], reducedMotion ? [0, 0, 0] : [-100, 0, 12]);
    const opacity = useTransform(scrollYProgress, [0, 0.42, 0.72], [0, 1, 1]);
    const ruleScale = useTransform(scrollYProgress, [0.42, 0.78], [0, 1]);
    return (
      <section ref={ref} className="relative z-10 flex items-center justify-center overflow-hidden px-6 py-32 md:py-44 lg:py-56" aria-label="APEX quotation">
        <div className="mx-auto max-w-[1100px] text-center"><div className="mb-6 overflow-hidden"><motion.div style={{ y, opacity }} className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.32em] text-white/35">APEX · MLRIT</motion.div></div><div className="overflow-hidden"><motion.blockquote style={{ y, opacity }} className="font-sans text-[clamp(2rem,5.5vw,4.5rem)] font-black leading-[1.05] tracking-[-0.06em] text-white">&ldquo;{QUOTE}&rdquo;</motion.blockquote></div><div className="mt-10 flex justify-center overflow-hidden"><motion.div style={{ scaleX: ruleScale, transformOrigin: 'center' }} className="h-px w-16 bg-white/25" /></div></div>
      </section>
    );
    }
    