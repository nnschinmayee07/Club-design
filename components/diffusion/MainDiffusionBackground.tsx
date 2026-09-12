'use client'

import ScrollDiffusionGallery, { type DiffusionScene } from './ScrollDiffusionGallery'

// ─── Scene timing guide ────────────────────────────────────────────────────────
// Page layout (approximate scroll fractions):
//   0.00 – 0.12  → Hero (dark, no photo — intentional)
//   0.12 – 0.28  → What Is Literati
//   0.28 – 0.55  → Event Poster scroll (4 × 100vh ≈ 28% of total)
//   0.55 – 0.75  → All-events grid
//   0.75 – 0.95  → Memory Lane
//   0.95 – 1.00  → Closing
//
// Each photo enters dark-side-early, peaks in the middle of its section,
// and dissolves before the next section begins.
//
// inEnd - inStart = ~0.08 (photo develops over this range)
// outEnd - outStart = ~0.07 (photo dissolves over this range)
// Peak window (inEnd → outStart) = content section midpoint

const PAGE_SCENES: DiffusionScene[] = [
  // Scene 1 — What Is Literati (deep violet)
  // Starts emerging just as hero exits, peaks mid-section
  {
    image: '/images/library-wide-1.svg',
    accent: 'rgba(72, 8, 155, 0.65)',
    accentSecondary: 'rgba(120, 12, 105, 0.40)',
    x: '43%', y: '52%',
    inStart: 0.11, inEnd: 0.20,
    outStart: 0.26, outEnd: 0.33,
  },

  // Scene 2 — Events section (magenta/purple)
  // Emerges as user begins scrolling through posters
  {
    image: '/images/debate-session.svg',
    accent: 'rgba(145, 10, 120, 0.62)',
    accentSecondary: 'rgba(50, 6, 180, 0.36)',
    x: '57%', y: '49%',
    inStart: 0.30, inEnd: 0.38,
    outStart: 0.50, outEnd: 0.57,
  },

  // Scene 3 — Mid-events / grid (indigo)
  {
    image: '/images/talkmasters.svg',
    accent: 'rgba(28, 40, 175, 0.60)',
    accentSecondary: 'rgba(95, 8, 148, 0.38)',
    x: '50%', y: '53%',
    inStart: 0.55, inEnd: 0.63,
    outStart: 0.72, outEnd: 0.79,
  },

  // Scene 4 — Memory Lane (richest purple/magenta — memories emerging)
  {
    image: '/images/campus-group.svg',
    accent: 'rgba(115, 6, 148, 0.70)',
    accentSecondary: 'rgba(168, 15, 90, 0.44)',
    x: '48%', y: '50%',
    inStart: 0.77, inEnd: 0.85,
    outStart: 0.93, outEnd: 1.0,
  },
]

export default function MainDiffusionBackground() {
  return <ScrollDiffusionGallery scenes={PAGE_SCENES} useWindowScroll />
}
