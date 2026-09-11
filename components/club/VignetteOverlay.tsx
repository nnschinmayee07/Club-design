'use client'

export default function VignetteOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 7,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 50%,
            transparent 30%,
            rgba(4,3,8,0.55) 70%,
            rgba(4,3,8,0.88) 100%
          )
        `,
      }}
    />
  )
}
