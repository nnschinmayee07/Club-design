'use client';

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';

// ─── Polaroid memories ────────────────────────────────────────────────────────
const MEMORIES = [
  { src: '/images/clubs/apex/gallery/1.jpg', label: 'Genesis 2024',          caption: 'Game jam day two — builds flying.',       category: 'Gameathon',    rotation: -3,   oy: 8  },
  { src: '/images/clubs/apex/gallery/2.jpg', label: 'VCC · Round 1',         caption: 'The first campus Valorant clash.',         category: 'Tournament',   rotation: 2.5,  oy: -6 },
  { src: '/images/clubs/apex/gallery/3.jpg', label: 'Interdept Esports',     caption: '180+ players. 17 departments.',            category: 'Championship', rotation: -1.5, oy: 10 },
  { src: '/images/clubs/apex/gallery/4.jpg', label: 'LAN Night',             caption: 'Side by side, every Friday.',              category: 'Community',    rotation: 3,    oy: -4 },
  { src: '/images/clubs/apex/gallery/5.jpg', label: 'Build Session',         caption: 'Unity and deadlines in equal measure.',    category: 'Game Dev',     rotation: -2,   oy: 6  },
  { src: '/images/clubs/apex/gallery/6.jpg', label: 'APEX · Founded',        caption: 'March 2024. The beginning.',               category: 'Origins',      rotation: 1.5,  oy: -10 },
] as const;

// ─── DNA constants ────────────────────────────────────────────────────────────
const CARD_W      = 220;
const GAP         = 28;
const CURVE_H     = 60;    // curveHeight — vertical DNA wave amplitude
const CURVE_DEPTH = 160;   // curveDepth — Z depth of wave
const ROTATION    = 28;    // max rotateY degrees
const TILT        = 10;    // max rotateZ/X degrees
const STRAND      = 1;     // 1 or -1 for double-strand; use 1
const INACTIVE_SCALE   = 0.78;
const INACTIVE_OPACITY = 0.42;
const DRAG_SENSITIVITY = 1.35;
const VELOCITY_CLAMP   = 2.5;
const MOMENTUM_DECAY   = 0.93; // per-frame at 60fps
const SNAP_STRENGTH    = 0.18; // for exp snap
const SNAP_THRESHOLD   = 0.025;
const PERSPECTIVE      = 1100;

function easeOutCubic(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }

// Shortest-path distance (wrapping)
function shortestDist(i: number, pos: number, count: number) {
  let d = i - pos;
  while (d >  count / 2) d -= count;
  while (d < -count / 2) d += count;
  return d;
}

// Per-card transform from DNA formula
function dnaTransform(dist: number) {
  const absDist = Math.abs(dist);
  const maxVis  = Math.max(3, Math.ceil(MEMORIES.length / 2));
  const normDist = Math.min(absDist / maxVis, 1);
  const phase    = dist * Math.PI * 0.48;
  const activeAmount = Math.max(0, 1 - absDist);

  const x       = dist * (CARD_W + GAP) * 0.72;
  const y       = Math.sin(phase) * CURVE_H * STRAND;
  const z       = Math.cos(phase) * CURVE_DEPTH;
  const rotateY = Math.cos(phase) * ROTATION * STRAND;
  const rotateX = Math.sin(phase) * TILT * 0.35;
  const rotateZ = Math.sin(phase) * TILT * STRAND;
  const scale   = INACTIVE_SCALE + (1 - INACTIVE_SCALE) * easeOutCubic(activeAmount);
  const opacity = INACTIVE_OPACITY + (1 - INACTIVE_OPACITY) * easeOutCubic(activeAmount);
  const blurRaw = 5 * normDist * (1 - easeOutCubic(activeAmount));
  const blur    = blurRaw < 0.05 ? 0 : blurRaw;
  const zIndex  = Math.round(100 - absDist * 10);
  const shadow  = `0 ${8 + easeOutCubic(activeAmount) * 10}px ${18 + easeOutCubic(activeAmount) * 15}px rgba(0,0,0,0.40)`;

  return { x, y, z, rotateY, rotateX, rotateZ, scale, opacity, blur, zIndex, shadow };
}

// ─── Polaroid card ────────────────────────────────────────────────────────────
function PolaroidCard({
  memory,
  dist,
  onClick,
  reducedMotion,
}: {
  memory: typeof MEMORIES[number];
  dist: number;
  onClick: () => void;
  reducedMotion: boolean | null;
}) {
  const t = dnaTransform(dist);
  const isActive = Math.abs(dist) < 0.5;

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 300, damping: 34, mass: 0.9 };

  return (
    <motion.div
      animate={{
        x:       t.x,
        y:       t.y + (isActive ? memory.oy * 0.4 : memory.oy * 0.15),
        z:       t.z,
        rotateY: t.rotateY + (isActive ? memory.rotation * 0.3 : 0),
        rotateX: t.rotateX,
        rotateZ: t.rotateZ + memory.rotation * 0.12,
        scale:   t.scale,
        opacity: t.opacity,
        filter:  `blur(${t.blur}px)`,
      }}
      transition={spring}
      style={{ zIndex: t.zIndex, position: 'absolute', transformStyle: 'preserve-3d', cursor: isActive ? 'default' : 'pointer' }}
      onClick={!isActive ? onClick : undefined}
      role={isActive ? undefined : 'button'}
      tabIndex={isActive ? undefined : 0}
      aria-hidden={!isActive}
      onKeyDown={!isActive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {/* Polaroid frame */}
      <div
        style={{
          width:      CARD_W,
          background: '#f7f2ea',
          padding:    '10px 10px 40px',
          borderRadius: 2,
          boxShadow:  t.shadow,
        }}
      >
        {/* Photo */}
        <div style={{ width: '100%', aspectRatio: '3/4', background: '#ddd5c8', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={memory.src}
            alt={memory.caption}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%, rgba(0,0,0,0.05) 100%)' }}
          />
        </div>

        {/* Caption */}
        <div className="mt-2 px-1">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a08c72', marginBottom: 3 }}>
            {memory.category}
          </div>
          <div style={{ fontFamily: 'var(--font-manrope)', fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.35, color: '#332820' }}>
            {memory.caption}
          </div>
        </div>
      </div>

      {/* Italic handwritten label below active card */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            bottom: -28,
            left: 0, right: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-playfair)',
            fontStyle: 'italic',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {memory.label}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ApexMemoryLane() {
  const count = MEMORIES.length;
  const reducedMotion = useReducedMotion();

  // Floating-point position (wraps 0..count)
  const posRef     = useRef(0);
  const velRef     = useRef(0);
  const rafRef     = useRef<number>(0);
  const lastTRef   = useRef<number>(0);
  const draggingRef= useRef(false);

  const [displayPos, setDisplayPos] = useState(0); // drives render

  // Momentum loop
  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastTRef.current) / 1000, 0.05);
    lastTRef.current = now;

    if (!draggingRef.current) {
      // Decay momentum
      velRef.current *= Math.pow(MOMENTUM_DECAY, dt * 60);

      // Snap force toward nearest integer
      if (Math.abs(velRef.current) < SNAP_THRESHOLD) {
        const target = Math.round(posRef.current);
        const snapF  = 1 - Math.exp(-SNAP_STRENGTH * 60 * dt);
        posRef.current += (target - posRef.current) * snapF;
        if (Math.abs(posRef.current - target) < 0.001) {
          posRef.current = target;
          velRef.current = 0;
          setDisplayPos(posRef.current);
          return; // settled — stop loop
        }
      } else {
        posRef.current += velRef.current * dt;
      }

      // Wrap
      posRef.current = ((posRef.current % count) + count) % count;
      setDisplayPos(posRef.current);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [count]);

  const startLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lastTRef.current = performance.now();
    rafRef.current   = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Auto-advance every 3.5 s when idle (not dragging, velocity settled)
  const autoRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!draggingRef.current && Math.abs(velRef.current) < SNAP_THRESHOLD) {
        velRef.current = 0.9; // gentle forward nudge
        startLoop();
      }
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [startLoop]);

  // Drag handlers
  const onDragStart = useCallback(() => {
    draggingRef.current = true;
    velRef.current = 0;
    clearInterval(autoRef.current); // pause auto on user interaction
    startLoop();
  }, [startLoop]);

  const onDrag = useCallback((_: unknown, info: PanInfo) => {
    // pixels → position units (sensitivity applied)
    const delta = -(info.delta.x / (CARD_W + GAP)) * DRAG_SENSITIVITY;
    posRef.current = ((posRef.current + delta) % count + count) % count;
    setDisplayPos(posRef.current);
  }, [count]);

  const onDragEnd = useCallback((_: unknown, info: PanInfo) => {
    draggingRef.current = false;
    const rawVel = -(info.velocity.x / (CARD_W + GAP)) * DRAG_SENSITIVITY;
    velRef.current = Math.max(-VELOCITY_CLAMP, Math.min(VELOCITY_CLAMP, rawVel));
    startLoop();
    // Restart auto-advance
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!draggingRef.current && Math.abs(velRef.current) < SNAP_THRESHOLD) {
        velRef.current = 0.9;
        startLoop();
      }
    }, 3500);
  }, [startLoop]);

  // Click nav buttons — spring snap (jump vel, let loop settle)
  const go = useCallback((dir: 1 | -1) => {
    velRef.current = dir * 1.2;
    startLoop();
  }, [startLoop]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  const activeIdx = Math.round(displayPos) % count;

  return (
    <section className="relative z-10 py-24 md:py-40 overflow-hidden" aria-label="Memory Lane">

      {/* Heading */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-20">
        <div className="flex items-center gap-3 mb-5">
          <span aria-hidden className="h-px w-6 bg-white/25" />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-white/38">Memory Lane</span>
        </div>
        <h2 className="font-display font-bold text-white leading-[1.05] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
          Moments from APEX
        </h2>
        <p className="font-display italic text-white/42" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
          Every moment, a story.
        </p>
      </div>

      {/* Carousel stage */}
      <div
        style={{ perspective: PERSPECTIVE, perspectiveOrigin: '50% 50%' }}
        aria-live="polite"
        aria-label={`Memory ${activeIdx + 1} of ${count}: ${MEMORIES[activeIdx].caption}`}
      >
        {/* Drag capture layer */}
        <motion.div
          drag="x"
          dragElastic={0}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ height: 430, touchAction: 'pan-y' }}
        >
          {MEMORIES.map((memory, i) => {
            const dist = shortestDist(i, displayPos, count);
            if (Math.abs(dist) > 3) return null;
            return (
              <PolaroidCard
                key={memory.label}
                memory={memory}
                dist={dist}
                reducedMotion={reducedMotion}
                onClick={() => {
                  // Snap to clicked card
                  const target = i;
                  velRef.current = 0;
                  posRef.current = displayPos;
                  // find shortest path and set velocity toward it
                  const d = shortestDist(target, displayPos, count);
                  velRef.current = d * 1.5;
                  startLoop();
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-16 flex flex-col items-center gap-5">
        {/* Dots */}
        <div className="flex items-center gap-2" role="tablist">
          {MEMORIES.map((m, i) => {
            const isA = i === activeIdx;
            return (
              <button key={m.label} role="tab" aria-selected={isA} aria-label={m.label}
                onClick={() => { velRef.current = 0; posRef.current = displayPos; velRef.current = shortestDist(i, displayPos, count) * 1.5; startLoop(); }}>
                <motion.div
                  animate={{ width: isA ? 22 : 6, opacity: isA ? 1 : 0.28, backgroundColor: isA ? '#f7f2ea' : '#ffffff' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="h-[3px] rounded-full"
                />
              </button>
            );
          })}
        </div>

        {/* Arrows + counter */}
        <div className="flex items-center gap-3">
          <button onClick={() => go(-1)} aria-label="Previous memory"
            className="w-11 h-11 rounded-full border border-white/15 text-white/45 hover:text-white hover:border-white/35 grid place-items-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/25 w-16 text-center">
            {String(activeIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button onClick={() => go(1)} aria-label="Next memory"
            className="w-11 h-11 rounded-full border border-white/15 text-white/45 hover:text-white hover:border-white/35 grid place-items-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
