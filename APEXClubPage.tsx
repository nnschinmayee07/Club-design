'use client';

import { useEffect, useRef } from 'react';

import ApexHero          from './components/ApexHero';
import ApexQuote         from './components/ApexQuote';
import ApexAbout         from './components/ApexAbout';
import ApexHowItWorks    from './components/ApexHowItWorks';
import ApexEventsGallery from './components/ApexEventsGallery';
import ApexMemoryLane    from './components/ApexMemoryLane';
import ApexAtmosphere    from './components/ApexAtmosphere';
import ApexRedGlow       from './components/ApexRedGlow';

export default function APEXClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const pageRef       = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    <div ref={pageRef} className="relative bg-[#080808] text-white" style={{ overflowX: 'clip' }}>
      <ApexAtmosphere containerRef={pageRef} />
      <ApexRedGlow endRef={howItWorksRef} />

      <ApexHero />
      <ApexQuote />
      <ApexAbout />
      <ApexHowItWorks sectionRef={howItWorksRef} />
      <ApexEventsGallery />
      <ApexMemoryLane />
    </div>
  );
}
