'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { literati } from '@/data/literati'

// Each poster's atmospheric photo layer — CSS-generated to feel textured and photographic
const POSTER_ATMOSPHERES = [
  // MLRITMUN — senate chamber, deep green
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(1,116,31,0.35) 0%, transparent 70%)', blur: 0 },
      { gradient: 'radial-gradient(ellipse 40% 40% at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)', blur: 0 },
      { gradient: 'linear-gradient(to bottom, rgba(2,61,16,0.9) 0%, rgba(1,116,31,0.3) 40%, rgba(10,61,31,0.95) 100%)', blur: 0 },
    ],
    accent: '#a8f0b8',
    symbol: '⚖',
  },
  // TEDx — auditorium spotlight, deep navy
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 50% 70% at 50% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)', blur: 0 },
      { gradient: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(30,58,95,0.8) 0%, transparent 70%)', blur: 0 },
      { gradient: 'linear-gradient(to bottom, rgba(11,31,61,0.85) 0%, rgba(30,58,95,0.4) 50%, rgba(20,41,74,0.95) 100%)', blur: 0 },
    ],
    accent: '#a0c4f8',
    symbol: '◉',
  },
  // Literary Fest — warm amber candlelight
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 60% 60% at 40% 70%, rgba(201,125,46,0.45) 0%, transparent 65%)', blur: 0 },
      { gradient: 'radial-gradient(ellipse 30% 30% at 70% 20%, rgba(253,200,100,0.12) 0%, transparent 50%)', blur: 0 },
      { gradient: 'linear-gradient(to bottom, rgba(58,21,3,0.9) 0%, rgba(180,83,9,0.25) 45%, rgba(122,55,6,0.95) 100%)', blur: 0 },
    ],
    accent: '#ffd580',
    symbol: '✦',
  },
  // Murder Mystery — theatrical purple, single spotlight
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 40% 55% at 50% 20%, rgba(180,160,220,0.14) 0%, transparent 55%)', blur: 0 },
      { gradient: 'radial-gradient(ellipse 70% 50% at 50% 90%, rgba(107,63,160,0.5) 0%, transparent 65%)', blur: 0 },
      { gradient: 'linear-gradient(to bottom, rgba(26,11,61,0.92) 0%, rgba(107,63,160,0.28) 45%, rgba(58,31,95,0.96) 100%)', blur: 0 },
    ],
    accent: '#d4b8f0',
    symbol: '◈',
  },
]

export default function EventPosterStack() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const events = literati.events

  return (
    <section ref={ref} className="relative" style={{ height: `${events.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center" style={{ zIndex: 10 }}>

        <div className="absolute top-10 left-6 md:left-16 z-20">
          <p className="eyebrow">Events</p>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          {events.map((event, i) => (
            <PosterCard
              key={event.id}
              event={event}
              atmosphere={POSTER_ATMOSPHERES[i]}
              index={i}
              total={events.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20 items-center">
          {events.map((_, i) => (
            <PaginationDot key={i} index={i} total={events.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PosterCard({
  event,
  atmosphere,
  index,
  total,
  scrollYProgress,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
  index: number
  total: number
  scrollYProgress: any
}) {
  const seg = 1 / total
  const segStart = index * seg
  const segEnd = (index + 1) * seg

  // Scale — incoming posters start slightly small and grow to fill
  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [0, segEnd - seg * 0.1, segEnd]
      : [segStart - seg * 0.1, segStart + seg * 0.3, segEnd - seg * 0.1, segEnd],
    index === 0
      ? [1, 1, 0.84]
      : [0.84, 1, 1, 0.84],
  )

  // X — cards slide in alternately from left (even) and right (odd)
  const fromLeft = index % 2 === 0
  const x = useTransform(
    scrollYProgress,
    index === 0
      ? [0, segEnd - seg * 0.1, segEnd]
      : [segStart - seg * 0.05, segStart + seg * 0.35, segEnd - seg * 0.1, segEnd],
    index === 0
      ? ['0vw', '0vw', fromLeft ? '-60vw' : '60vw']
      : [fromLeft ? '-80vw' : '80vw', '0vw', '0vw', fromLeft ? '-60vw' : '60vw'],
  )

  // Opacity
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0.01, segEnd - seg * 0.06, segEnd]
      : [segStart - seg * 0.06, segStart + seg * 0.25, segEnd - seg * 0.06, segEnd],
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  )

  // Slight rotation that resolves as poster becomes dominant — mirrors the entry side
  const rotate = useTransform(
    scrollYProgress,
    [segStart, segStart + seg * 0.35],
    index === 0 ? [0, 0] : [fromLeft ? -4 : 4, 0],
  )

  return (
    <motion.div
      style={{ scale, x, opacity, rotate, position: 'absolute', zIndex: index }}
      className="px-4 md:px-0"
    >
      <div
        style={{
          width: 'min(420px, 88vw)',
          height: 'min(600px, 80vh)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '3px',
          boxShadow: '0 50px 140px rgba(0,0,0,0.8), 0 12px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Base gradient from club data */}
        <div style={{ position: 'absolute', inset: 0, background: event.gradient }} />

        {/* Atmospheric light layers */}
        {atmosphere.layers.map((layer, li) => (
          <div key={li} style={{
            position: 'absolute', inset: 0,
            background: layer.gradient,
          }} />
        ))}

        {/* Paper/print texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '250px',
        }} />

        {/* Top section: Tag + decorative line */}
        <div style={{ position: 'absolute', top: 32, left: 28, right: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: '-apple-system, sans-serif',
              fontSize: '0.55rem',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              {event.tag}
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.15)',
            }}>
              {atmosphere.symbol}
            </span>
          </div>
        </div>

        {/* Center: Large title */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 32px',
        }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.2rem, 7vw, 3.6rem)',
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: '-0.035em',
            color: 'rgba(255,255,255,0.96)',
            marginBottom: '1.25rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}>
            {event.title}
          </p>

          <p style={{
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.58rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: atmosphere.accent,
            opacity: 0.8,
            marginBottom: '2rem',
          }}>
            {event.subtitle}
          </p>

          <div style={{ width: 36, height: 1, background: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }} />

          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.65,
            maxWidth: 260,
          }}>
            {event.theme}
          </p>
        </div>

        {/* Bottom: blurb with gradient mask */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '60px 28px 28px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
        }}>
          <p style={{
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.65,
          }}>
            {event.blurb}
          </p>
        </div>

        {/* Edge vignette to frame the poster like a physical print */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }} />
      </div>
    </motion.div>
  )
}

function PaginationDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number
  total: number
  scrollYProgress: any
}) {
  const seg = 1 / total
  const start = index * seg
  const end = (index + 1) * seg

  const width = useTransform(
    scrollYProgress,
    [start, start + 0.02, end - 0.02, end],
    [4, 20, 20, 4],
  )
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.02, end - 0.02, end],
    [0.25, 1, 1, 0.25],
  )
  const bg = useTransform(
    scrollYProgress,
    [start, start + 0.02],
    ['rgba(160,152,128,1)', 'rgba(201,125,46,1)'],
  )

  return (
    <motion.div
      style={{
        width,
        opacity,
        backgroundColor: bg,
        height: 3,
        borderRadius: 2,
        transformOrigin: 'center',
      }}
    />
  )
}
