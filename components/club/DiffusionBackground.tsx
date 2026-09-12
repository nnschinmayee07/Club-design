'use client'

import { useRef, useEffect } from 'react'
import { useScroll, useTransform, useSpring, motion, useMotionValueEvent } from 'framer-motion'
import GrainOverlay from './GrainOverlay'
import VignetteOverlay from './VignetteOverlay'
import { BackgroundImageSceneDirect, type ImageScene } from './BackgroundImageScene'

// ─── Scene definitions ────────────────────────────────────────────────────────
// Each scene corresponds to a page section, defined as scroll-progress ranges [0..1]

const SCENES: ImageScene[] = [
  {
    src: '/images/library-wide-1.svg',
    accent: 'rgba(80,20,140,0.55)',
    position: 'center 30%',
    inStart: 0.08, inEnd: 0.22, outStart: 0.32, outEnd: 0.44,
  },
  {
    src: '/images/debate-session.svg',
    accent: 'rgba(160,30,120,0.5)',
    position: 'center 40%',
    inStart: 0.36, inEnd: 0.50, outStart: 0.60, outEnd: 0.72,
  },
  {
    src: '/images/talkmasters.svg',
    accent: 'rgba(40,60,180,0.5)',
    position: 'center 35%',
    inStart: 0.62, inEnd: 0.74, outStart: 0.82, outEnd: 0.92,
  },
  {
    src: '/images/campus-group.svg',
    accent: 'rgba(120,20,160,0.5)',
    position: 'center 45%',
    inStart: 0.84, inEnd: 0.92, outStart: 0.96, outEnd: 1.0,
  },
]

// ─── Atmospheric color fields ─────────────────────────────────────────────────
// Each field has a scroll range where it peaks, a color, and drift params

const COLOR_FIELDS = [
  // Hero — deep violet
  { color: 'rgba(55,10,120,0.55)',   x: '42%', y: '38%', size: '80vw',  inS: 0.0,  inE: 0.08, outS: 0.22, outE: 0.34, driftDur: 26, driftAmp: 22 },
  // Hero — indigo edge
  { color: 'rgba(20,15,90,0.45)',    x: '70%', y: '65%', size: '60vw',  inS: 0.0,  inE: 0.06, outS: 0.18, outE: 0.30, driftDur: 31, driftAmp: 18 },
  // What is — magenta bloom
  { color: 'rgba(140,20,110,0.50)',  x: '35%', y: '55%', size: '75vw',  inS: 0.10, inE: 0.22, outS: 0.38, outE: 0.50, driftDur: 22, driftAmp: 28 },
  // What is — purple secondary
  { color: 'rgba(80,10,160,0.45)',   x: '68%', y: '30%', size: '65vw',  inS: 0.14, inE: 0.26, outS: 0.40, outE: 0.52, driftDur: 28, driftAmp: 20 },
  // Events — electric violet
  { color: 'rgba(100,0,200,0.40)',   x: '25%', y: '45%', size: '70vw',  inS: 0.32, inE: 0.46, outS: 0.60, outE: 0.72, driftDur: 19, driftAmp: 32 },
  // Events — warm amber accent (tiny, hot)
  { color: 'rgba(180,80,10,0.30)',   x: '60%', y: '55%', size: '38vw',  inS: 0.38, inE: 0.50, outS: 0.62, outE: 0.74, driftDur: 16, driftAmp: 14 },
  // Memories — deep pink
  { color: 'rgba(180,20,140,0.48)', x: '48%', y: '50%', size: '85vw',  inS: 0.58, inE: 0.70, outS: 0.84, outE: 0.95, driftDur: 24, driftAmp: 26 },
  // Memories — cyan shadow
  { color: 'rgba(10,60,120,0.35)',   x: '20%', y: '70%', size: '55vw',  inS: 0.66, inE: 0.78, outS: 0.90, outE: 1.0,  driftDur: 20, driftAmp: 18 },
  // Closing — violet swell
  { color: 'rgba(70,5,140,0.55)',    x: '55%', y: '40%', size: '72vw',  inS: 0.80, inE: 0.90, outS: 0.97, outE: 1.0,  driftDur: 28, driftAmp: 22 },
]

// Persistent ambient fields — always gently drifting, never fully off
const AMBIENT = [
  { color: 'rgba(40,8,90,0.22)',  x: '30%', y: '25%', size: '55vw', driftDur: 38, driftAmp: 16 },
  { color: 'rgba(90,10,100,0.18)', x: '72%', y: '68%', size: '48vw', driftDur: 44, driftAmp: 12 },
  { color: 'rgba(15,10,70,0.20)', x: '50%', y: '80%', size: '62vw', driftDur: 33, driftAmp: 20 },
]

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)) }
function remap(v: number, inA: number, inB: number, outA: number, outB: number) {
  if (inB === inA) return outA
  return outA + (outB - outA) * clamp((v - inA) / (inB - inA), 0, 1)
}

// ─── SVG turbulence filter for organic edges ──────────────────────────────────
function TurbulenceFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
      <defs>
        <filter id="ink-diffuse" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008 0.012"
            numOctaves="3"
            seed="4"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="110"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="28" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="over" />
        </filter>

        {/* Lighter version for mobile */}
        <filter id="ink-diffuse-lite" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.010 0.014" numOctaves="2" seed="4" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="70" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="18" />
        </filter>
      </defs>
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DiffusionBackground() {
  const pageRef  = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef   = useRef<number | null>(null)
  const prevProg = useRef(-1)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 38, damping: 22, restDelta: 0.0005 })

  // Direct DOM update for scroll-driven fields — zero React re-renders
  useMotionValueEvent(smoothProgress, 'change', (p) => {
    if (Math.abs(p - prevProg.current) < 0.001) return
    prevProg.current = p

    COLOR_FIELDS.forEach((f, i) => {
      const el = fieldRefs.current[i]
      if (!el) return
      let opacity = 0
      if (p < f.inE) {
        opacity = remap(p, f.inS, f.inE, 0, 1)
      } else if (p < f.outS) {
        opacity = 1
      } else {
        opacity = remap(p, f.outS, f.outE, 1, 0)
      }
      el.style.opacity = String(Math.round(opacity * 1000) / 1000)
    })
  })

  return (
    <>
      <TurbulenceFilter />

      {/* Fixed atmospheric canvas */}
      <div
        ref={pageRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#05030a',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* ── Ambient always-on fields ── */}
        {AMBIENT.map((a, i) => (
          <div
            key={`amb-${i}`}
            style={{
              position: 'absolute',
              left: a.x,
              top: a.y,
              width: a.size,
              height: a.size,
              transform: 'translate3d(-50%, -50%, 0)',
              borderRadius: '50%',
              background: a.color,
              filter: 'url(#ink-diffuse)',
              willChange: 'transform',
              animation: `atm-drift-${i} ${a.driftDur}s ease-in-out infinite alternate`,
            }}
          />
        ))}

        {/* ── Scroll-reactive color fields ── */}
        {COLOR_FIELDS.map((f, i) => (
          <div
            key={`field-${i}`}
            ref={el => { fieldRefs.current[i] = el }}
            style={{
              position: 'absolute',
              left: f.x,
              top: f.y,
              width: f.size,
              height: f.size,
              transform: 'translate3d(-50%, -50%, 0)',
              borderRadius: '42% 58% 55% 45% / 48% 40% 60% 52%',
              background: f.color,
              filter: 'url(#ink-diffuse)',
              opacity: 0,
              willChange: 'opacity',
              animation: `field-drift-${i} ${f.driftDur}s ease-in-out infinite alternate`,
            }}
          />
        ))}

        {/* ── Image scenes — photos dissolved into atmosphere ── */}
        {SCENES.map((scene, i) => (
          <BackgroundImageSceneDirect
            key={`scene-${i}`}
            scene={scene}
            scrollProgress={smoothProgress}
          />
        ))}
      </div>

      {/* Grain + vignette sit above diffusion, below content */}
      <GrainOverlay />
      <VignetteOverlay />

      {/* Drift keyframes injected inline — avoids globals.css coupling */}
      <style>{`
        ${AMBIENT.map((a, i) => `
          @keyframes atm-drift-${i} {
            0%   { transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg); }
            33%  { transform: translate3d(calc(-50% + ${a.driftAmp}px), calc(-50% - ${Math.round(a.driftAmp * 0.6)}px), 0) scale(1.04) rotate(${i % 2 === 0 ? 2 : -2}deg); }
            66%  { transform: translate3d(calc(-50% - ${Math.round(a.driftAmp * 0.7)}px), calc(-50% + ${Math.round(a.driftAmp * 0.8)}px), 0) scale(0.97) rotate(${i % 2 === 0 ? -1 : 1}deg); }
            100% { transform: translate3d(calc(-50% + ${Math.round(a.driftAmp * 0.3)}px), calc(-50% + ${Math.round(a.driftAmp * 0.4)}px), 0) scale(1.02) rotate(0deg); }
          }
        `).join('')}

        ${COLOR_FIELDS.map((f, i) => `
          @keyframes field-drift-${i} {
            0%   { transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg); border-radius: 42% 58% 55% 45% / 48% 40% 60% 52%; }
            50%  { transform: translate3d(calc(-50% + ${f.driftAmp}px), calc(-50% - ${Math.round(f.driftAmp * 0.5)}px), 0) scale(1.06) rotate(${i % 2 === 0 ? 3 : -3}deg); border-radius: 55% 45% 42% 58% / 52% 60% 40% 48%; }
            100% { transform: translate3d(calc(-50% - ${Math.round(f.driftAmp * 0.4)}px), calc(-50% + ${Math.round(f.driftAmp * 0.7)}px), 0) scale(0.96) rotate(${i % 2 === 0 ? -2 : 2}deg); border-radius: 48% 52% 58% 42% / 45% 55% 45% 55%; }
          }
        `).join('')}

        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}
