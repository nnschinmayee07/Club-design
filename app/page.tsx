import LiteratiHero from '@/components/LiteratiHero'
import WhatIsLiterati from '@/components/WhatIsLiterati'
import EventPosterStack from '@/components/EventPosterStack'
import MemoryLane from '@/components/MemoryLane'
import LiteratiClosing from '@/components/LiteratiClosing'
import ScrollDiffusionOrchestrator from '@/components/ScrollDiffusionOrchestrator'

export default function LiteratiPage() {
  return (
    <>
      {/*
        Diffusion background is fixed-position and covers the whole viewport.
        diffusionStart / diffusionEnd are fractions of total document scroll:
          0.0 = very top, 1.0 = very bottom.
        The diffusion is active from roughly after the hero (~15%) through
        the end of the poster stack (~85%), then fades out.
      */}
      <ScrollDiffusionOrchestrator diffusionStart={0.12} diffusionEnd={0.88} />

      {/* Ground colour sits behind diffusion */}
      <div style={{ position: 'fixed', inset: 0, background: 'var(--ground)', zIndex: 0 }} />

      {/* Page content — z-index above diffusion layers */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* 01 — HERO */}
        <LiteratiHero />

        {/* Breathing space between hero and What Is */}
        <div style={{ height: '8vh' }} />

        {/* 02 — WHAT IS LITERATI */}
        <WhatIsLiterati />

        {/* Visual transition space — diffusion peaks here */}
        <div style={{ height: '15vh' }} />

        {/* 03 — EVENT POSTER STACK */}
        <EventPosterStack />

        {/* Atmospheric transition */}
        <div style={{ height: '15vh' }} />

        {/* 04 — MEMORY LANE */}
        <MemoryLane />

        {/* 05 — CLOSING */}
        <LiteratiClosing />
      </main>
    </>
  )
}
