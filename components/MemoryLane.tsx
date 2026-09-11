'use client'

import { useRef, useEffect, useId } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { literati } from '@/data/literati'

const GAP = 320

const PHOTO_LAYOUT = [
  { rotate: -4, yOffset:  60, scale: 1.05, size: 260 },
  { rotate:  6, yOffset: -40, scale: 0.92, size: 220 },
  { rotate: -2, yOffset:  20, scale: 1.10, size: 280 },
  { rotate:  8, yOffset: -60, scale: 0.88, size: 210 },
  { rotate: -6, yOffset:  50, scale: 1.0,  size: 250 },
  { rotate:  3, yOffset: -30, scale: 0.95, size: 235 },
  { rotate: -9, yOffset:  40, scale: 1.02, size: 260 },
  { rotate:  5, yOffset: -20, scale: 0.90, size: 220 },
]

function buildPath(memories: typeof literati.memories) {
  const count = memories.length
  const W = count * GAP + 200
  const H = 420
  const midY = H / 2

  const anchors = memories.map((_, i) => {
    const layout = PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]
    return { x: 80 + i * GAP + GAP / 2, y: midY + layout.yOffset * 0.6 }
  })

  let d = `M 0 ${midY}`
  anchors.forEach((pt, i) => {
    const prev = i === 0 ? { x: 0, y: midY } : anchors[i - 1]
    const dx = pt.x - prev.x
    d += ` C ${prev.x + dx * 0.35} ${prev.y - 55}, ${prev.x + dx * 0.65} ${pt.y + 55}, ${pt.x} ${pt.y}`
  })
  const last = anchors[anchors.length - 1]
  d += ` C ${last.x + 120} ${last.y - 40}, ${last.x + 200} ${midY + 20}, ${W} ${midY}`

  return { d, anchors, W, H, midY }
}

// Paper plane SVG — points right, rotated by CSS motion-path automatically
function PaperPlane() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}>
      {/* Shadow */}
      <path d="M2 18 L34 10 L20 26 Z" fill="rgba(0,0,0,0.18)" transform="translate(2,3)" />
      {/* Body */}
      <path d="M2 18 L34 10 L20 26 Z" fill="rgba(240,220,160,0.95)" stroke="rgba(180,130,40,0.7)" strokeWidth="1" strokeLinejoin="round" />
      {/* Fold crease */}
      <path d="M20 26 L22 18 L34 10" fill="rgba(200,170,90,0.5)" stroke="rgba(160,110,30,0.5)" strokeWidth="0.8" strokeLinejoin="round" />
      {/* Highlight */}
      <path d="M2 18 L34 10 L22 15 Z" fill="rgba(255,245,200,0.4)" />
    </svg>
  )
}

function TrailAndPlane({
  memories,
  scrollYProgress,
}: {
  memories: typeof literati.memories
  scrollYProgress: any
}) {
  const uid = useId().replace(/:/g, '')
  const planeRef = useRef<HTMLDivElement>(null)
  const { d, anchors, W, H } = buildPath(memories)
  const pathId = `trail-${uid}`

  // Drive plane along path via offsetDistance
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!planeRef.current) return
    // clamp to 0–98% so plane doesn't disappear off end
    const pct = Math.min(v * 100, 98)
    planeRef.current.style.offsetDistance = `${pct}%`
  })

  return (
    <>
      {/* SVG trail */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Hidden path for motion — referenced by plane */}
        <defs>
          <path id={pathId} d={d} />
        </defs>
        {/* Shadow dots */}
        <path d={d} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 20" />
        {/* Main dashed trail */}
        <path d={d} fill="none" stroke="rgba(240,218,160,0.82)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 20" />
      </svg>

      {/* Paper plane — positioned with CSS offset-path */}
      <div
        ref={planeRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          offsetPath: `path('${d}')`,
          offsetDistance: '0%',
          offsetRotate: 'auto',
          zIndex: 30,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          willChange: 'offset-distance',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
        }}
      >
        <PaperPlane />
      </div>
    </>
  )
}

function Polaroid({
  memory,
  layout,
  index,
  revealProgress,
  total,
}: {
  memory: typeof literati.memories[0]
  layout: typeof PHOTO_LAYOUT[0]
  index: number
  revealProgress: any
  total: number
}) {
  // Each photo reveals when scroll progress crosses its threshold
  const threshold = index / total
  const opacity  = useTransform(revealProgress, [threshold, threshold + 0.06], [0, 1])
  const y        = useTransform(revealProgress, [threshold, threshold + 0.06], [40, 0])
  const scale    = useTransform(revealProgress, [threshold, threshold + 0.06], [0.88, 1])

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        position: 'relative',
        zIndex: 5 + index,
        flexShrink: 0,
        width: layout.size,
        marginTop: layout.yOffset,
        cursor: 'default',
        rotate: layout.rotate,
      }}
      whileHover={{ scale: 1.05, rotate: layout.rotate * 0.3, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div style={{
        background: '#f0ead8',
        padding: '10px 10px 36px 10px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
        borderRadius: '16px',
      }}>
        <div style={{
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          position: 'relative',
          background: memory.placeholder,
          borderRadius: '8px',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${memory.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.12,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            fontFamily: '-apple-system, sans-serif', fontSize: '0.5rem',
            fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}>
            {memory.label}
          </div>
        </div>
        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '0.72rem', color: '#3a2e22',
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
      style={{ height: `${memories.length * 80}vh`, minHeight: '600px', contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

        <div className="relative z-20 px-8 md:px-16 mb-12 flex-shrink-0">
          <p className="eyebrow mb-3" style={{ color: 'var(--verdigris)' }}>Memory Lane</p>
          <div className="flex items-baseline gap-4">
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Moments from
            </h2>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 2.2rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}>
              LITERATI
            </h2>
          </div>
          <p style={{ color: 'var(--ink-dim)', fontSize: '0.8125rem', marginTop: '0.75rem', fontStyle: 'italic' }}>
            Every moment, a story.
          </p>
        </div>

        {/* Scrolling strip */}
        <motion.div style={{ x, display: 'flex', alignItems: 'center', gap: 48, paddingLeft: 80, paddingRight: 120, position: 'relative', zIndex: 10 }}>

          {/* Trail + animated plane */}
          <TrailAndPlane memories={memories} scrollYProgress={scrollYProgress} />

          {/* Photos — each reveals as plane passes */}
          {memories.map((memory, i) => (
            <Polaroid
              key={i}
              memory={memory}
              layout={PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]}
              index={i}
              revealProgress={scrollYProgress}
              total={memories.length}
            />
          ))}

          <div style={{ flexShrink: 0, paddingLeft: 40, maxWidth: 260 }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
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
