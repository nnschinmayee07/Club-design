'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

export default function LiteratiClosing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-20% 0px' })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'center center'],
  })

  // "Find your" parallax — drifts up as section enters
  const titleY = useTransform(scrollYProgress, [0, 1], [40, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: '10vh', paddingBottom: '15vh' }}
    >
      {/* Top rule */}
      <motion.div
        style={{ width: 1, background: 'var(--ink-dim)', height: 80, marginBottom: '4rem' }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      <motion.p
        className="eyebrow mb-8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Want in?
      </motion.p>

      {/* "Find your" + "voice." with split animation */}
      <motion.h2
        className="display"
        style={{
          fontSize: 'clamp(3rem, 10vw, 9rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          marginBottom: '2.5rem',
          y: titleY,
          opacity: titleOpacity,
        }}
      >
        <motion.span
          className="block"
          initial={{ y: 32, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          Find your
        </motion.span>
        {/* The aesthetic risk: "voice." flickers like an actual candle flame */}
        <motion.span
          className="candle-flicker block"
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          voice.
        </motion.span>
      </motion.h2>

      <motion.p
        style={{ color: 'var(--ink-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 380, marginBottom: '3.5rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.75 }}
      >
        Literati is open to everyone. You don't need experience — just the willingness to show up.
      </motion.p>

      {/* Social links */}
      <motion.div
        className="flex gap-8 items-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.95 }}
      >
        <a
          href="https://www.instagram.com/mlrclubliterati"
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow"
          style={{
            color: 'var(--ink-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '0.625rem',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
        >
          Instagram
        </a>
        <span style={{ width: 1, height: 16, background: 'var(--ink-dim)' }} />
        <a
          href="https://www.linkedin.com/company/mlrclubliterati"
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow"
          style={{
            color: 'var(--ink-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '0.625rem',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--verdigris)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
        >
          LinkedIn
        </a>
      </motion.div>

      {/* Bottom credit */}
      <motion.p
        className="eyebrow"
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--ink-dim)',
          fontSize: '0.55rem',
          whiteSpace: 'nowrap',
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        Club Literati · MLRIT · Communicate | Compete | Conquer
      </motion.p>
    </section>
  )
}
