'use client'

import { useEffect, useRef, useState } from 'react'
import DiffusionBackground from './DiffusionBackground'

export default function ScrollDiffusionOrchestrator({
  diffusionStart,
  diffusionEnd,
}: {
  diffusionStart: number
  diffusionEnd: number
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      // Map scroll position within [diffusionStart..diffusionEnd] to [0..1]
      const startPx = diffusionStart * docHeight
      const endPx = diffusionEnd * docHeight
      const range = endPx - startPx
      if (range <= 0) return

      const raw = (scrollTop - startPx) / range
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [diffusionStart, diffusionEnd])

  return <DiffusionBackground scrollProgress={progress} />
}
