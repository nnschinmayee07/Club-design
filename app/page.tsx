import dynamic from 'next/dynamic'
import LiteratiHero from '@/components/LiteratiHero'

// New premium diffusion background
const DiffusionBackground = dynamic(() => import('@/components/club/DiffusionBackground'), { ssr: false })

// Below-fold sections lazy-loaded
const WhatIsLiterati   = dynamic(() => import('@/components/WhatIsLiterati'),   { ssr: false })
const EventPosterStack = dynamic(() => import('@/components/EventPosterStack'), { ssr: false })
const MemoryLane       = dynamic(() => import('@/components/MemoryLane'),       { ssr: false })
const LiteratiClosing  = dynamic(() => import('@/components/LiteratiClosing'),  { ssr: false })

export default function LiteratiPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#05030a' }}>
      {/* Atmospheric diffusion background — fixed, behind everything */}
      <DiffusionBackground />

      {/* Page content above background */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <LiteratiHero />
        <div style={{ height: '8vh' }} />
        <WhatIsLiterati />
        <div style={{ height: '15vh' }} />
        <EventPosterStack />
        <div style={{ height: '15vh' }} />
        <MemoryLane />
        <LiteratiClosing />
      </main>
    </div>
  )
}
