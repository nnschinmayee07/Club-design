'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function LiteratiHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Page fades/shrinks slightly on scroll-out
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scale   = useTransform(scrollYProgress, [0, 0.55], [1, 0.95])

  // Split parallax: LITERATI moves up faster, CLUB moves up slower → depth split
  const yTop    = useTransform(scrollYProgress, [0, 1], ['0vh', '-14vh'])
  const yBottom = useTransform(scrollYProgress, [0, 1], ['0vh', '-6vh'])

  // Tagline parallax: lags behind both
  const yTagline = useTransform(scrollYProgress, [0, 1], ['0vh', '-2vh'])
  const tagOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.032]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      {/* Ambient light halo — top center, slightly warmer than before */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[480px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,125,46,0.11) 0%, transparent 68%)',
      }} />

      {/* Main title block */}
      <div className="relative z-10 text-center select-none px-6">

        {/* LITERATI — falls from above the viewport downward */}
        <motion.div style={{ y: yTop }} className="overflow-visible">
          <div className="overflow-hidden">
            <motion.h1
              className="display title-shimmer block"
              style={{
                fontSize: 'clamp(5rem, 18vw, 16rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
              }}
              initial={{ y: '-120%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              LITERATI
            </motion.h1>
          </div>
        </motion.div>

        {/* CLUB — rises from below the viewport upward */}
        <motion.div style={{ y: yBottom }} className="overflow-visible">
          <div className="overflow-hidden">
            <motion.span
              className="display title-shimmer-accent block"
              style={{
                fontSize: 'clamp(5rem, 18vw, 16rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
              }}
              initial={{ y: '120%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              CLUB
            </motion.span>
          </div>
        </motion.div>

        {/* Tagline — fades in, lags on scroll */}
        <motion.div style={{ y: yTagline, opacity: tagOpacity }}>
          <motion.p
            className="eyebrow mt-8 md:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            style={{ color: 'var(--ink-muted)' }}
          >
            Communicate&ensp;|&ensp;Compete&ensp;|&ensp;Conquer
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll nudge */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: tagOpacity }}
      >
        <span className="eyebrow" style={{ fontSize: '0.6rem', color: 'var(--ink-dim)' }}>scroll</span>
        <motion.div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, var(--ink-dim), transparent)' }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  )
}
