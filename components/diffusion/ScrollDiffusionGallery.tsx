'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { DiffusionFilterDefs } from './OrganicMask'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiffusionScene = {
  image: string
  accent: string
  accentSecondary?: string
  x?: string
  y?: string
  inStart: number
  inEnd: number
  outStart: number
  outEnd: number
}

// ─── Math ─────────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
function remap(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp(b === a ? 0 : (v - a) / (b - a), 0, 1)
}

// ─── The organic mask ─────────────────────────────────────────────────────────
// This mask is the core of the effect.
// It must produce:
//   - A clear center zone
//   - Heavily diffused corners (the corners dissolve into background)
//   - Irregular, non-geometric edges (handled by the SVG displacement filter on top)
//
// Strategy: stack radial gradients.
// Layer 1: large center ellipse — the "visible zone"
// Layers 2–5: four corner ellipses crushing corners back to black
// The result is an organic amoeba shape before displacement is applied.
function buildOrganicMask(cx: string, cy: string): string {
  return [
    // Center window — clear in the middle, dissolves outward
    `radial-gradient(ellipse 75% 68% at ${cx} ${cy},
      rgba(0,0,0,1)   0%,
      rgba(0,0,0,1)   30%,
      rgba(0,0,0,0.88) 50%,
      rgba(0,0,0,0.55) 65%,
      rgba(0,0,0,0.18) 78%,
      transparent     90%
    )`,
    // Top-left corner crush
    `radial-gradient(ellipse 48% 42% at 8% 8%,
      transparent   0%,
      transparent   48%,
      rgba(0,0,0,0.45) 65%,
      rgba(0,0,0,0.88) 85%,
      rgba(0,0,0,1)    100%
    )`,
    // Top-right corner crush
    `radial-gradient(ellipse 48% 42% at 92% 8%,
      transparent   0%,
      transparent   48%,
      rgba(0,0,0,0.45) 65%,
      rgba(0,0,0,0.88) 85%,
      rgba(0,0,0,1)    100%
    )`,
    // Bottom-left corner crush
    `radial-gradient(ellipse 48% 42% at 8% 92%,
      transparent   0%,
      transparent   48%,
      rgba(0,0,0,0.45) 65%,
      rgba(0,0,0,0.88) 85%,
      rgba(0,0,0,1)    100%
    )`,
    // Bottom-right corner crush
    `radial-gradient(ellipse 48% 42% at 92% 92%,
      transparent   0%,
      transparent   48%,
      rgba(0,0,0,0.45) 65%,
      rgba(0,0,0,0.88) 85%,
      rgba(0,0,0,1)    100%
    )`,
  ].join(', ')
}

// ─── Single photo scene ───────────────────────────────────────────────────────
// All driven by direct DOM ref mutation via useMotionValueEvent — zero re-renders.

function PhotoScene({
  scene,
  progress,
  reducedMotion,
}: {
  scene: DiffusionScene
  progress: any
  reducedMotion: boolean
}) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const haze1Ref = useRef<HTMLDivElement>(null)
  const haze2Ref = useRef<HTMLDivElement>(null)

  const cx = scene.x ?? '50%'
  const cy = scene.y ?? '50%'
  const organicMask = buildOrganicMask(cx, cy)

  useMotionValueEvent(progress, 'change', (p: number) => {
    const { inStart, inEnd, outStart, outEnd } = scene

    // ── Phase: 0=before, 1=entering, 2=peak, 3=exiting, 4=after
    let phase: 0 | 1 | 2 | 3 | 4
    if (p < inStart) phase = 0
    else if (p < inEnd) phase = 1
    else if (p < outStart) phase = 2
    else if (p < outEnd) phase = 3
    else phase = 4

    // ── Wrapper opacity
    let wrapOp = 0
    if (phase === 1) wrapOp = remap(p, inStart, inEnd, 0, 1)
    else if (phase === 2) wrapOp = 1
    else if (phase === 3) wrapOp = remap(p, outStart, outEnd, 1, 0)
    if (wrapRef.current) wrapRef.current.style.opacity = String(+wrapOp.toFixed(4))

    // ── Image blur: photo develops sharp at peak, blurry at edges of visibility
    // Entry: very blurry → sharp. Exit: sharp → blurry.
    let blur = 0
    if (phase === 1) blur = remap(p, inStart, inEnd, 24, 0)
    else if (phase === 2) blur = 0
    else if (phase === 3) blur = remap(p, outStart, outEnd, 0, 20)
    else if (phase === 0 || phase === 4) blur = 24

    // ── Image scale: slight zoom-out as photo surfaces (darkroom developing feel)
    let scale = 1
    if (phase === 1) scale = remap(p, inStart, inEnd, 1.12, 1.0)
    else if (phase === 3) scale = remap(p, outStart, outEnd, 1.0, 1.08)

    if (imgRef.current) {
      imgRef.current.style.filter = `blur(${blur.toFixed(1)}px) brightness(0.92) saturate(0.7)`
      imgRef.current.style.transform = `scale(${scale.toFixed(4)})`
    }

    // ── Haze opacity: atmosphere arrives before and lingers after the image
    let hazeOp = 0
    // Haze starts slightly before image and fades slightly after
    const hazeIn  = inStart - (inEnd - inStart) * 0.3
    const hazeOut = outEnd + (outEnd - outStart) * 0.2
    if (p < hazeIn) hazeOp = 0
    else if (p < inEnd) hazeOp = remap(p, hazeIn, inEnd, 0, 1)
    else if (p < outStart) hazeOp = 1
    else if (p < hazeOut) hazeOp = remap(p, outStart, hazeOut, 1, 0)

    if (haze1Ref.current) haze1Ref.current.style.opacity = String(+hazeOp.toFixed(4))
    if (haze2Ref.current) haze2Ref.current.style.opacity = String(+(hazeOp * 0.6).toFixed(4))
  })

  const filterId = reducedMotion ? 'ink-develop-lite' : 'ink-develop'

  return (
    <>
      {/* Primary color atmosphere */}
      <div
        ref={haze1Ref}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: cx, top: cy,
          width: '85vw', height: '78vh',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse 80% 75% at 50% 50%, ${scene.accent} 0%, transparent 70%)`,
          filter: 'url(#ink-atmosphere)',
          opacity: 0,
          willChange: 'opacity',
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: '58% 42% 52% 48% / 46% 58% 42% 54%',
        }}
      />

      {/* Secondary atmosphere (if provided) */}
      {scene.accentSecondary && (
        <div
          ref={haze2Ref}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `calc(${cx} + 10%)`,
            top: `calc(${cy} - 12%)`,
            width: '58vw', height: '58vh',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse 72% 68% at 50% 50%, ${scene.accentSecondary} 0%, transparent 72%)`,
            filter: 'url(#ink-atmosphere)',
            opacity: 0,
            willChange: 'opacity',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Photo layer — organic mask + displacement gives irregular edges */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: cx, top: cy,
          width: '76vw', height: '72vh',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'opacity',
          zIndex: 3,
          pointerEvents: 'none',
          // Organic mask — corners dissolve, center is clearest
          WebkitMaskImage: organicMask,
          maskImage: organicMask,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
          // SVG displacement makes the mask boundary irregular — not a clean oval
          filter: `url(#${filterId})`,
        }}
      >
        <div
          ref={imgRef}
          style={{
            position: 'absolute',
            inset: '-15%',
            backgroundImage: `url(${scene.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform, filter',
            transformOrigin: 'center center',
          }}
        />
      </div>
    </>
  )
}

// ─── Permanent dark ambient hazes ─────────────────────────────────────────────
// Always drifting slowly — gives the dark background a living quality
// even between photo scenes.
function AmbientLayer() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '32%', top: '42%',
          width: '55vw', height: '50vh',
          transform: 'translate3d(-50%, -50%, 0)',
          borderRadius: '52% 48% 44% 56% / 50% 54% 46% 50%',
          background: 'rgba(38, 6, 80, 0.18)',
          filter: 'url(#ink-atmosphere)',
          animation: 'ambient-drift-a 32s ease-in-out infinite alternate',
          willChange: 'transform',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '70%', top: '60%',
          width: '42vw', height: '44vh',
          transform: 'translate3d(-50%, -50%, 0)',
          borderRadius: '44% 56% 52% 48% / 46% 42% 58% 54%',
          background: 'rgba(80, 8, 100, 0.14)',
          filter: 'url(#ink-atmosphere)',
          animation: 'ambient-drift-b 40s ease-in-out infinite alternate',
          willChange: 'transform',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ─── Film grain overlay ───────────────────────────────────────────────────────
function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 8,
        pointerEvents: 'none', opacity: 0.038,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  )
}

// ─── Edge vignette ────────────────────────────────────────────────────────────
function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 9,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 88% 75% at 50% 50%,
          transparent 35%,
          rgba(3,2,8,0.28) 60%,
          rgba(3,2,8,0.70) 100%
        )`,
      }}
    />
  )
}

// ─── Main gallery ─────────────────────────────────────────────────────────────
export default function ScrollDiffusionGallery({
  scenes,
  useWindowScroll = false,
  containerRef,
  reducedMotion = false,
}: {
  scenes: DiffusionScene[]
  useWindowScroll?: boolean
  containerRef?: React.RefObject<HTMLElement>
  reducedMotion?: boolean
}) {
  const scrollOptions = useWindowScroll || !containerRef
    ? undefined
    : { target: containerRef, offset: [['start', 'start'], ['end', 'end']] as any }

  const { scrollYProgress } = useScroll(scrollOptions)

  // Spring: responsive but not instant — scroll must feel deliberate
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0003,
  })

  return (
    <>
      <DiffusionFilterDefs />

      {/* Absolute dark base */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: '#04020a', pointerEvents: 'none',
        }}
      />

      <AmbientLayer />

      {scenes.map((scene, i) => (
        <PhotoScene
          key={i}
          scene={scene}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}

      <Grain />
      <Vignette />

      <style>{`
        @keyframes ambient-drift-a {
          0%   { transform: translate3d(-50%,-50%,0) scale(1) rotate(0deg); }
          35%  { transform: translate3d(calc(-50% + 28px), calc(-50% - 18px), 0) scale(1.06) rotate(2deg); }
          70%  { transform: translate3d(calc(-50% - 16px), calc(-50% + 24px), 0) scale(0.96) rotate(-1.5deg); }
          100% { transform: translate3d(calc(-50% + 10px), calc(-50% + 12px), 0) scale(1.03) rotate(1deg); }
        }
        @keyframes ambient-drift-b {
          0%   { transform: translate3d(-50%,-50%,0) scale(1) rotate(0deg); }
          40%  { transform: translate3d(calc(-50% - 22px), calc(-50% + 20px), 0) scale(1.05) rotate(-2deg); }
          72%  { transform: translate3d(calc(-50% + 18px), calc(-50% - 14px), 0) scale(0.97) rotate(1.5deg); }
          100% { transform: translate3d(calc(-50% - 8px),  calc(-50% + 10px), 0) scale(1.02) rotate(-1deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ambient-drift"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}
