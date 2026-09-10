'use client'

import { useEffect, useRef } from 'react'

// Each orb: scroll-driven opacity + independent drift animation
const LAYERS = [
  { inStart: 0.0, inEnd: 0.12, outStart: 0.28, outEnd: 0.40, color: 'rgba(201,125,46,0.22)', x: '30%', y: '20%', size: '70vw', drift: 18, driftDur: 14 },
  { inStart: 0.08, inEnd: 0.20, outStart: 0.36, outEnd: 0.48, color: 'rgba(90,138,110,0.18)', x: '65%', y: '60%', size: '60vw', drift: 22, driftDur: 17 },
  { inStart: 0.22, inEnd: 0.34, outStart: 0.50, outEnd: 0.62, color: 'rgba(201,125,46,0.16)', x: '15%', y: '55%', size: '75vw', drift: 15, driftDur: 12 },
  { inStart: 0.38, inEnd: 0.50, outStart: 0.66, outEnd: 0.78, color: 'rgba(90,138,110,0.20)', x: '70%', y: '25%', size: '65vw', drift: 25, driftDur: 19 },
  { inStart: 0.55, inEnd: 0.67, outStart: 0.82, outEnd: 0.94, color: 'rgba(180,83,9,0.15)', x: '40%', y: '70%', size: '80vw', drift: 12, driftDur: 16 },
  { inStart: 0.70, inEnd: 0.82, outStart: 0.95, outEnd: 1.0, color: 'rgba(201,125,46,0.13)', x: '55%', y: '40%', size: '70vw', drift: 20, driftDur: 13 },
]

// Persistent ambient orbs that always drift — not scroll-gated
const AMBIENT_ORBS = [
  { color: 'rgba(201,125,46,0.07)', x: '20%', y: '15%', size: '50vw', drift: 30, driftDur: 22, delay: 0 },
  { color: 'rgba(90,138,110,0.06)', x: '75%', y: '70%', size: '45vw', drift: 25, driftDur: 28, delay: 6 },
  { color: 'rgba(160,90,30,0.05)', x: '50%', y: '45%', size: '60vw', drift: 20, driftDur: 18, delay: 3 },
]

const IMAGE_LAYERS = [
  { inStart: 0.04, peakStart: 0.14, peakEnd: 0.24, outEnd: 0.36, src: '/images/library-wide-1.jpg', x: '60%', y: '30%', size: '55vw' },
  { inStart: 0.28, peakStart: 0.38, peakEnd: 0.50, outEnd: 0.62, src: '/images/debate-session.jpg', x: '20%', y: '50%', size: '50vw' },
  { inStart: 0.52, peakStart: 0.62, peakEnd: 0.72, outEnd: 0.84, src: '/images/talkmasters.jpg', x: '65%', y: '55%', size: '55vw' },
  { inStart: 0.74, peakStart: 0.82, peakEnd: 0.90, outEnd: 1.0, src: '/images/campus-group.jpg', x: '35%', y: '35%', size: '60vw' },
]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

function remap(v: number, inA: number, inB: number, outA: number, outB: number) {
  if (inB === inA) return outA
  return outA + (outB - outA) * clamp01((v - inA) / (inB - inA))
}

export default function DiffusionBackground({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Persistent ambient drift orbs — always visible, Windows 11 acrylic feel */}
      {AMBIENT_ORBS.map((orb, i) => (
        <div
          key={`amb-${i}`}
          className="diffusion-orb-ambient"
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            transform: 'translate(-50%, -50%)',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(100px)',
            animationDuration: `${orb.driftDur}s`,
            animationDelay: `-${orb.delay}s`,
            '--drift-px': `${orb.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Scroll-driven colour blobs with drift */}
      {LAYERS.map((layer, i) => {
        const p = scrollProgress
        let opacity = 0
        if (p < layer.inEnd) {
          opacity = remap(p, layer.inStart, layer.inEnd, 0, 1)
        } else if (p < layer.outStart) {
          opacity = 1
        } else {
          opacity = remap(p, layer.outStart, layer.outEnd, 1, 0)
        }

        return (
          <div
            key={i}
            className="diffusion-orb-scroll"
            style={{
              position: 'absolute',
              left: layer.x,
              top: layer.y,
              transform: 'translate(-50%, -50%)',
              width: layer.size,
              height: layer.size,
              borderRadius: '50%',
              background: layer.color,
              filter: 'blur(120px)',
              opacity,
              transition: 'opacity 0.08s linear',
              willChange: 'opacity, transform',
              animationDuration: `${layer.driftDur}s`,
              animationDelay: `-${i * 2.3}s`,
              '--drift-px': `${layer.drift}px`,
            } as React.CSSProperties}
          />
        )
      })}

      {/* Image diffusion layers */}
      {IMAGE_LAYERS.map((layer, i) => {
        const p = scrollProgress
        let opacity = 0
        if (p < layer.inStart) {
          opacity = 0
        } else if (p < layer.peakStart) {
          opacity = remap(p, layer.inStart, layer.peakStart, 0, 0.18)
        } else if (p < layer.peakEnd) {
          opacity = 0.18
        } else {
          opacity = remap(p, layer.peakEnd, layer.outEnd, 0.18, 0)
        }

        return (
          <div
            key={`img-${i}`}
            style={{
              position: 'absolute',
              left: layer.x,
              top: layer.y,
              transform: 'translate(-50%, -50%)',
              width: layer.size,
              height: layer.size,
              borderRadius: '8px',
              overflow: 'hidden',
              opacity,
              transition: 'opacity 0.08s linear',
              willChange: 'opacity',
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: 'radial-gradient(ellipse at center, transparent 20%, #100e0a 80%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: '-10%',
              backgroundImage: `url(${layer.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(32px) saturate(0.7)',
              transform: 'scale(1.1)',
            }} />
          </div>
        )
      })}

      {/* Specular shimmer layer — a slow diagonal sweep */}
      <div className="specular-sweep" aria-hidden="true" />

      {/* Persistent vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(16,14,10,0.88) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
