'use client'

import ScrollDiffusionGallery, { type DiffusionScene } from './ScrollDiffusionGallery'

const PAGE_SCENES: DiffusionScene[] = [
  // Scene 1 — hero/what-is section (violet)
  {
    image: '/images/library-wide-1.svg',
    accent: 'rgba(75,10,160,0.72)',
    accentSecondary: 'rgba(130,15,110,0.50)',
    position: 'center 30%',
    x: '44%', y: '52%',
    inStart: 0.05, inEnd: 0.14,
    outStart: 0.28, outEnd: 0.38,
  },
  // Scene 2 — events (magenta)
  {
    image: '/images/debate-session.svg',
    accent: 'rgba(160,12,130,0.70)',
    accentSecondary: 'rgba(55,8,195,0.48)',
    position: 'center 40%',
    x: '56%', y: '50%',
    inStart: 0.32, inEnd: 0.42,
    outStart: 0.56, outEnd: 0.65,
  },
  // Scene 3 — event posters (indigo)
  {
    image: '/images/talkmasters.svg',
    accent: 'rgba(30,45,185,0.68)',
    accentSecondary: 'rgba(100,10,155,0.48)',
    position: 'center 35%',
    x: '50%', y: '54%',
    inStart: 0.58, inEnd: 0.67,
    outStart: 0.80, outEnd: 0.88,
  },
  // Scene 4 — memory lane (deep purple/magenta)
  {
    image: '/images/campus-group.svg',
    accent: 'rgba(120,8,160,0.75)',
    accentSecondary: 'rgba(180,18,100,0.52)',
    position: 'center 45%',
    x: '48%', y: '50%',
    inStart: 0.82, inEnd: 0.90,
    outStart: 0.97, outEnd: 1.0,
  },
]

export default function MainDiffusionBackground() {
  // useWindowScroll=true tracks document scroll progress 0→1
  return <ScrollDiffusionGallery scenes={PAGE_SCENES} useWindowScroll />
}
