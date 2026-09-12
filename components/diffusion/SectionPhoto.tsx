'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion'

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}
function remap(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp(b === a ? 0 : (v - a) / (b - a), 0, 1)
}

function buildMask(cx: string, cy: string) {
  return [
    `radial-gradient(ellipse 72% 65% at ${cx} ${cy},
      rgba(0,0,0,1) 0%, rgba(0,0,0,1) 28%,
      rgba(0,0,0,0.85) 48%, rgba(0,0,0,0.50) 63%,
      rgba(0,0,0,0.15) 76%, transparent 88%)`,
    `radial-gradient(ellipse 46% 40% at 6% 6%,
      transparent 0%, transparent 45%,
      rgba(0,0,0,0.50) 65%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,1) 100%)`,
    `radial-gradient(ellipse 46% 40% at 94% 6%,
      transparent 0%, transparent 45%,
      rgba(0,0,0,0.50) 65%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,1) 100%)`,
    `radial-gradient(ellipse 46% 40% at 6% 94%,
      transparent 0%, transparent 45%,
      rgba(0,0,0,0.50) 65%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,1) 100%)`,
    `radial-gradient(ellipse 46% 40% at 94% 94%,
      transparent 0%, transparent 45%,
      rgba(0,0,0,0.50) 65%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,1) 100%)`,
  ].join(', ')
}

type Props = {
  sectionId: string
  image: string
  accent: string
  accentSecondary?: string
  x?: string
  y?: string
  zIndex?: number
}

// Inner component that receives the resolved element ref and drives the animation
function PhotoDriver({
  target,
  image, accent, accentSecondary,
  x = '50%', y = '50%',
  zIndex = 2,
}: Omit<Props, 'sectionId'> & { target: HTMLElement }) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const imgRef   = useRef<HTMLDivElement>(null)
  const haze1Ref = useRef<HTMLDivElement>(null)
  const haze2Ref = useRef<HTMLDivElement>(null)

  const targetRef = useRef(target)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })

  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 22, restDelta: 0.0003 })

  // enter = first 20% of scroll window, exit = last 20%
  const ENTER = 0.15
  const EXIT  = 0.85

  useMotionValueEvent(progress, 'change', (p: number) => {
    // Wrapper opacity
    let op = 0
    if (p >= ENTER && p <= EXIT) {
      if (p < ENTER + 0.15)      op = remap(p, ENTER, ENTER + 0.15, 0, 1)
      else if (p > EXIT - 0.15)  op = remap(p, EXIT - 0.15, EXIT, 1, 0)
      else                        op = 1
    }
    if (wrapRef.current) wrapRef.current.style.opacity = op.toFixed(4)

    // Blur: develops sharp at midpoint
    let blur = 0
    if (p < ENTER + 0.15) blur = remap(p, ENTER, ENTER + 0.15, 22, 0)
    else if (p > EXIT - 0.15) blur = remap(p, EXIT - 0.15, EXIT, 0, 18)
    let scale = 1
    if (p < ENTER + 0.15) scale = remap(p, ENTER, ENTER + 0.15, 1.10, 1.0)
    else if (p > EXIT - 0.15) scale = remap(p, EXIT - 0.15, EXIT, 1.0, 1.06)
    if (imgRef.current) {
      imgRef.current.style.filter = `blur(${blur.toFixed(1)}px) brightness(0.88) saturate(0.65)`
      imgRef.current.style.transform = `scale(${scale.toFixed(4)})`
    }

    // Haze arrives before photo
    let hazeOp = 0
    const hazeIn  = Math.max(0, ENTER - 0.10)
    const hazeOut = Math.min(1, EXIT  + 0.08)
    if (p >= hazeIn && p <= hazeOut) {
      if (p < ENTER + 0.15)       hazeOp = remap(p, hazeIn, ENTER + 0.15, 0, 1)
      else if (p > EXIT - 0.15)   hazeOp = remap(p, EXIT - 0.15, hazeOut, 1, 0)
      else                         hazeOp = 1
    }
    if (haze1Ref.current) haze1Ref.current.style.opacity = hazeOp.toFixed(4)
    if (haze2Ref.current) haze2Ref.current.style.opacity = (hazeOp * 0.52).toFixed(4)
  })

  const mask = buildMask(x, y)

  return (
    <>
      <div
        ref={haze1Ref}
        aria-hidden="true"
        style={{
          position: 'fixed', left: x, top: y,
          width: '88vw', height: '80vh',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse 78% 72% at 50% 50%, ${accent} 0%, transparent 68%)`,
          filter: 'url(#ink-atmosphere)',
          opacity: 0, willChange: 'opacity',
          zIndex, pointerEvents: 'none',
          borderRadius: '55% 45% 50% 50% / 48% 52% 48% 52%',
        }}
      />
      {accentSecondary && (
        <div
          ref={haze2Ref}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `calc(${x} + 9%)`,
            top: `calc(${y} - 11%)`,
            width: '60vw', height: '60vh',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse 70% 65% at 50% 50%, ${accentSecondary} 0%, transparent 70%)`,
            filter: 'url(#ink-atmosphere)',
            opacity: 0, willChange: 'opacity',
            zIndex, pointerEvents: 'none',
          }}
        />
      )}
      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position: 'fixed', left: x, top: y,
          width: '78vw', height: '74vh',
          transform: 'translate(-50%, -50%)',
          opacity: 0, willChange: 'opacity',
          zIndex: zIndex + 1, pointerEvents: 'none',
          WebkitMaskImage: mask, maskImage: mask,
          WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
          filter: 'url(#ink-develop)',
        }}
      >
        <div
          ref={imgRef}
          style={{
            position: 'absolute', inset: '-14%',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            willChange: 'transform, filter', transformOrigin: 'center center',
          }}
        />
      </div>
    </>
  )
}

// Outer shell — resolves the section element from the DOM by id,
// then mounts PhotoDriver once the element is available.
export default function SectionPhoto(props: Props) {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const el = document.getElementById(props.sectionId)
    if (el) setTarget(el)
  }, [props.sectionId])

  if (!target) return null
  return <PhotoDriver target={target} {...props} />
}
