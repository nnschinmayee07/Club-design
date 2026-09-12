import dynamic from 'next/dynamic'
import LiteratiHero from '@/components/LiteratiHero'
import PageDiffusion from '@/components/diffusion/PageDiffusion'

const WhatIsLiterati   = dynamic(() => import('@/components/WhatIsLiterati'),   { ssr: false })
const EventPosterStack = dynamic(() => import('@/components/EventPosterStack'), { ssr: false })
const MemoryLane       = dynamic(() => import('@/components/MemoryLane'),       { ssr: false })
const LiteratiClosing  = dynamic(() => import('@/components/LiteratiClosing'),  { ssr: false })

export default function LiteratiPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#04020a' }}>
      {/*
        PageDiffusion owns the fixed SVG filters, ambient hazes, grain, and vignette.
        It also renders the four section-coupled photo scenes via SectionPhoto.
        Each SectionPhoto tracks its own section ref for precise scroll coupling.
      */}
      <PageDiffusion />

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
