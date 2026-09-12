'use client'

// PageDiffusion — mounts once on the page.
// Renders the SVG filter defs, ambient hazes, grain, vignette,
// and all four section-coupled photo scenes via SectionPhoto.
//
// Each SectionPhoto gets a ref to a sentinel element placed inside
// each content section. The sentinel is absolutely positioned to
// cover the whole section, giving an accurate scrollYProgress for that section.

import { useRef } from 'react'
import { DiffusionFilterDefs } from './OrganicMask'
import SectionPhoto from './SectionPhoto'

function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 18,
        pointerEvents: 'none', opacity: 0.036,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  )
}

function Vignette() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 19,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 90% 78% at 50% 50%,
          transparent 32%,
          rgba(3,2,8,0.22) 58%,
          rgba(3,2,8,0.65) 100%
        )`,
      }}
    />
  )
}

function AmbientLayer() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', left: '32%', top: '42%',
          width: '55vw', height: '50vh',
          transform: 'translate3d(-50%,-50%,0)',
          borderRadius: '52% 48% 44% 56% / 50% 54% 46% 50%',
          background: 'rgba(38,6,80,0.16)',
          filter: 'url(#ink-atmosphere)',
          animation: 'ambient-drift-a 32s ease-in-out infinite alternate',
          willChange: 'transform',
          zIndex: 1, pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', left: '70%', top: '60%',
          width: '42vw', height: '44vh',
          transform: 'translate3d(-50%,-50%,0)',
          borderRadius: '44% 56% 52% 48% / 46% 42% 58% 54%',
          background: 'rgba(80,8,100,0.12)',
          filter: 'url(#ink-atmosphere)',
          animation: 'ambient-drift-b 40s ease-in-out infinite alternate',
          willChange: 'transform',
          zIndex: 1, pointerEvents: 'none',
        }}
      />
    </>
  )
}

export default function PageDiffusion() {
  // One ref per content section — these are rendered as invisible sentinel
  // divs positioned inside each section so SectionPhoto can track them.
  const whatRef     = useRef<HTMLDivElement>(null)
  const eventsRef   = useRef<HTMLDivElement>(null)
  const memoryRef   = useRef<HTMLDivElement>(null)
  const closingRef  = useRef<HTMLDivElement>(null)

  return (
    <>
      <DiffusionFilterDefs />

      {/* Dark base */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: '#04020a', pointerEvents: 'none',
      }} />

      <AmbientLayer />

      {/*
        Sentinel divs — positioned fixed so SectionPhoto can track them.
        Each one is a full-page overlay that is transparent and non-interactive.
        SectionPhoto watches scroll relative to these elements.
        We render them here alongside the photo layers so they share the same
        component lifecycle.

        Actually we use data attributes on the body and watch sections directly —
        the simplest correct pattern is to pass refs from the sections themselves.
        Since page.tsx uses dynamic imports we can't pass refs across the boundary.

        Instead: use named data-section IDs and watch those elements from SectionPhoto.
      */}

      {/*
        Photo scenes — each one mounts its own scroll tracker pointed at
        a specific section via a CSS selector + useRef to a sentinel div
        rendered inside that section.

        We render the sentinels HERE as fixed-position phantom elements sized
        to match where each section sits. But we can't know section positions
        without measuring.

        Correct solution: SectionPhoto accepts an `elementId` and resolves
        the ref client-side via document.getElementById.
      */}

      {/* Scene 1 — What Is Literati */}
      <SectionPhoto
        sectionId="section-what"
        image="/images/library-wide-1.svg"
        accent="rgba(68,6,148,0.62)"
        accentSecondary="rgba(115,10,100,0.38)"
        x="44%" y="52%"
        zIndex={2}
      />

      {/* Scene 2 — Events */}
      <SectionPhoto
        sectionId="section-events"
        image="/images/debate-session.svg"
        accent="rgba(140,8,118,0.60)"
        accentSecondary="rgba(45,5,172,0.34)"
        x="57%" y="49%"
        zIndex={2}
      />

      {/* Scene 3 — Memory Lane */}
      <SectionPhoto
        sectionId="section-memory"
        image="/images/campus-group.svg"
        accent="rgba(110,5,142,0.68)"
        accentSecondary="rgba(162,14,88,0.40)"
        x="50%" y="51%"
        zIndex={2}
      />

      {/* Scene 4 — Closing */}
      <SectionPhoto
        sectionId="section-closing"
        image="/images/talkmasters.svg"
        accent="rgba(26,38,168,0.58)"
        accentSecondary="rgba(90,6,140,0.36)"
        x="52%" y="50%"
        zIndex={2}
      />

      <Grain />
      <Vignette />
    </>
  )
}
