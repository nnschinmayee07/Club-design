import dynamic from 'next/dynamic'
import LiteratiHero from '@/components/LiteratiHero'
import ScrollDiffusionOrchestrator from '@/components/ScrollDiffusionOrchestrator'

// Everything below the fold is lazy-loaded — hero paints first
const WhatIsLiterati   = dynamic(() => import('@/components/WhatIsLiterati'),   { ssr: false })
const EventPosterStack = dynamic(() => import('@/components/EventPosterStack'), { ssr: false })
const MemoryLane       = dynamic(() => import('@/components/MemoryLane'),       { ssr: false })
const LiteratiClosing  = dynamic(() => import('@/components/LiteratiClosing'),  { ssr: false })

export default function LiteratiPage() {
  return (
    <>
      <ScrollDiffusionOrchestrator diffusionStart={0.12} diffusionEnd={0.88} />
      <div style={{ position: 'fixed', inset: 0, background: 'var(--ground)', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <LiteratiHero />
        <div style={{ height: '8vh' }} />
        <WhatIsLiterati />
        <div style={{ height: '15vh' }} />
        <EventPosterStack />
        <div style={{ height: '15vh' }} />
        <MemoryLane />
        <LiteratiClosing />
      </main>
    </>
  )
}
