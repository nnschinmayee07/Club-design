'use client';
    import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
    interface Props { containerRef?: React.RefObject<HTMLElement | null>; }
    export default function ApexAtmosphere({ containerRef: _containerRef }: Props) {
    const reducedMotion = useReducedMotion();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 260, 760, 2400], [0, 0, 0.34, 0.18]);
    const scale = useTransform(scrollY, [260, 1100], [1.12, 1]);
    const x = useTransform(scrollY, [260, 1600], ['-3%', '4%']);
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <svg className="absolute h-0 w-0"><defs><filter id="apex-diffuse" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="7" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="34" xChannelSelector="R" yChannelSelector="G" /><feGaussianBlur stdDeviation="24" /></filter></defs></svg>
        <motion.div style={{ opacity, scale: reducedMotion ? 1 : scale, x: reducedMotion ? 0 : x, filter: 'url(#apex-diffuse)' }} className="absolute -inset-[18%] mix-blend-screen"><video src="/videos/apex-hero.mp4" autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" style={{ maskImage: 'radial-gradient(ellipse at center, black 8%, transparent 74%)', filter: 'saturate(1.35) brightness(0.48)' }} /></motion.div>
        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E")' }} />
      </div>
    );
    }
    