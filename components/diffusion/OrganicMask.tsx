'use client'

// Injects the SVG filter definitions needed for organic turbulence masking.
// One instance per page is enough — filters are referenced by id from CSS.
export function DiffusionFilterDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', overflow: 'hidden' }}
    >
      <defs>
        {/*
          ink-displace:
          feTurbulence generates a noise field.
          feDisplacementMap pushes every pixel by that noise → organic edges.
          feGaussianBlur softens the result so it reads as diffusion not glitch.
        */}
        <filter
          id="ink-displace"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.006 0.009"
            numOctaves="4"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="140"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="22" result="soft" />
          <feBlend in="soft" in2="displaced" mode="normal" result="merged" />
          <feComposite in="merged" in2="SourceGraphic" operator="in" />
        </filter>

        {/*
          ink-haze:
          Used for the atmospheric color clouds around the photo.
          Heavier displacement, more blur → more ink-in-water feel.
        */}
        <filter
          id="ink-haze"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.010"
            numOctaves="3"
            seed="13"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="180"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="40" />
        </filter>

        {/*
          ink-displace-lite: mobile version — cheaper
        */}
        <filter
          id="ink-displace-lite"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008 0.011"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="14" />
        </filter>
      </defs>
    </svg>
  )
}
