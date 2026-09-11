'use client'

import { useRef, useEffect } from 'react'
import {
  useScroll, useTransform, useSpring, useMotionValueEvent,
  motion, MotionValue,
} from 'framer-motion'
import { DiffusionFilterDefs } from './OrganicMask'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DiffusionScene = {
  image: string
  accent: string          // e.g. 'rgba(100,20,180,0.7)'
  accentSecondary?: string
  position?: string       // CSS background-position, default 'center'
  // optional layout offset from center, as percent strings e.g. '55%' '45%'
  x?: string
  y?: string
  // scroll progress window for this scene [0..1] relative to the gallery container
  inStart: number
  inEnd: number
  outStart: number
  outEnd: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function remap(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp(b === a ? 0 : (v - a) / (b - a), 0, 1)
}

// ─── Single photo scene — all driven from one scroll progress value ───────────

function PhotoScene({
  scene,
  progress,
}: {
  scene: DiffusionScene
  progress: MotionValue<number>
}) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const hazeRef  = useRef<HTMLDivElement>(null)
  const haze2Ref = useRef<HTMLDivElement>(null)

  useMotionValueEvent(progress, 'change', (p: number) => {
    const { inStart, inEnd, outStart, outEnd } = scene

    // ── Wrapper opacity ──────────────────────────────────────────────────────
    let opacity = 0
    if (p < inEnd)         opacity = remap(p, inStart, inEnd, 0, 1)
    else if (p < outStart) opacity = 1
    else                   opacity = remap(p, outStart, outEnd, 1, 0)

    if (wrapRef.current) wrapRef.current.style.opacity = String(Math.round(opacity * 1000) / 1000)

    // ── Image blur — enters blurry, peaks sharp, exits blurry ───────────────
    let blur = 0
    if (p < inEnd) {
      blur = remap(p, inStart, inEnd, 22, 0)
    } else if (p < outStart) {
      blur = 0
    } else {
      blur = remap(p, outStart, outEnd, 0, 20)
    }
    // Image scale — slight zoom-out as it surfaces
    let scale = 1
    if (p < inEnd)         scale = remap(p, inStart, inEnd, 1.10, 1.01)
    else if (p < outStart) scale = 1.01
    else                   scale = remap(p, outStart, outEnd, 1.01, 1.07)

    if (imgRef.current) {
      imgRef.current.style.filter = `blur(${blur.toFixed(1)}px) saturate(0.75) brightness(0.95)`
      imgRef.current.style.transform = `scale(${scale.toFixed(4)})`
    }

    // ── Haze opacity — ambient color cloud peaks just before/after image ────
    let hazeOp = 0
    if (p < inStart)       hazeOp = 0
    else if (p < inEnd)    hazeOp = remap(p, inStart, inEnd, 0, 1)
    else if (p < outStart) hazeOp = 1
    else                   hazeOp = remap(p, outStart, outEnd, 1, 0)

    if (hazeRef.current)  hazeRef.current.style.opacity  = String(Math.round(hazeOp  * 1000) / 1000)
    if (haze2Ref.current) haze2Ref.current.style.opacity = String(Math.round(hazeOp * 0.55 * 1000) / 1000)
  })

  const cx = scene.x ?? '50%'
  const cy = scene.y ?? '50%'

  // The organic mask — multi-radial gradient that dissolves the corners more strongly
  // The percentages create an irregular "ink dissolve" shape: corners pull in faster
  const organicMask = `
    radial-gradient(ellipse 82% 76% at ${cx} ${cy},
      black 0%,
      black 45%,
      rgba(0,0,0,0.80) 60%,
      rgba(0,0,0,0.35) 74%,
      rgba(0,0,0,0.08) 84%,
      transparent 92%
    ),
    radial-gradient(ellipse 52% 46% at 18% 18%,
      transparent 0%,
      transparent 55%,
      rgba(0,0,0,0.3) 72%,
      black 100%
    ),
    radial-gradient(ellipse 52% 46% at 82% 18%,
      transparent 0%,
      transparent 55%,
      rgba(0,0,0,0.3) 72%,
      black 100%
    ),
    radial-gradient(ellipse 52% 46% at 18% 82%,
      transparent 0%,
      transparent 55%,
      rgba(0,0,0,0.3) 72%,
      black 100%
    ),
    radial-gradient(ellipse 52% 46% at 82% 82%,
      transparent 0%,
      transparent 55%,
      rgba(0,0,0,0.3) 72%,
      black 100%
    )
  `

  return (
    <>
      {/* ── Color haze — atmospheric diffusion around the photo ── */}
      <div
        ref={hazeRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: cx,
          top: cy,
          width: '80vw',
          height: '75vh',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse 85% 80% at 50% 50%, ${scene.accent} 0%, transparent 70%)`,
          filter: 'url(#ink-haze)',
          opacity: 0,
          willChange: 'opacity',
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
        }}
      />

      {/* ── Secondary haze — offset, different color ── */}
      {scene.accentSecondary && (
        <div
          ref={haze2Ref}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `calc(${cx} + 8%)`,
            top: `calc(${cy} - 10%)`,
            width: '55vw',
            height: '55vh',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse 70% 65% at 50% 50%, ${scene.accentSecondary} 0%, transparent 70%)`,
            filter: 'url(#ink-haze)',
            opacity: 0,
            willChange: 'opacity',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Photo layer — masked to organic shape ── */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: cx,
          top: cy,
          width: '72vw',
          height: '68vh',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          willChange: 'opacity',
          zIndex: 3,
          pointerEvents: 'none',
          // Organic mask applied here — dissolves corners into background
          WebkitMaskImage: organicMask,
          maskImage: organicMask,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
          // SVG displacement distorts the mask boundary further → irregular edge
          filter: 'url(#ink-displace)',
        }}
      >
        <div
          ref={imgRef}
          style={{
            position: 'absolute',
            inset: '-12%',
            backgroundImage: `url(${scene.image})`,
            backgroundSize: 'cover',
            backgroundPosition: scene.position ?? 'center',
            willChange: 'transform, filter',
            transformOrigin: 'center center',
          }}
        />
      </div>
    </>
  )
}

// ─── Grain overlay ────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8,
        pointerEvents: 'none',
        opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  )
}

// ─── Vignette ─────────────────────────────────────────────────────────────────

function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 85% 70% at 50% 50%,
            transparent 40%,
            rgba(3,2,8,0.35) 68%,
            rgba(3,2,8,0.78) 100%
          )
        `,
      }}
    />
  )
}

// ─── Ambient drift — always-on subtle haze ────────────────────────────────────

function AmbientHaze() {
  return (
    <>
      <div
        aria-hidden="true"
        className="diffusion-ambient-a"
        style={{
          position: 'fixed',
          left: '35%', top: '40%',
          width: '60vw', height: '55vh',
          transform: 'translate3d(-50%, -50%, 0)',
          borderRadius: '55% 45% 48% 52% / 50% 55% 45% 50%',
          background: 'rgba(45,8,95,0.20)',
          filter: 'url(#ink-haze)',
          willChange: 'transform',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="diffusion-ambient-b"
        style={{
          position: 'fixed',
          left: '68%', top: '58%',
          width: '45vw', height: '45vh',
          transform: 'translate3d(-50%, -50%, 0)',
          borderRadius: '42% 58% 52% 48% / 48% 42% 58% 52%',
          background: 'rgba(90,10,110,0.15)',
          filter: 'url(#ink-haze)',
          willChange: 'transform',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ─── Main gallery component ───────────────────────────────────────────────────

export default function ScrollDiffusionGallery({
  scenes,
  containerRef,
  useWindowScroll = false,
}: {
  scenes: DiffusionScene[]
  containerRef?: React.RefObject<HTMLElement>
  useWindowScroll?: boolean
}) {
  const { scrollYProgress } = useScroll(
    useWindowScroll || !containerRef
      ? undefined
      : { target: containerRef, offset: ['start start', 'end end'] }
  )

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.0002,
  })

  return (
    <>
      <DiffusionFilterDefs />

      {/* Dark base */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#04020a',
          pointerEvents: 'none',
        }}
      />

      <AmbientHaze />

      {/* One scene at a time — each manages its own DOM refs */}
      {scenes.map((scene, i) => (
        <PhotoScene key={i} scene={scene} progress={smoothProgress} />
      ))}

      <Grain />
      <Vignette />

      <style>{`
        @keyframes diffusion-drift-a {
          0%   { transform: translate3d(-50%,-50%,0) scale(1) rotate(0deg); }
          40%  { transform: translate3d(calc(-50% + 24px), calc(-50% - 16px), 0) scale(1.05) rotate(2deg); }
          70%  { transform: translate3d(calc(-50% - 14px), calc(-50% + 22px), 0) scale(0.97) rotate(-1deg); }
          100% { transform: translate3d(calc(-50% + 8px),  calc(-50% + 10px), 0) scale(1.02) rotate(1deg); }
        }
        @keyframes diffusion-drift-b {
          0%   { transform: translate3d(-50%,-50%,0) scale(1) rotate(0deg); }
          35%  { transform: translate3d(calc(-50% - 20px), calc(-50% + 18px), 0) scale(1.04) rotate(-2deg); }
          65%  { transform: translate3d(calc(-50% + 16px), calc(-50% - 12px), 0) scale(0.98) rotate(1deg); }
          100% { transform: translate3d(calc(-50% - 6px),  calc(-50% + 8px),  0) scale(1.01) rotate(-1deg); }
        }
        .diffusion-ambient-a {
          animation: diffusion-drift-a 28s ease-in-out infinite alternate;
        }
        .diffusion-ambient-b {
          animation: diffusion-drift-b 36s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .diffusion-ambient-a,
          .diffusion-ambient-b { animation: none !important; }
        }
      `}</style>
    </>
  )
}
