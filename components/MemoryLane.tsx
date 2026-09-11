'use client'

import { useRef, useEffect, useId } from 'react'
import { motion, useInView } from 'framer-motion'
import { literati } from '@/data/literati'

// Layout per photo — alternating vertical positions and tilts
const PHOTO_LAYOUT = [
  { rotate: -5,  yOffset:  55, scale: 1.05, size: 240 },
  { rotate:  7,  yOffset: -45, scale: 0.93, size: 210 },
  { rotate: -3,  yOffset:  25, scale: 1.08, size: 255 },
  { rotate:  9,  yOffset: -65, scale: 0.90, size: 215 },
  { rotate: -7,  yOffset:  45, scale: 1.0,  size: 245 },
  { rotate:  4,  yOffset: -30, scale: 0.96, size: 230 },
  { rotate: -10, yOffset:  35, scale: 1.03, size: 250 },
  { rotate:  6,  yOffset: -25, scale: 0.92, size: 220 },
]

const GAP = 300

function buildPath(count: number) {
  const W = 120 + count * GAP + 160
  const H = 420
  const midY = H / 2

  const anchors = PHOTO_LAYOUT.slice(0, count).map((l, i) => ({
    x: 80 + i * GAP + GAP / 2,
    y: midY + l.yOffset * 0.55,
  }))

  let d = `M 0 ${midY}`
  anchors.forEach((pt, i) => {
    const prev = i === 0 ? { x: 0, y: midY } : anchors[i - 1]
    const dx = pt.x - prev.x
    d += ` C ${prev.x + dx * 0.38} ${prev.y - 50}, ${prev.x + dx * 0.62} ${pt.y + 50}, ${pt.x} ${pt.y}`
  })
  const last = anchors[anchors.length - 1]
  d += ` C ${last.x + 110} ${last.y - 35}, ${last.x + 180} ${midY + 15}, ${W} ${midY}`

  return { d, W, H }
}

function PaperPlane() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" style={{ overflow: 'visible' }}>
      <path d="M2 18 L34 10 L20 26 Z" fill="rgba(0,0,0,0.18)" transform="translate(2,3)" />
      <path d="M2 18 L34 10 L20 26 Z" fill="rgba(240,220,160,0.95)" stroke="rgba(180,130,40,0.7)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M20 26 L22 18 L34 10" fill="rgba(200,170,90,0.5)" stroke="rgba(160,110,30,0.5)" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M2 18 L34 10 L22 15 Z" fill="rgba(255,245,200,0.4)" />
    </svg>
  )
}

// Plane animates autonomously along the path on a ~6s loop
function TrailAndPlane({ pathData, W, H }: { pathData: string; W: number; H: number }) {
  const uid = useId().replace(/:/g, '')
  const pathId = `trail-${uid}`

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <path id={pathId} d={pathData} />
        </defs>
        {/* Shadow dots */}
        <path d={pathData} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 22" />
        {/* Cream dashes */}
        <path d={pathData} fill="none" stroke="rgba(240,218,160,0.75)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 22" />
      </svg>

      {/* Plane animates via CSS motion-path on a repeating animation */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          offsetPath: `path('${pathData}')`,
          offsetDistance: '0%',
          offsetRotate: 'auto',
          zIndex: 30,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
          animation: 'plane-fly 8s ease-in-out infinite',
        }}
      >
        <PaperPlane />
      </div>
    </>
  )
}

// Single polaroid — idle float+tilt animation, pops in on mount
function Polaroid({
  memory,
  layout,
  index,
  inView,
}: {
  memory: typeof literati.memories[0]
  layout: typeof PHOTO_LAYOUT[0]
  index: number
  inView: boolean
}) {
  // Each card's idle sway is offset by index so they don't all move in sync
  const swayDuration = 3.2 + (index % 4) * 0.55
  const swayDelay    = index * 0.18

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: layout.rotate * 2, scale: 0.85 }}
      animate={inView ? {
        opacity: 1,
        y: layout.yOffset,
        rotate: layout.rotate,
        scale: layout.scale,
      } : {}}
      transition={{
        delay: 0.1 + index * 0.09,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: layout.scale * 1.06,
        rotate: layout.rotate * 0.25,
        zIndex: 40,
        transition: { duration: 0.22 },
      }}
      style={{
        position: 'relative',
        zIndex: 5 + index,
        flexShrink: 0,
        width: layout.size,
        cursor: 'default',
        // CSS idle sway animation
        animation: inView
          ? `photo-sway-${index % 4} ${swayDuration}s ease-in-out ${swayDelay}s infinite alternate`
          : 'none',
      }}
    >
      <div style={{
        background: '#f0ead8',
        padding: '10px 10px 38px 10px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.28)',
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
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${memory.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.10,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          {/* Corner vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.42) 100%)' }} />
          {/* Label */}
          <div style={{
            position: 'absolute', bottom: 7, left: 8,
            fontFamily: '-apple-system, sans-serif', fontSize: '0.45rem',
            fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.58)',
          }}>
            {memory.label}
          </div>
        </div>

        {/* Caption */}
        <p style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '0.68rem', color: '#3a2e22',
          textAlign: 'center', paddingTop: '8px', lineHeight: 1.4,
        }}>
          {memory.title}
        </p>
      </div>
    </motion.div>
  )
}

export default function MemoryLane() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const memories = literati.memories
  const { d: pathData, W, H } = buildPath(memories.length)

  return (
    <section
      ref={ref}
      style={{ padding: '8vh 0 10vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Header */}
      <div style={{ paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', marginBottom: '3vh' }}>
        <p style={{
          fontFamily: '-apple-system, sans-serif', fontSize: '0.55rem',
          fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--verdigris)', marginBottom: '0.5rem',
        }}>
          Memory Lane
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700,
            fontSize: 'clamp(1.2rem, 3vw, 2rem)', lineHeight: 1,
            letterSpacing: '-0.02em', color: 'var(--ink)',
          }}>
            Moments from
          </h2>
          <h2 style={{
            fontFamily: 'Georgia, serif', fontWeight: 700,
            fontSize: 'clamp(1.2rem, 3vw, 2rem)', lineHeight: 1,
            letterSpacing: '-0.02em', color: 'var(--accent)',
          }}>
            LITERATI
          </h2>
        </div>
      </div>

      {/* Horizontal photo strip — scrollable on touch/mouse */}
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          paddingBottom: '2rem',
          cursor: 'grab',
          // hide scrollbar but keep scrollable
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        // @ts-ignore
        onMouseDown={(e) => {
          const el = e.currentTarget
          let startX = e.pageX - el.offsetLeft
          let scrollLeft = el.scrollLeft
          const onMove = (ev: MouseEvent) => {
            const x = ev.pageX - el.offsetLeft
            el.scrollLeft = scrollLeft - (x - startX)
          }
          const onUp = () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
            el.style.cursor = 'grab'
          }
          el.style.cursor = 'grabbing'
          document.addEventListener('mousemove', onMove)
          document.addEventListener('mouseup', onUp)
        }}
      >
        {/* Inner strip — wide enough for all photos */}
        <div
          style={{
            position: 'relative',
            width: W,
            height: H,
            flexShrink: 0,
          }}
        >
          {/* Trail + plane */}
          <TrailAndPlane pathData={pathData} W={W} H={H} />

          {/* Photos */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 60,
            paddingRight: 80,
            gap: GAP - 160,
            pointerEvents: 'none', // let the container handle drag
          }}>
            {memories.map((memory, i) => (
              <div key={i} style={{ pointerEvents: 'auto' }}>
                <Polaroid
                  memory={memory}
                  layout={PHOTO_LAYOUT[i % PHOTO_LAYOUT.length]}
                  index={i}
                  inView={inView}
                />
              </div>
            ))}
          </div>

          {/* Closing quote */}
          <div style={{
            position: 'absolute',
            right: 20, top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: 220,
            pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '0.88rem',
              fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.7,
            }}>
              "We don't just practise speaking.<br />We find the courage to mean it."
            </p>
            <p style={{
              fontFamily: '-apple-system, sans-serif', fontSize: '0.48rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--ink-dim)', marginTop: '1rem',
            }}>
              Club Literati · MLRIT
            </p>
          </div>
        </div>
      </div>

      {/* Swaying + plane keyframes */}
      <style>{`
        div[style*="scrollbar-width: none"]::-webkit-scrollbar { display: none; }

        @keyframes plane-fly {
          0%   { offset-distance: 0%; }
          100% { offset-distance: 98%; }
        }

        @keyframes photo-sway-0 {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(1.5deg); }
        }
        @keyframes photo-sway-1 {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(8px) rotate(-1.8deg); }
        }
        @keyframes photo-sway-2 {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-7px) rotate(1.2deg); }
        }
        @keyframes photo-sway-3 {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(9px) rotate(-1.4deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="animation: photo-sway"],
          [style*="animation: plane-fly"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
