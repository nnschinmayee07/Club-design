'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { literati } from '@/data/literati'

const GAP = 300

// Each photo's tilt, vertical offset, and size — alternating rhythm
const LAYOUT = [
  { rotate: -4,  yOffset:  50, scale: 1.04, size: 255 },
  { rotate:  6,  yOffset: -42, scale: 0.94, size: 220 },
  { rotate: -2,  yOffset:  28, scale: 1.07, size: 268 },
  { rotate:  8,  yOffset: -55, scale: 0.91, size: 218 },
  { rotate: -6,  yOffset:  44, scale: 1.0,  size: 248 },
  { rotate:  3,  yOffset: -28, scale: 0.96, size: 232 },
  { rotate: -8,  yOffset:  36, scale: 1.02, size: 252 },
  { rotate:  5,  yOffset: -20, scale: 0.93, size: 224 },
]

function Polaroid({
  memory,
  layout,
  index,
  scrollYProgress,
  total,
}: {
  memory: typeof literati.memories[0]
  layout: typeof LAYOUT[0]
  index: number
  scrollYProgress: any
  total: number
}) {
  // Each photo reveals when the strip has panned far enough to reach it
  // Map photo index to a scroll threshold
  const revealAt = (index / total) * 0.85
  const opacity = useTransform(scrollYProgress, [revealAt, revealAt + 0.07], [0, 1])
  const y = useTransform(scrollYProgress, [revealAt, revealAt + 0.07], [32, layout.yOffset])

  return (
    <motion.div
      style={{
        opacity,
        y,
        rotate: layout.rotate,
        scale: layout.scale,
        position: 'relative',
        zIndex: 5,
        flexShrink: 0,
        width: layout.size,
        cursor: 'default',
      }}
      whileHover={{
        scale: layout.scale * 1.06,
        rotate: layout.rotate * 0.2,
        zIndex: 20,
        transition: { duration: 0.22 },
      }}
    >
      {/* Polaroid frame */}
      <div style={{
        background: '#ede8d8',
        padding: '10px 10px 42px 10px',
        boxShadow: '0 16px 56px rgba(0,0,0,0.62), 0 4px 12px rgba(0,0,0,0.32)',
        borderRadius: '4px',
      }}>
        {/* Photo area */}
        <div style={{
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          position: 'relative',
          background: memory.placeholder,
          borderRadius: '2px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${memory.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Film grain on photo */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.09,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.40) 100%)',
          }} />
          {/* Label */}
          <span style={{
            position: 'absolute', bottom: 7, left: 9,
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.44rem', fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}>
            {memory.label}
          </span>
        </div>

        {/* Handwritten caption */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.68rem',
          color: '#3a2e22',
          textAlign: 'center',
          paddingTop: '9px',
          lineHeight: 1.38,
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
  const STRIP_WIDTH = memories.length * GAP + 280
  const x = useTransform(scrollYProgress, [0, 1], ['2%', `${-(STRIP_WIDTH - 1050)}px`])

  return (
    <section
      ref={ref}
      style={{
        height: `${memories.length * 80}vh`,
        minHeight: 600,
        position: 'relative',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 600px',
      }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* Header */}
        <div style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)', marginBottom: '2.5vh', flexShrink: 0 }}>
          <p style={{
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.55rem', fontWeight: 600,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--verdigris)', marginBottom: '0.5rem',
          }}>
            Memory Lane
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700,
              fontSize: 'clamp(1.2rem, 2.8vw, 2rem)', lineHeight: 1,
              letterSpacing: '-0.02em', color: 'var(--ink)',
            }}>
              Moments from
            </h2>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontWeight: 700,
              fontSize: 'clamp(1.2rem, 2.8vw, 2rem)', lineHeight: 1,
              letterSpacing: '-0.02em', color: 'var(--accent)',
            }}>
              LITERATI
            </h2>
          </div>
          <p style={{
            color: 'var(--ink-dim)', fontSize: '0.78rem',
            marginTop: '0.6rem', fontStyle: 'italic',
          }}>
            Every moment, a story.
          </p>
        </div>

        {/* Scroll-panned strip */}
        <motion.div style={{
          x,
          display: 'flex',
          alignItems: 'center',
          gap: GAP - 160,
          paddingLeft: 72,
          paddingRight: 100,
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}>
          {memories.map((memory, i) => (
            <Polaroid
              key={i}
              memory={memory}
              layout={LAYOUT[i % LAYOUT.length]}
              index={i}
              scrollYProgress={scrollYProgress}
              total={memories.length}
            />
          ))}

          {/* Closing quote */}
          <div style={{ flexShrink: 0, paddingLeft: 36, maxWidth: 240 }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '0.95rem',
              fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.72,
            }}>
              "We don't just practise speaking.<br />We find the courage to mean it."
            </p>
            <p style={{
              fontFamily: '-apple-system, sans-serif',
              fontSize: '0.5rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--ink-dim)',
              marginTop: '1.2rem',
            }}>
              Club Literati · MLRIT
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
