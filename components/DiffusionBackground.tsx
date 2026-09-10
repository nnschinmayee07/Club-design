'use client'

import { useEffect, useRef } from 'react'

const LAYERS = [
  { inStart: 0.0,  inEnd: 0.12, outStart: 0.28, outEnd: 0.40, color: 'rgba(201,125,46,0.22)',  x: '30%', y: '20%', size: '70vw', drift: 18, driftDur: 14 },
  { inStart: 0.08, inEnd: 0.20, outStart: 0.36, outEnd: 0.48, color: 'rgba(90,138,110,0.18)',  x: '65%', y: '60%', size: '60vw', drift: 22, driftDur: 17 },
  { inStart: 0.22, inEnd: 0.34, outStart: 0.50, outEnd: 0.62, color: 'rgba(201,125,46,0.16)',  x: '15%', y: '55%', size: '75vw', drift: 15, driftDur: 12 },
  { inStart: 0.38, inEnd: 0.50, outStart: 0.66, outEnd: 0.78, color: 'rgba(90,138,110,0.20)',  x: '70%', y: '25%', size: '65vw', drift: 25, driftDur: 19 },
  { inStart: 0.55, inEnd: 0.67, outStart: 0.82, outEnd: 0.94, color: 'rgba(180,83,9,0.15)',    x: '40%', y: '70%', size: '80vw', drift: 12, driftDur: 16 },
  { inStart: 0.70, inEnd: 0.82, outStart: 0.95, outEnd: 1.0,  color: 'rgba(201,125,46,0.13)',  x: '55%', y: '40%', size: '70vw', drift: 20, driftDur: 13 },
]

const AMBIENT_ORBS = [
  { color: 'rgba(201,125,46,0.07)', x: '20%', y: '15%', size: '50vw', drift: 30, driftDur: 22, delay: 0 },
  { color: 'rgba(90,138,110,0.06)', x: '75%', y: '70%', size: '45vw', drift: 25, driftDur: 28, delay: 6 },
  { color: 'rgba(160,90,30,0.05)',  x: '50%', y: '45%', size: '60vw', drift: 20, driftDur: 18, delay: 3 },
]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }
function remap(v: number, inA: number, inB: number, outA: number, outB: number) {
  if (inB === inA) return outA
  return outA + (outB - outA) * clamp01((v - inA) / (inB - inA))
}

export default function DiffusionBackground({
  diffusionStart,
  diffusionEnd,
}: {
  diffusionStart: number
  diffusionEnd: number
}) {
  // Refs to each scroll-driven orb DOM node — updated directly, zero React re-renders
  const orbRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef  = useRef<number | null>(null)
  const prevRef = useRef<number>(-1)

  useEffect(() => {
    const update = () => {
      const scrollTop  = window.scrollY
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const startPx = diffusionStart * docHeight
      const endPx   = diffusionEnd   * docHeight
      const range   = endPx - startPx
      if (range <= 0) return

      const p = clamp01((scrollTop - startPx) / range)
      // Skip if change is negligible
      if (Math.abs(p - prevRef.current) < 0.002) return
      prevRef.current = p

      LAYERS.forEach((layer, i) => {
        const el = orbRefs.current[i]
        if (!el) return
        let opacity = 0
        if (p < layer.inEnd) {
          opacity = remap(p, layer.inStart, layer.inEnd, 0, 1)
        } else if (p < layer.outStart) {
          opacity = 1
        } else {
          opacity = remap(p, layer.outStart, layer.outEnd, 1, 0)
        }
        el.style.opacity = String(opacity)
      })
    }

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        update()
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [diffusionStart, diffusionEnd])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Ambient drift orbs — CSS animation only, no JS */}
      {AMBIENT_ORBS.map((orb, i) => (
        <div
          key={`amb-${i}`}
          className="diffusion-orb-ambient"
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(90px)',
            willChange: 'transform',
            transform: 'translate3d(-50%, -50%, 0)',
            animationDuration: `${orb.driftDur}s`,
            animationDelay: `-${orb.delay}s`,
            '--drift-px': `${orb.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Scroll-driven orbs — opacity set via direct DOM mutation */}
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          ref={el => { orbRefs.current[i] = el }}
          className="diffusion-orb-scroll"
          style={{
            position: 'absolute',
            left: layer.x,
            top: layer.y,
            width: layer.size,
            height: layer.size,
            borderRadius: '50%',
            background: layer.color,
            filter: 'blur(110px)',
            opacity: 0,
            willChange: 'opacity, transform',
            transform: 'translate3d(-50%, -50%, 0)',
            animationDuration: `${layer.driftDur}s`,
            animationDelay: `-${i * 2.3}s`,
            '--drift-px': `${layer.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Specular diagonal sweep */}
      <div className="specular-sweep" />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(16,14,10,0.88) 100%)',
      }} />
    </div>
  )
}
