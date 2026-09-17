'use client';

import { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

const ABOUT_TEXT =
  'APEX MLRIT is a student-led esports and game development community. ' +
  'Established March 2024, it brings players, developers, designers and ' +
  'storytellers into one active gaming culture on the Dundigal campus. ' +
  'The club runs Valorant, BGMI, FIFA and multi-title events — bootcamps, ' +
  'casting, production and content collabs. Members ship real mobile, PC and ' +
  'VR games on Unity, Unreal Engine and Godot. Others film, cast or run the ' +
  'media desk for the tournament next week. ' +
  'We build teams, scrim regularly and climb leaderboards. ' +
  'Inclusive, respectful and hype — we celebrate wins, share highlights and make friends for life.';

const FACTS = [
  ['Established', 'March 2024'],
  ['Location',    'MLRIT · Dundigal'],
  ['Titles',      'Valorant · BGMI · FIFA'],
  ['Engines',     'Unity · Unreal · Godot'],
] as const;

const APEX_RED = '#D80000';

// Per-character span — color driven by scroll
function Char({
  char,
  progress,
  start,
  end,
  reduced,
}: {
  char:     string;
  progress: MotionValue<number>;
  start:    number;
  end:      number;
  reduced:  boolean;
}) {
  const color = useTransform(
    progress,
    [Math.max(0, start - 0.01), start, end, Math.min(1, end + 0.01)],
    reduced
      ? ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']
      : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.55)'],
  );

  return (
    <motion.span style={{ color }} aria-hidden="true">
      {char}
    </motion.span>
  );
}

export default function ApexAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced    = !!useReducedMotion();

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  // Split into words, then chars within each word — words wrap naturally
  const words = useMemo(() => ABOUT_TEXT.split(' '), []);
  const totalChars = useMemo(() => ABOUT_TEXT.replace(/ /g, '').length, []);

  // Reveal window: tight for a sharp lit leading edge
  const REVEAL_START = 0.05;
  const REVEAL_END   = 0.90;
  const WINDOW       = 0.055;
  const SPAN         = REVEAL_END - REVEAL_START;

  // Build char index offset per word
  const wordCharOffsets = useMemo(() => {
    let offset = 0;
    return words.map(w => { const o = offset; offset += w.length; return o; });
  }, [words]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '220vh' }}
      aria-label="What is APEX?"
    >
      <div className="sticky top-0 flex items-center justify-center min-h-screen overflow-hidden px-6 py-20">
        <div className="max-w-[860px] w-full mx-auto">

          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]),
              y:       useTransform(scrollYProgress, [0, 0.05], [16, 0]),
            }}
            className="flex items-center gap-3 mb-8"
          >
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              What is APEX?
            </span>
          </motion.div>

          <p
            className="font-sans font-bold leading-[1.6]"
            style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.85rem)' }}
            aria-label={ABOUT_TEXT}
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.28em] whitespace-nowrap" aria-hidden="true">
                {Array.from(word).map((ch, ci) => {
                  const charIdx = wordCharOffsets[wi] + ci;
                  const t     = charIdx / totalChars;
                  const start = REVEAL_START + t * (SPAN - WINDOW);
                  const end   = start + WINDOW;
                  return (
                    <Char
                      key={ci}
                      char={ch}
                      progress={scrollYProgress}
                      start={start}
                      end={end}
                      reduced={reduced}
                    />
                  );
                })}
              </span>
            ))}
          </p>

          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.80, 0.92], [0, 1]),
              y:       useTransform(scrollYProgress, [0.80, 0.92], [18, 0]),
            }}
            className="mt-12 border-t border-white/10 pt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8"
          >
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/30">{k}</div>
                <div className="mt-1.5 text-white/80 text-[0.9rem] leading-snug">{v}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
