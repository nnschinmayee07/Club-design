'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { literati } from '@/data/literati'

const POSTER_ATMOSPHERES = [
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(1,116,31,0.35) 0%, transparent 70%)' },
      { gradient: 'linear-gradient(to bottom, rgba(2,61,16,0.9) 0%, rgba(1,116,31,0.3) 40%, rgba(10,61,31,0.95) 100%)' },
    ],
    accent: '#a8f0b8',
    symbol: '⚖',
    details: [
      { label: 'Format', value: 'Committees & Resolutions' },
      { label: 'Delegates', value: '200+ from across campus' },
      { label: 'Duration', value: '2-day simulation' },
      { label: 'Open to', value: 'All years' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 50% 70% at 50% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)' },
      { gradient: 'linear-gradient(to bottom, rgba(11,31,61,0.85) 0%, rgba(30,58,95,0.4) 50%, rgba(20,41,74,0.95) 100%)' },
    ],
    accent: '#a0c4f8',
    symbol: '◉',
    details: [
      { label: 'Venue', value: 'MLRIT Auditorium' },
      { label: 'Talks', value: 'Student & invited speakers' },
      { label: 'Theme', value: 'Echoes of Tomorrow' },
      { label: 'Licence', value: 'Independently Organised' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 60% 60% at 40% 70%, rgba(201,125,46,0.45) 0%, transparent 65%)' },
      { gradient: 'linear-gradient(to bottom, rgba(58,21,3,0.9) 0%, rgba(180,83,9,0.25) 45%, rgba(122,55,6,0.95) 100%)' },
    ],
    accent: '#ffd580',
    symbol: '✦',
    details: [
      { label: 'Competitions', value: 'Screen Battle, LitTrivia, Courtroom Drama' },
      { label: 'Scope', value: 'Full campus day event' },
      { label: 'Who', value: 'Everyone welcome' },
      { label: 'Vibe', value: 'High energy, all genres' },
    ],
  },
  {
    layers: [
      { gradient: 'radial-gradient(ellipse 40% 55% at 50% 20%, rgba(180,160,220,0.14) 0%, transparent 55%)' },
      { gradient: 'linear-gradient(to bottom, rgba(26,11,61,0.92) 0%, rgba(107,63,160,0.28) 45%, rgba(58,31,95,0.96) 100%)' },
    ],
    accent: '#d4b8f0',
    symbol: '◈',
    details: [
      { label: 'Format', value: 'Immersive team roleplay' },
      { label: 'Team size', value: '4–6 members' },
      { label: 'Goal', value: 'Crack the case before others' },
      { label: 'Difficulty', value: 'Everyone has a past' },
    ],
  },
]

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function EventPosterStack() {
  const [selected, setSelected] = useState<number | null>(null)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const events = literati.events

  return (
    <section
      ref={ref}
      style={{ padding: '8vh 0 10vh', position: 'relative', contentVisibility: 'auto' }}
    >
      {/* Section label */}
      <div style={{ textAlign: 'center', marginBottom: '4vh' }}>
        <p className="eyebrow" style={{ letterSpacing: '0.3em', color: 'rgba(201,125,46,0.7)', fontSize: '0.6rem' }}>
          Events
        </p>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: 'rgba(240,230,200,0.85)',
          fontWeight: 400,
          marginTop: '0.5rem',
        }}>
          What we do
        </h2>
      </div>

      {/* Cards grid — all pop up together */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 clamp(1rem, 5vw, 3rem)',
      }}>
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            custom={i}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            onClick={() => setSelected(i)}
            style={{ cursor: 'pointer' }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <PosterCard event={event} atmosphere={POSTER_ATMOSPHERES[i]} />
          </motion.div>
        ))}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected !== null && (
          <EventDetailOverlay
            event={events[selected]}
            atmosphere={POSTER_ATMOSPHERES[selected]}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function PosterCard({
  event,
  atmosphere,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
}) {
  return (
    <div style={{
      height: 'clamp(320px, 45vh, 480px)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07)',
    }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: event.gradient }} />

      {/* Atmospheric layers */}
      {atmosphere.layers.map((layer, li) => (
        <div key={li} style={{ position: 'absolute', inset: 0, background: layer.gradient }} />
      ))}

      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '250px',
      }} />

      {/* Tag row */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontFamily: '-apple-system, sans-serif',
          fontSize: '0.5rem',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
        }}>
          {event.tag}
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: 'rgba(255,255,255,0.12)' }}>
          {atmosphere.symbol}
        </span>
      </div>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: 'rgba(255,255,255,0.95)',
          marginBottom: '0.9rem',
          textShadow: '0 2px 16px rgba(0,0,0,0.5)',
        }}>
          {event.title}
        </p>
        <p style={{
          fontFamily: '-apple-system, sans-serif',
          fontSize: '0.52rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: atmosphere.accent,
          opacity: 0.85,
          marginBottom: '1.4rem',
        }}>
          {event.subtitle}
        </p>
        <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.18)', marginBottom: '1.4rem' }} />
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.6,
          maxWidth: 200,
        }}>
          {event.theme}
        </p>
      </div>

      {/* Tap hint */}
      <div style={{
        position: 'absolute', bottom: 18, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: '-apple-system, sans-serif',
          fontSize: '0.48rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)',
        }}>
          tap to explore
        </span>
      </div>

      {/* Inner shadow frame */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.35)', pointerEvents: 'none' }} />
    </div>
  )
}

function EventDetailOverlay({
  event,
  atmosphere,
  onClose,
}: {
  event: typeof literati.events[0]
  atmosphere: typeof POSTER_ATMOSPHERES[0]
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(4,2,10,0.82)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51,
          width: 'min(560px, 92vw)',
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: '18px',
          background: 'rgba(12,8,22,0.96)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 60px 160px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Header band — uses the event's own gradient */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          height: 180, borderRadius: '18px 18px 0 0',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: event.gradient }} />
          {atmosphere.layers.map((layer, li) => (
            <div key={li} style={{ position: 'absolute', inset: 0, background: layer.gradient }} />
          ))}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Tag */}
          <div style={{ position: 'absolute', top: 20, left: 24 }}>
            <span style={{
              fontFamily: '-apple-system, sans-serif',
              fontSize: '0.5rem',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}>
              {event.tag}
            </span>
          </div>

          {/* Title inside header */}
          <div style={{
            position: 'absolute', bottom: 20, left: 24, right: 60,
          }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              color: 'rgba(255,255,255,0.97)',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              {event.title}
            </p>
            <p style={{
              fontFamily: '-apple-system, sans-serif',
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: atmosphere.accent,
              marginTop: '0.5rem',
            }}>
              {event.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 32px' }}>
          {/* Theme */}
          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.65,
            marginBottom: '1.5rem',
          }}>
            "{event.theme}"
          </p>

          {/* Blurb */}
          <p style={{
            fontFamily: '-apple-system, sans-serif',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.75,
            marginBottom: '2rem',
          }}>
            {event.blurb}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.8rem' }} />

          {/* Detail rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' }}>
            {atmosphere.details.map((d, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.48rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  marginBottom: '0.35rem',
                }}>
                  {d.label}
                </p>
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.85rem',
                  color: atmosphere.accent,
                  lineHeight: 1.45,
                }}>
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
