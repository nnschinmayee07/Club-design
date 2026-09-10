'use client'

import DiffusionBackground from './DiffusionBackground'

export default function ScrollDiffusionOrchestrator({
  diffusionStart,
  diffusionEnd,
}: {
  diffusionStart: number
  diffusionEnd: number
}) {
  // DiffusionBackground now owns the scroll listener and updates DOM directly —
  // no state, no re-renders from this component
  return <DiffusionBackground diffusionStart={diffusionStart} diffusionEnd={diffusionEnd} />
}
