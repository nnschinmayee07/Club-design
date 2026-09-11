'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { literati } from '@/data/literati'

// Scatter layout: each photo gets a fixed rotation, vertical offset, and size
const PHOTO_LAYOUT = [
  { rotate: -4,  yOffset:  60, scale: 1.05, size: 260 },
  { rotate:  6,  yOffset: -40, scale: 0.92, size: 220 },
  { rotate: -2,  yOffset:  20, scale: 1.10, size: 280 },
  { rotate:  8,  yOffset: -60, scale: 0.88, size: 210 },
  { rotate: -6,  yOffset:  50, scale: 1.0,  size: 250 },
  { rotate:  3,  yOffset: -30, scale: 0.95, size: 235 },
  { rotate: -9,  yOffset:  40, scale: 1.02, size: 260 },
  { rotate:  5,  yOffset: -20, scale: 0.90, size: 220 },
]

// SVG string-light path — matches reference: bright warm glow, nodes at each photo
function WirePath({ memories }: { memories: typeof literati.memories }) {
  const GAP = 320
  const count = memories.length
  const W = count * GAP + 200
  const H = 420
  const midY = H / 2

  // Compute anchor point for each photo (where the string "touches" the card)
  const anchors: { x: number; y: number }[] = memories.map((_, i) => {
    const layout = PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]
    return {
      x: 80 + i * GAP + GAP / 2,
      y: midY + layout.yOffset * 0.55,
    }
  })

  // Build smooth cubic bezier through all anchors
  let d = `M 0 ${midY}`
  anchors.forEach((pt, i) => {
    const prev = i === 0 ? { x: 0, y: midY } : anchors[i - 1]
    const c1x = prev.x + (pt.x - prev.x) * 0.5
    const c1y = prev.y
    const c2x = prev.x + (pt.x - prev.x) * 0.5
    const c2y = pt.y
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${pt.x} ${pt.y}`
  })
  // Trail off to the right
  const last = anchors[anchors.length - 1]
  d += ` C ${last.x + 100} ${last.y}, ${last.x + 180} ${midY}, ${W} ${midY}`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: W,
        height: H,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Wide soft glow */}
        <filter id="string-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Tight node glow */}
        <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="node-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,200,1)" />
          <stop offset="60%" stopColor="rgba(240,180,80,0.8)" />
          <stop offset="100%" stopColor="rgba(201,125,46,0)" />
        </radialGradient>
      </defs>

      {/* Outermost wide glow — very soft, warm amber */}
      <path d={d} fill="none" stroke="rgba(220,140,40,0.18)" strokeWidth="18" filter="url(#string-glow)" />
      {/* Mid glow layer */}
      <path d={d} fill="none" stroke="rgba(240,180,80,0.35)" strokeWidth="8" filter="url(#string-glow)" />
      {/* Core bright string */}
      <path d={d} fill="none" stroke="rgba(255,230,150,0.92)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Glowing node dots at each photo anchor */}
      {anchors.map((pt, i) => (
        <g key={i} filter="url(#node-glow)">
          {/* Outer halo */}
          <circle cx={pt.x} cy={pt.y} r="10" fill="url(#node-grad)" opacity="0.7" />
          {/* Inner bright dot */}
          <circle cx={pt.x} cy={pt.y} r="3.5" fill="rgba(255,245,210,0.98)" />
          {/* Tiny core */}
          <circle cx={pt.x} cy={pt.y} r="1.5" fill="white" />
        </g>
      ))}
    </svg>
  )
}

function Polaroid({
  memory,
  layout,
  index,
}: {
  memory: typeof literati.memories[0]
  layout: typeof PHOTO_LAYOUT[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: layout.rotate * 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: layout.rotate }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      whileHover={{ scale: 1.04, rotate: layout.rotate * 0.3, zIndex: 20 }}
      style={{
        position: 'relative',
        zIndex: 5 + index,
        flexShrink: 0,
        width: layout.size,
        marginTop: layout.yOffset,
        cursor: 'default',
      }}
    >
      {/* Polaroid frame */}
      <div style={{
        background: '#f0ead8',
        padding: '10px 10px 36px 10px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
        borderRadius: '16px',
      }}>
        {/* Photo area */}
        <div style={{
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          position: 'relative',
          background: memory.placeholder,
          borderRadius: '8px',
        }}>
          {/* Atmospheric gradient overlay to make placeholder feel photographic */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${memory.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Photo grain */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.12,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
          }} />
          {/* Label on photo */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.5rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}>
            {memory.label}
          </div>
        </div>

        {/* Caption below photo in white strip */}
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.72rem',
          color: '#3a2e22',
          textAlign: 'center',
          paddingTop: '8px',
          lineHeight: 1.4,
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
  const STRIP_WIDTH = memories.length * 320 + 200

  // Horizontal pan: as user scrolls the section, the strip moves left
  const x = useTransform(scrollYProgress, [0, 1], ['4%', `${-(STRIP_WIDTH - 1100)}px`])

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${memories.length * 80}vh`, minHeight: '600px', contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        {/* Section header — left, above the strip */}
        <div className="relative z-20 px-8 md:px-16 mb-12 flex-shrink-0">
          <p className="eyebrow mb-3" style={{ color: 'var(--verdigris)' }}>Memory Lane</p>
          <div className="flex items-baseline gap-4">
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}>
              Moments from
            </h2>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--accent)',
            }}>
              LITERATI
            </h2>
          </div>
          <p style={{
            color: 'var(--ink-dim)',
            fontSize: '0.8125rem',
            marginTop: '0.75rem',
            fontStyle: 'italic',
          }}>
            Every moment, a story.
          </p>
        </div>

        {/* Scrolling photo strip */}
        <motion.div
          style={{ x, display: 'flex', alignItems: 'center', gap: 48, paddingLeft: 80, paddingRight: 120, position: 'relative', zIndex: 10 }}
        >
          {/* SVG wire threads through all photos */}
          <WirePath memories={memories} />

          {memories.map((memory, i) => (
            <Polaroid
              key={i}
              memory={memory}
              layout={PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]}
              index={i}
            />
          ))}

          {/* Closing quote */}
          <div style={{ flexShrink: 0, paddingLeft: 40, maxWidth: 260 }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--ink-muted)',
              lineHeight: 1.7,
            }}>
              "We don't just practise speaking.<br />We find the courage to mean it."
            </p>
            <p className="eyebrow" style={{ marginTop: '1.5rem', color: 'var(--ink-dim)', fontSize: '0.55rem' }}>
              Club Literati · MLRIT
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
