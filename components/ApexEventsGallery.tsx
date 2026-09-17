'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';

const APEX_RED = '#D80000';

const EVENTS = [
  {
    slug:   'genesis',
    name:   'GENESIS',
    kind:   'Workshop · Gameathon',
    date:   '2 days',
    poster: '/images/clubs/apex/events/genesis.jpg',
    video:  '/videos/apex-genesis.mp4',
    body:   'A two-day Unity intensive. Industry mentors from Backstage Pass on day one — teams shipped full games from scratch on day two.',
  },
  {
    slug:   'vcc',
    name:   'VCC',
    kind:   'Tournament · Valorant',
    date:   'Wild Gaming Cafe',
    poster: '/images/clubs/apex/events/vcc.jpg',
    video:  '/videos/apex-vcc.mp4',
    body:   "MLRIT's first Valorant Campus Championship — hosted at Wild Gaming Cafe. Out of the tournament came the MLRIT Valorant roster.",
  },
  {
    slug:   'interdept',
    name:   'Interdepartmental Esports',
    kind:   'Championship · BGMI + Valorant',
    date:   '180+ players',
    poster: '/images/clubs/apex/events/interdept.jpg',
    video:  '/videos/apex-interdept.mp4',
    body:   'The first-ever Interdepartmental Esports Championship — 180+ gamers, 17 departments, guests from Arundathi Institute of Medical Sciences.',
  },
  {
    slug:   'lan',
    name:   'LAN Nights',
    kind:   'Community · Casual',
    date:   'Recurring',
    poster: '/images/clubs/apex/gallery/1.jpg',
    video:  '/videos/apex-lan.mp4',
    body:   'Regular LAN nights open to the full campus — casual play, new friendships, and the electric energy of side-by-side gaming.',
  },
] as const;

function Poster({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
    />
  ) : (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `radial-gradient(circle at 35% 35%, ${APEX_RED}33 0%, transparent 60%), #0a0a0a` }}
    >
      <span className="font-sans font-black text-white/20 text-xs tracking-widest uppercase">{alt}</span>
    </div>
  );
}

function LazyVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loaded) { el.src = src; setLoaded(true); }
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src, loaded]);

  return (
    <video ref={ref} poster={poster} muted loop playsInline preload="none"
      className="absolute inset-0 w-full h-full object-cover" aria-label={label} />
  );
}

// One event row: left = sticky meta, right = poster + video cards side by side
function EventRow({
  event,
  index,
  sectionProgress,
  total,
}: {
  event: typeof EVENTS[number];
  index: number;
  sectionProgress: MotionValue<number>;
  total: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target:  rowRef,
    offset:  ['start 80%', 'start 20%'],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const y    = useTransform(spring, [0, 1], [60, 0]);
  const op   = useTransform(spring, [0, 0.4], [0, 1]);

  return (
    <motion.div
      ref={rowRef}
      style={{ opacity: op }}
      className="flex flex-col md:flex-row gap-6 md:gap-10 items-start py-14 border-t border-white/[0.07]"
    >
      {/* Left: sticky meta */}
      <div className="md:w-[260px] flex-shrink-0 md:sticky md:top-24">
        <div
          className="inline-flex items-center h-5 px-2 rounded-full font-mono text-[0.54rem] font-bold tracking-[0.18em] uppercase mb-3"
          style={{ background: `${APEX_RED}22`, border: `1px solid ${APEX_RED}55`, color: APEX_RED }}
        >
          {event.kind}
        </div>
        <h3 className="font-sans font-black text-white leading-tight mb-1"
          style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)' }}>
          {event.name}
        </h3>
        <div className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-white/35 mb-4">
          {event.date}
        </div>
        <p className="text-white/50 text-[0.9rem] leading-[1.65]">{event.body}</p>
        <div className="mt-4 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/20">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      {/* Right: poster + video */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {(['poster', 'video'] as const).map(type => (
          <div
            key={type}
            className="flex-1 relative rounded-2xl overflow-hidden bg-[#111] border border-white/10"
            style={{ aspectRatio: '3/4' }}
          >
            <motion.div style={{ y }} className="absolute inset-0">
              {type === 'poster'
                ? <Poster src={event.poster} alt={event.name} />
                : <LazyVideo src={event.video} poster={event.poster} label={`${event.name} video`} />
              }
            </motion.div>
            <div
              className="absolute inset-x-0 bottom-0 p-3 pt-8"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
            >
              <div
                className="inline-flex items-center h-5 px-2 rounded-full font-mono text-[0.5rem] font-bold tracking-[0.18em] uppercase"
                style={{ background: `${APEX_RED}28`, border: `1px solid ${APEX_RED}44`, color: APEX_RED }}
              >
                {type === 'poster' ? 'Poster' : '▶ Video'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ApexEventsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  return (
    <section ref={sectionRef} className="relative z-10 py-20 md:py-28" aria-label="APEX events">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-16">

        <div className="flex items-center gap-3 mb-4">
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
            Events
          </span>
        </div>
        <h2
          className="font-sans font-black text-white leading-[1.02] mb-2"
          style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)' }}
        >
          The record.
        </h2>
        <p className="text-white/35 text-[0.88rem] mb-2">
          Scroll through — poster and video for each event.
        </p>

        {EVENTS.map((e, i) => (
          <EventRow
            key={e.slug}
            event={e}
            index={i}
            sectionProgress={scrollYProgress}
            total={EVENTS.length}
          />
        ))}
      </div>
    </section>
  );
}
