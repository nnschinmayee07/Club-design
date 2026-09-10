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
  const rafRef = useRef<number | null>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const compute = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const startPx = diffusionStart * docHeight
      const endPx = diffusionEnd * docHeight
      const range = endPx - startPx
      if (range <= 0) return

      const raw = Math.max(0, Math.min(1, (scrollTop - startPx) / range))
      // Only update state if value changed meaningfully (avoid micro re-renders)
      if (Math.abs(raw - progressRef.current) > 0.002) {
        progressRef.current = raw
        setProgress(raw)
      }
    }

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        compute()
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [diffusionStart, diffusionEnd])

  return <DiffusionBackground scrollProgress={progress} />
}
