'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { literati } from '@/data/literati'

const GAP = 320

const PHOTO_LAYOUT = [
  { rotate: -5,  yOffset:  55, scale: 1.05, size: 260 },
  { rotate:  7,  yOffset: -45, scale: 0.93, size: 225 },
  { rotate: -3,  yOffset:  25, scale: 1.08, size: 275 },
  { rotate:  9,  yOffset: -60, scale: 0.90, size: 215 },
  { rotate: -7,  yOffset:  48, scale: 1.0,  size: 250 },
  { rotate:  4,  yOffset: -32, scale: 0.96, size: 235 },
  { rotate: -10, yOffset:  38, scale: 1.03, size: 255 },
  { rotate:  6,  yOffset: -22, scale: 0.92, size: 222 },
]

function Polaroid({
  memory,
  layout,
  index,
}: {
  memory: typeof literati.memories[0]
  layout: typeof PHOTO_LAYOUT[0]
  index: number
}) {
  const swayDur   = 3.0 + (index % 4) * 0.6
  const swayDelay = index * 0.2

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: layout.rotate * 2.5, scale: 0.8 }}
      whileInView={{ opacity: 1, y: layout.yOffset, rotate: layout.rotate, scale: layout.scale }}
      viewport={{ once: true, margin: '0px -20%' }}
      transition={{ delay: index * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: layout.scale * 1.07, rotate: layout.rotate * 0.2, zIndex: 40, transition: { duration: 0.22 } }}
      style={{
        position: 'relative',
        zIndex: 5 + index,
        flexShrink: 0,
        width: layout.size,
        cursor: 'default',
        animation: `photo-sway-${index % 4} ${swayDur}s ease-in-out ${swayDelay}s infinite alternate`,
      }}
    >
      <div style={{
        background: '#f0ead8',
        padding: '10px 10px 40px 10px',
        boxShadow: '0 14px 52px rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.28)',
        borderRadius: '16px',
      }}>
        {/* Photo */}
        <div style={{
          width: '100%', aspectRatio: '4/3',
          overflow: 'hidden', position: 'relative',
          background: memory.placeholder, borderRadius: '8px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${memory.src})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.10,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          {/* Corner vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.42) 100%)' }} />
          {/* Label chip */}
          <div style={{
            position: 'absolute', bottom: 7, left: 8,
            fontFamily: '-apple-system, sans-serif', fontSize: '0.45rem',
            fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.58)',
          }}>
            {memory.label}
          </div>
        </div>

        {/* Handwritten-style caption */}
        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '0.7rem', color: '#3a2e22',
          textAlign: 'center', paddingTop: '8px', lineHeight: 1.4,
        }}>
          {memory.title}
        </p>
      </div>
    </motion.div>
  )
}

export default function MemoryLane() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })

  const memories = literati.memories
  const STRIP_WIDTH = memories.length * GAP + 200
  const x = useTransform(scrollYProgress, [0, 1], ['4%', `${-(STRIP_WIDTH - 1100)}px`])

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        height: `${memories.length * 80}vh`,
        minHeight: '600px',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 600px',
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Header */}
        <div className="relative z-20 px-8 md:px-16 mb-12 flex-shrink-0">
          <p className="eyebrow mb-3" style={{ color: 'var(--verdigris)' }}>Memory Lane</p>
          <div className="flex items-baseline gap-4">
            <h2 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700,
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', lineHeight: 1,
              letterSpacing: '-0.02em', color: 'var(--ink)',
            }}>
              Moments from
            </h2>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontWeight: 700,
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', lineHeight: 1,
              letterSpacing: '-0.02em', color: 'var(--accent)',
            }}>
              LITERATI
            </h2>
          </div>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.8125rem', marginTop: '0.75rem', fontStyle: 'italic' }}>
            Every moment, a story.
          </p>
        </div>

        {/* Scroll-panned photo strip */}
        <motion.div
          style={{
            x,
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            paddingLeft: 80,
            paddingRight: 120,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {memories.map((memory, i) => (
            <Polaroid
              key={i}
              memory={memory}
              layout={PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]}
              index={i}
            />
          ))}

          {/* Closing quote card */}
          <div style={{ flexShrink: 0, paddingLeft: 40, maxWidth: 260 }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '1rem',
              fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.7,
            }}>
              "We don't just practise speaking.<br />We find the courage to mean it."
            </p>
            <p className="eyebrow" style={{ marginTop: '1.5rem', color: 'var(--ink-dim)', fontSize: '0.55rem' }}>
              Club Literati · MLRIT
            </p>
          </div>
        </motion.div>

      </div>

      {/* Sway keyframes */}
      <style>{`
        @keyframes photo-sway-0 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-10px) rotate(1.4deg); }
        }
        @keyframes photo-sway-1 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(8px) rotate(-1.7deg); }
        }
        @keyframes photo-sway-2 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-7px) rotate(1.1deg); }
        }
        @keyframes photo-sway-3 {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(9px) rotate(-1.3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="photo-sway"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
