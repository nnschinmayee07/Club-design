'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export type ImageScene = {
  src: string
  accent: string        // dominant hue e.g. 'rgba(120,40,180,0.6)'
  position?: string     // CSS background-position
  inStart: number       // scroll progress 0-1 when image starts emerging
  inEnd: number
  outStart: number
  outEnd: number
}

// Each scene: image dissolved via radial mask + blur + displacement
export function BackgroundImageScene({
  scene,
  scrollProgress,
}: {
  scene: ImageScene
  scrollProgress: any
}) {
  const opacity = useTransform(
    scrollProgress,
    [scene.inStart, scene.inEnd, scene.outStart, scene.outEnd],
    [0, 0.28, 0.28, 0]
  )

  // Slow parallax scale — image breathes in as it surfaces
  const scale = useTransform(
    scrollProgress,
    [scene.inStart, scene.outEnd],
    [1.08, 1.0]
  )

  // Blur dissolves away as image surfaces
  const blurPx = useTransform(
    scrollProgress,
    [scene.inStart, scene.inEnd, scene.outStart, scene.outEnd],
    [28, 10, 10, 22]
  )

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        opacity,
        scale,
        willChange: 'opacity, transform',
      }}
    >
      {/* Actual image */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8%',
          backgroundImage: `url(${scene.src})`,
          backgroundSize: 'cover',
          backgroundPosition: scene.position ?? 'center',
          filter: blurPx.get ? `blur(${blurPx.get()}px) saturate(0.55)` : 'blur(18px) saturate(0.55)',
        }}
      />

      {/* Ink-dissolve mask — radial gradient eats the edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 60% 55% at 50% 48%,
            transparent 0%,
            transparent 28%,
            rgba(5,3,10,0.5) 55%,
            rgba(5,3,10,0.92) 80%,
            rgba(5,3,10,1) 100%
          )
        `,
      }} />

      {/* Accent color diffusion — sits over the image, gives it atmosphere */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${scene.accent} 0%, transparent 70%)`,
        mixBlendMode: 'color',
      }} />
    </motion.div>
  )
}

// Blur updater that directly writes to DOM (avoids re-renders)
export function BackgroundImageSceneDirect({
  scene,
  scrollProgress,
}: {
  scene: ImageScene
  scrollProgress: any
}) {
  const imgRef  = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const opacity = useTransform(
    scrollProgress,
    [scene.inStart, scene.inEnd, scene.outStart, scene.outEnd],
    [0, 0.30, 0.30, 0]
  )
  const scale = useTransform(
    scrollProgress,
    [scene.inStart, scene.outEnd],
    [1.09, 1.0]
  )

  // Drive blur directly on DOM
  useRef(() => {
    scrollProgress.on('change', (v: number) => {
      if (!imgRef.current) return
      const prog = Math.max(0, Math.min(1,
        (v - scene.inStart) / Math.max(0.001, scene.inEnd - scene.inStart)
      ))
      const progOut = Math.max(0, Math.min(1,
        (v - scene.outStart) / Math.max(0.001, scene.outEnd - scene.outStart)
      ))
      const blur = prog < 1
        ? 28 - 18 * prog
        : 10 + 12 * progOut
      imgRef.current.style.filter = `blur(${blur}px) saturate(0.55)`
    })
  })

  return (
    <motion.div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        opacity,
        scale,
        willChange: 'opacity, transform',
      }}
    >
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          inset: '-8%',
          backgroundImage: `url(${scene.src})`,
          backgroundSize: 'cover',
          backgroundPosition: scene.position ?? 'center',
          filter: 'blur(28px) saturate(0.55)',
          willChange: 'filter',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 62% 58% at 50% 48%,
            transparent 0%,
            transparent 25%,
            rgba(5,3,10,0.45) 52%,
            rgba(5,3,10,0.90) 78%,
            rgba(5,3,10,1) 100%
          )
        `,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 65% 58% at 50% 50%, ${scene.accent} 0%, transparent 68%)`,
        mixBlendMode: 'color',
      }} />
    </motion.div>
  )
}
