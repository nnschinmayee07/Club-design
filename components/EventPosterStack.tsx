'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { literati } from '@/data/literati'

const POSTER_ATMOSPHERES = [
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(1,116,31,0.35) 0%, transparent 70%)' },
      { gradient: 'linear-gradient(to bottom, rgba(2,61,16,0.9) 0%, rgba(1,116,31,0.3) 40%, rgba(10,61,31,0.95) 100%)' },
    ],
    accent: '#a8f0b8',
    symbol: '⚖',
    details: [
      { label: 'Format', value: 'Committees & Resolutions' },
      { label: 'Delegates', value: '200+ from across campus' },
      { label: 'Duration', value: '2-day simulation' },
      { label: 'Open to', value: 'All years' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 50% 70% at 50% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)' },
      { gradient: 'linear-gradient(to bottom, rgba(11,31,61,0.85) 0%, rgba(30,58,95,0.4) 50%, rgba(20,41,74,0.95) 100%)' },
    ],
    accent: '#a0c4f8',
    symbol: '◉',
    details: [
      { label: 'Venue', value: 'MLRIT Auditorium' },
      { label: 'Talks', value: 'Student & invited speakers' },
      { label: 'Theme', value: 'Echoes of Tomorrow' },
      { label: 'Licence', value: 'Independently Organised' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 60% 60% at 40% 70%, rgba(201,125,46,0.45) 0%, transparent 65%)' },
      { gradient: 'linear-gradient(to bottom, rgba(58,21,3,0.9) 0%, rgba(180,83,9,0.25) 45%, rgba(122,55,6,0.95) 100%)' },
    ],
    accent: '#ffd580',
    symbol: '✦',
    details: [
      { label: 'Competitions', value: 'Screen Battle, LitTrivia, Courtroom Drama' },
      { label: 'Scope', value: 'Full campus day event' },
      { label: 'Who', value: 'Everyone welcome' },
      { label: 'Vibe', value: 'High energy, all genres' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 40% 55% at 50% 20%, rgba(180,160,220,0.14) 0%, transparent 55%)' },
      { gradient: 'linear-gradient(to bottom, rgba(26,11,61,0.92) 0%, rgba(107,63,160,0.28) 45%, rgba(58,31,95,0.96) 100%)' },
    ],
    accent: '#d4b8f0',
    symbol: '◈',
    details: [
      { label: 'Format', value: 'Immersive team roleplay' },
      { label: 'Team size', value: '4–6 members' },
      { label: 'Goal', value: 'Crack the case before others' },
      { label: 'Difficulty', value: 'Everyone has a past' },
    ],
  },
]

// ─── Entry animation variants — all cards pop in together ─────────────────────
const ENTRY_VARIANTS = {
  hidden: { opacity: 0, y: 80, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function EventPosterStack() {
  const [selected, setSelected] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const events = literati.events

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: `${events.length * 100}vh` }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Section eyebrow */}
        <div style={{ position: 'absolute', top: '2.5rem', left: 'clamp(1.5rem, 5vw, 4rem)', zIndex: 20 }}>
          <p style={{
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.55rem',
            fontWeight: 600,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(201,125,46,0.65)',
          }}>
            Events
          </p>
        </div>

        {/* Cards stacked in center — each scroll-driven */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {events.map((event, i) => (
            <ScrollCard
              key={event.id}
              event={event}
              atmosphere={POSTER_ATMOSPHERES[i]}
              index={i}
              total={events.length}
              scrollYProgress={scrollYProgress}
              inView={inView}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>

        {/* Pagination dots */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '0.6rem', alignItems: 'center', zIndex: 20,
        }}>
          {events.map((_, i) => (
            <PaginationDot key={i} index={i} total={events.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected !== null && (
          <EventDetailOverlay
            event={events[selected]}
            atmosphere={POSTER_ATMOSPHERES[selected]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Individual card — entry pop + scroll in/out ───────────────────────────────
function ScrollCard({
  event, atmosphere, index, total, scrollYProgress, inView, onSelect,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
  index: number
  total: number
  scrollYProgress: any
  inView: boolean
  onSelect: () => void
}) {
  const seg = 1 / total
  const segStart = index * seg
  const segEnd   = (index + 1) * seg
  const fromLeft = index % 2 === 0

  // X — slide in from alt sides, exit to opposite
  const x = useTransform(
    scrollYProgress,
    index === 0
      ? [0, segEnd - seg * 0.1, segEnd]
      : [segStart - seg * 0.05, segStart + seg * 0.3, segEnd - seg * 0.1, segEnd],
    index === 0
      ? ['0vw', '0vw', fromLeft ? '-62vw' : '62vw']
      : [fromLeft ? '-82vw' : '82vw', '0vw', '0vw', fromLeft ? '-62vw' : '62vw'],
  )

  // Scale
  const scale = useTransform(
    scrollYProgress,
    index === 0
      ? [0, segEnd - seg * 0.1, segEnd]
      : [segStart - seg * 0.05, segStart + seg * 0.3, segEnd - seg * 0.1, segEnd],
    index === 0
      ? [1, 1, 0.86]
      : [0.86, 1, 1, 0.86],
  )

  // Opacity
  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 0.01, segEnd - seg * 0.06, segEnd]
      : [segStart - seg * 0.06, segStart + seg * 0.25, segEnd - seg * 0.06, segEnd],
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  )

  // Rotation on entry
  const rotate = useTransform(
    scrollYProgress,
    [segStart, segStart + seg * 0.3],
    index === 0 ? [0, 0] : [fromLeft ? -3 : 3, 0],
  )

  return (
    <motion.div
      // Entry pop animation (all cards animate in on first enter)
      custom={index}
      variants={ENTRY_VARIANTS}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      // Scroll-driven position on top of entry
      style={{
        x, scale, opacity, rotate,
        position: 'absolute',
        zIndex: index,
        cursor: 'pointer',
      }}
      onClick={onSelect}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
    >
      <PosterCard event={event} atmosphere={atmosphere} />
    </motion.div>
  )
}

// ─── Poster card visual ────────────────────────────────────────────────────────
function PosterCard({
  event, atmosphere,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
}) {
  return (
    <div
      style={{
        width: 'min(420px, 86vw)',
        height: 'min(600px, 78vh)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 50px 140px rgba(0,0,0,0.82), 0 12px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07)',
      }}
    >
      {/* Base + atmosphere */}
      <div style={{ position: 'absolute', inset: 0, background: event.gradient }} />
      {atmosphere.layers.map((layer, li) => (
        <div key={li} style={{ position: 'absolute', inset: 0, background: layer.gradient }} />
      ))}

      {/* Noise */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '250px',
      }} />

      {/* Tag row */}
      <div style={{ position: 'absolute', top: 28, left: 28, right: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontFamily: '-apple-system, sans-serif', fontSize: '0.52rem',
          fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
        }}>
          {event.tag}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.13)' }}>
          {atmosphere.symbol}
        </span>
      </div>

      {/* Center */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 36px',
      }}>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2.4rem, 7vw, 3.8rem)',
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: '-0.035em',
          color: 'rgba(255,255,255,0.97)',
          marginBottom: '1.1rem',
          textShadow: '0 2px 20px rgba(0,0,0,0.45)',
        }}>
          {event.title}
        </p>
        <p style={{
          fontFamily: '-apple-system, sans-serif',
          fontSize: '0.54rem', letterSpacing: '0.24em',
          textTransform: 'uppercase', color: atmosphere.accent, opacity: 0.85,
          marginBottom: '1.8rem',
        }}>
          {event.subtitle}
        </p>
        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.18)', marginBottom: '1.8rem' }} />
        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.65, maxWidth: 260,
        }}>
          {event.theme}
        </p>
      </div>

      {/* Bottom blurb */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '56px 28px 26px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
      }}>
        <p style={{
          fontFamily: '-apple-system, sans-serif', fontSize: '0.76rem',
          color: 'rgba(255,255,255,0.44)', lineHeight: 1.65,
        }}>
          {event.blurb}
        </p>
        <p style={{
          fontFamily: '-apple-system, sans-serif', fontSize: '0.46rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', marginTop: '0.8rem',
        }}>
          tap for details
        </p>
      </div>

      {/* Inner vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.38)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ─── Pagination dot ────────────────────────────────────────────────────────────
function PaginationDot({ index, total, scrollYProgress }: {
  index: number; total: number; scrollYProgress: any
}) {
  const seg = 1 / total
  const start = index * seg
  const end   = (index + 1) * seg

  const width   = useTransform(scrollYProgress, [start, start + 0.02, end - 0.02, end], [4, 20, 20, 4])
  const opacity = useTransform(scrollYProgress, [start, start + 0.02, end - 0.02, end], [0.25, 1, 1, 0.25])
  const bg      = useTransform(scrollYProgress, [start, start + 0.02], ['rgba(160,152,128,1)', 'rgba(201,125,46,1)'])

  return (
    <motion.div style={{ width, opacity, backgroundColor: bg, height: 3, borderRadius: 2 }} />
  )
}

// ─── Detail overlay ────────────────────────────────────────────────────────────
function EventDetailOverlay({
  event, atmosphere, onClose,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(4,2,10,0.80)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 52, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          width: 'min(560px, 92vw)',
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: '18px',
          background: 'rgba(12,8,22,0.97)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 60px 160px rgba(0,0,0,0.92)',
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 190, borderRadius: '18px 18px 0 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: event.gradient }} />
          {atmosphere.layers.map((layer, li) => (
            <div key={li} style={{ position: 'absolute', inset: 0, background: layer.gradient }} />
          ))}

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1.1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close"
          >
            ×
          </button>

          <div style={{ position: 'absolute', top: 20, left: 24 }}>
            <span style={{
              fontFamily: '-apple-system, sans-serif', fontSize: '0.5rem',
              fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.42)',
            }}>
              {event.tag}
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: 22, left: 24, right: 60 }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.9rem, 5vw, 2.7rem)',
              fontWeight: 700, lineHeight: 0.95,
              color: 'rgba(255,255,255,0.97)',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              {event.title}
            </p>
            <p style={{
              fontFamily: '-apple-system, sans-serif', fontSize: '0.52rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: atmosphere.accent, marginTop: '0.5rem',
            }}>
              {event.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 34px' }}>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.65, marginBottom: '1.4rem',
          }}>
            "{event.theme}"
          </p>
          <p style={{
            fontFamily: '-apple-system, sans-serif', fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '2rem',
          }}>
            {event.blurb}
          </p>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.8rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' }}>
            {atmosphere.details.map((d, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: '-apple-system, sans-serif', fontSize: '0.48rem',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)', marginBottom: '0.35rem',
                }}>
                  {d.label}
                </p>
                <p style={{
                  fontFamily: 'Georgia, serif', fontSize: '0.85rem',
                  color: atmosphere.accent, lineHeight: 1.45,
                }}>
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
