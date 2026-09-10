'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function WhatIsLiterati() {
  const ref = useRef<HTMLDivElement>(null)

  // Use scroll position relative to this section for reversible word reveal
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })

  // Smooth the scroll value to avoid jumpy reversals
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 })

  const words = [
    'A place', 'where', 'students', 'speak', 'their', 'minds,',
    'explore', 'new', 'ideas,', 'and', 'slowly', 'grow', 'into',
    'the', 'confidence', 'they', "didn't", 'know', 'they', 'had.',
  ]

  // Eyebrow slide
  const eyebrowX = useTransform(smoothProgress, [0, 0.08], [-20, 0])
  const eyebrowOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1])

  // Supporting copy block
  const copyOpacity = useTransform(smoothProgress, [0.55, 0.75], [0, 1])
  const copyY = useTransform(smoothProgress, [0.55, 0.75], [28, 0])

  return (
    <section ref={ref} className="relative z-10 px-6 md:px-16 lg:px-24 py-40 md:py-56 max-w-5xl mx-auto">
      {/* Eyebrow */}
      <motion.p
        className="eyebrow mb-12"
        style={{ x: eyebrowX, opacity: eyebrowOpacity }}
      >
        What is Literati
      </motion.p>

      {/* Lamp-glow word reveal — each word lights sequentially and reverses */}
      <h2
        className="display"
        style={{
          fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
        }}
        aria-label="A place where students speak their minds, explore new ideas, and slowly grow into the confidence they didn't know they had."
      >
        {words.map((word, i) => (
          <LampWord
            key={i}
            word={word}
            index={i}
            total={words.length}
            progress={smoothProgress}
          />
        ))}
      </h2>

      {/* Supporting copy */}
      <motion.div
        className="mt-16 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-16"
        style={{ opacity: copyOpacity, y: copyY }}
      >
        <p style={{ color: 'var(--ink-muted)', lineHeight: 1.75, fontSize: '1.0625rem' }}>
          Whether you love being on stage or are simply looking for the courage to take that first step — Literati gives you the space to do so. At its core, it is about finding your voice, finding your people, and becoming a little bolder along the way.
        </p>
        <div className="flex flex-col gap-6">
          {[
            { label: 'Talkmasters', desc: 'Impromptu speaking, mentorship, and the habit of showing up.' },
            { label: 'MLRITMUN', desc: 'Model UN — international diplomacy on campus.' },
            { label: 'TEDx MLRIT', desc: 'Ideas worth spreading, independently organised.' },
            { label: 'Literary Fest', desc: 'One day. Every kind of mind. Every kind of contest.' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex gap-4 items-start">
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                flexShrink: 0, marginTop: '0.55em',
              }} />
              <div>
                <span style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '0.9375rem' }}>{label}</span>
                <span style={{ color: 'var(--ink-dim)', fontSize: '0.9375rem' }}> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function LampWord({
  word,
  index,
  total,
  progress,
}: {
  word: string
  index: number
  total: number
  progress: any
}) {
  // Each word lights up in a staggered window [0..0.55] of section progress
  // and fades back out as the section exits [0.75..1.0]
  const lightIn  = 0.04 + (index / total) * 0.44
  const lightPeak = lightIn + 0.06
  const lightOut  = 0.78 + (index / total) * 0.18

  // Color transitions: dark → gold → white
  const wordColor = useTransform(
    progress,
    [lightIn, lightPeak, lightPeak + 0.06, lightOut, Math.min(lightOut + 0.08, 1)],
    [
      'rgba(90,80,60,0.28)',
      'rgba(255,210,100,1)',
      'rgba(240,234,216,1)',
      'rgba(240,234,216,1)',
      'rgba(90,80,60,0.28)',
    ]
  )

  // Text-shadow glow: off → bright gold → subtle warm → off
  const glowOpacity = useTransform(
    progress,
    [lightIn, lightPeak, lightPeak + 0.04, lightOut, Math.min(lightOut + 0.08, 1)],
    [0, 1, 0.08, 0.08, 0]
  )

  // Slight vertical rise as word is lit
  const wordY = useTransform(
    progress,
    [lightIn, lightPeak + 0.03],
    [6, 0]
  )

  return (
    <span
      className="inline-block overflow-visible mr-[0.22em] last:mr-0"
      style={{ position: 'relative' }}
    >
      <motion.span
        className="inline-block"
        style={{
          color: wordColor,
          y: wordY,
          position: 'relative',
        }}
      >
        {word}
        {/* Glow layer rendered behind via mix */}
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            color: 'transparent',
            textShadow: '0 0 30px rgba(255,185,60,1), 0 0 70px rgba(201,125,46,0.6)',
            opacity: glowOpacity,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {word}
        </motion.span>
      </motion.span>
    </span>
  )
}
