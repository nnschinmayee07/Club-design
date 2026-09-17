'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

const APEX_RED = '#D80000';

const DOMAINS = [
  { n: '01', title: 'Game Development',         sub: 'Unity · Unreal · Godot',               body: 'Real games on real engines — mobile, PC and VR. Members ship playable projects every semester, guided by peers who have shipped before.' },
  { n: '02', title: 'E-Sports',                 sub: 'Valorant · BGMI · FIFA · Multi-title',  body: 'Competitive gaming from the ground up — team formation, scrims, coaching, casting, and the community that makes every match worth playing.' },
  { n: '03', title: 'UI/UX & Game Design',      sub: 'Interface · Feedback · Game Feel',      body: "The design work that makes a build worth playing — interfaces, feedback loops, visual language and the invisible craft players feel but can't name." },
  { n: '04', title: 'Storytelling & Narrative', sub: 'World-building · Characters · Writing', body: 'Worlds and characters that give every mechanic a reason to exist. Writing workshops, narrative design and the craft of making players care.' },
  { n: '05', title: 'Emerging Tech',            sub: 'AR/VR · Procedural · New Engines',      body: 'The frontier — AR/VR, procedural generation and experimental engines where the next genre is being invented right now.' },
] as const;

const COUNT      = DOMAINS.length;
const ROW_HEIGHT = 88;

function gaussian(dist: number) {
  return Math.exp(-0.5 * Math.pow(dist / 2.05, 2));
}

// Individual item — subscribes to activeFloat with its own derived transforms
function DomainItem({
  domain,
  index,
  activeFloat,
}: {
  domain: typeof DOMAINS[number];
  index:  number;
  activeFloat: MotionValue<number>;
}) {
  const dist    = useTransform(activeFloat, v => index - v);
  const xVal    = useTransform(dist, d => gaussian(d) * 48);
  const yVal    = useTransform(dist, d => d * ROW_HEIGHT);
  const scaleV  = useTransform(dist, d => 0.94 + gaussian(d) * 0.075);
  const opacV   = useTransform(dist, d => Math.max(0.15, 1 - Math.abs(d) * 0.25));
  const titleC  = useTransform(dist, d => Math.abs(d) < 0.5 ? '#ffffff' : 'rgba(255,255,255,0.28)');
  const numC    = useTransform(dist, d => Math.abs(d) < 0.5 ? APEX_RED : 'rgba(255,255,255,0.15)');

  // Sub-label visibility — subscribe to dist as state for AnimatePresence
  const [isActive, setIsActive] = useState(index === 0);
  useEffect(() => dist.on('change', v => setIsActive(Math.abs(v) < 0.5)), [dist]);

  return (
    <motion.div
      style={{
        x:               xVal,
        y:               yVal,
        scale:           scaleV,
        opacity:         opacV,
        position:        'absolute',
        top:             '50%',
        marginTop:       -ROW_HEIGHT / 2,
        left:            0,
        right:           0,
        transformOrigin: 'left center',
      }}
      aria-hidden="true"
      className="flex items-baseline gap-4"
    >
      <motion.span
        style={{ color: numC }}
        className="font-sans font-black leading-none tabular-nums flex-shrink-0 w-14 text-[clamp(1.4rem,2.5vw,2.2rem)]"
      >
        {domain.n}
      </motion.span>

      <div>
        <motion.h3
          style={{ color: titleC }}
          className="font-sans font-black leading-tight text-[clamp(1.1rem,2vw,1.9rem)]"
        >
          {domain.title}
        </motion.h3>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-0.5 font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase"
              style={{ color: APEX_RED }}
            >
              {domain.sub}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Body panel — subscribes to activeFloat to swap copy
function BodyPanel({
  activeFloat,
  reducedMotion,
}: {
  activeFloat:  MotionValue<number>;
  reducedMotion: boolean;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => activeFloat.on('change', v =>
    setActive(Math.max(0, Math.min(COUNT - 1, Math.round(v))))
  ), [activeFloat]);

  return (
    <div className="lg:w-[360px] flex-shrink-0">
      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/55 leading-[1.78] text-[1rem] md:text-[1.04rem]"
        >
          {DOMAINS[active].body}
        </motion.p>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-1.5">
        {DOMAINS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width:           i === active ? 20 : 5,
              opacity:         i === active ? 1 : 0.25,
              backgroundColor: i === active ? APEX_RED : '#ffffff',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="h-[3px] rounded-full"
          />
        ))}
      </div>

      <p className="mt-4 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/25">
        Scroll to explore
      </p>
    </div>
  );
}

export default function ApexHowItWorks({ sectionRef: externalRef }: { sectionRef?: React.RefObject<HTMLElement | null> }) {
  const internalRef  = useRef<HTMLElement>(null);
  const sectionRef   = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;
  const reducedMotion = !!useReducedMotion();

  // Section height = (COUNT + 1) screens → gives each domain ~1 screen of scroll
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  // Scroll 0→1 maps to domain 0→COUNT-1
  const activeFloat = useTransform(scrollYProgress, [0.05, 0.95], [0, COUNT - 1]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${(COUNT + 1) * 100}vh` }}
      aria-label="How the club works"
    >
      <div className="sticky top-0 min-h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20">

          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              How it works
            </span>
          </div>
          <h2
            className="font-sans font-black text-white leading-[1.02] mb-10"
            style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)' }}
          >
            Five domains. One community.
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">

            {/* Scroll-driven kinetic wheel */}
            <div
              className="relative flex-1 overflow-hidden select-none"
              style={{ height: ROW_HEIGHT * COUNT }}
              aria-live="polite"
            >
              {/* Center highlight stripe */}
              <div
                aria-hidden
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top:          (ROW_HEIGHT * COUNT) / 2 - ROW_HEIGHT / 2,
                  height:       ROW_HEIGHT,
                  borderTop:    '1px solid rgba(255,255,255,0.07)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
              />

              <div className="absolute inset-0 flex flex-col items-start justify-center">
                {DOMAINS.map((d, i) => (
                  <DomainItem
                    key={d.n}
                    domain={d}
                    index={i}
                    activeFloat={activeFloat}
                  />
                ))}
              </div>

              <div aria-hidden className="absolute inset-x-0 top-0 h-20 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
            </div>

            <BodyPanel activeFloat={activeFloat} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}
