'use client'

import ScrollDiffusionGallery, { type DiffusionScene } from './ScrollDiffusionGallery'

const PAGE_SCENES: DiffusionScene[] = [
  // What Is Literati — deep violet, photo left-of-center
  {
    image: '/images/library-wide-1.jpg',
    accent: 'rgba(75,10,160,0.62)',
    accentSecondary: 'rgba(130,15,110,0.42)',
    position: 'center 30%',
    x: '44%', y: '52%',
    inStart: 0.10, inEnd: 0.22,
    outStart: 0.30, outEnd: 0.40,
  },
  // Events — magenta, photo right-of-center
  {
    image: '/images/debate-session.jpg',
    accent: 'rgba(150,12,125,0.58)',
    accentSecondary: 'rgba(55,8,195,0.38)',
    position: 'center 40%',
    x: '56%', y: '50%',
    inStart: 0.36, inEnd: 0.48,
    outStart: 0.56, outEnd: 0.66,
  },
  // Event Posters — indigo/blue, photo center-low
  {
    image: '/images/talkmasters.jpg',
    accent: 'rgba(30,45,185,0.56)',
    accentSecondary: 'rgba(100,10,155,0.40)',
    position: 'center 35%',
    x: '50%', y: '54%',
    inStart: 0.60, inEnd: 0.72,
    outStart: 0.80, outEnd: 0.88,
  },
  // Memory Lane — richest, deep purple/magenta
  {
    image: '/images/campus-group.jpg',
    accent: 'rgba(105,8,150,0.65)',
    accentSecondary: 'rgba(175,18,95,0.42)',
    position: 'center 45%',
    x: '48%', y: '50%',
    inStart: 0.84, inEnd: 0.92,
    outStart: 0.97, outEnd: 1.0,
  },
]

export default function MainDiffusionBackground() {
  // useWindowScroll=true tracks document scroll progress 0→1
  return <ScrollDiffusionGallery scenes={PAGE_SCENES} useWindowScroll />
}
