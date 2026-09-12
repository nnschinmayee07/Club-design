'use client'

import { useRef } from 'react'
import ScrollDiffusionGallery, { type DiffusionScene } from '@/components/diffusion/ScrollDiffusionGallery'

// ── Prototype scenes — tune these to get the visual right ─────────────────────
// inStart/inEnd/outStart/outEnd are fractions of the total page scroll [0..1]
// Each scene takes roughly 25% of the scroll range, with 5% crossfade overlap

const SCENES: DiffusionScene[] = [
  {
    image: '/images/library-wide-1.svg',
    accent: 'rgba(75,12,160,0.65)',
    accentSecondary: 'rgba(140,20,120,0.45)',
    x: '48%', y: '52%',
    inStart: 0.04, inEnd: 0.18,
    outStart: 0.28, outEnd: 0.40,
  },
  {
    image: '/images/debate-session.svg',
    accent: 'rgba(140,15,130,0.60)',
    accentSecondary: 'rgba(60,10,200,0.40)',
    x: '54%', y: '48%',
    inStart: 0.34, inEnd: 0.48,
    outStart: 0.58, outEnd: 0.70,
  },
  {
    image: '/images/talkmasters.svg',
    accent: 'rgba(35,50,180,0.58)',
    accentSecondary: 'rgba(120,15,160,0.42)',
    x: '44%', y: '54%',
    inStart: 0.63, inEnd: 0.76,
    outStart: 0.84, outEnd: 0.93,
  },
  {
    image: '/images/campus-group.svg',
    accent: 'rgba(110,10,155,0.62)',
    accentSecondary: 'rgba(180,20,100,0.38)',
    x: '52%', y: '50%',
    inStart: 0.88, inEnd: 0.95,
    outStart: 0.98, outEnd: 1.0,
  },
]

// ── Labels for prototype orientation ──────────────────────────────────────────
const LABELS = [
  { progress: 0,    label: 'DARK — beginning' },
  { progress: 0.11, label: 'Scene 1 forming…' },
  { progress: 0.24, label: 'Scene 1 peak' },
  { progress: 0.37, label: 'Scene 1 dissolving…' },
  { progress: 0.44, label: 'Between scenes' },
  { progress: 0.50, label: 'Scene 2 forming…' },
  { progress: 0.63, label: 'Scene 2 peak' },
  { progress: 0.72, label: 'Scene 2 dissolving…' },
  { progress: 0.78, label: 'Scene 3 forming…' },
  { progress: 0.88, label: 'Scene 3 peak / Scene 4 forming' },
  { progress: 0.96, label: 'Scene 4 peak' },
  { progress: 1.0,  label: 'DARK — end' },
]

export default function DiffusionProtoPage() {
  const pageRef = useRef<HTMLElement>(null!)

  return (
    <main
      ref={pageRef}
      style={{
        position: 'relative',
        // 500vh gives plenty of scroll room to experience each scene fully
        height: '500vh',
        background: 'transparent',
      }}
    >
      {/* Diffusion background — fixed, fills viewport */}
      <ScrollDiffusionGallery scenes={SCENES} containerRef={pageRef as any} />

      {/* Sticky label — shows where you are in the prototype */}
      <div
        style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          pointerEvents: 'none',
          paddingTop: '40vh',
        }}
      >
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(240,220,170,0.5)',
        }}>
          Diffusion Prototype — scroll slowly
        </p>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: 'rgba(240,230,200,0.7)',
          textAlign: 'center',
          maxWidth: 400,
          lineHeight: 1.7,
        }}>
          Memories emerging<br />from darkness.
        </p>
      </div>

      {/* Scene marker labels positioned along scroll height */}
      {LABELS.map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${l.progress * 100}%`,
            left: '2rem',
            zIndex: 20,
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(200,180,140,0.4)',
            pointerEvents: 'none',
          }}
        >
          {l.label}
        </div>
      ))}
    </main>
  )
}
