'use client'

// SVG filter definitions for the diffusion system.
// ink-develop: applied to the photo layer — displaces its mask edge irregularly
// ink-atmosphere: applied to color haze clouds — heavily blurs and distorts them
// Keep this component mounted once at the top of the page.
export function DiffusionFilterDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', overflow: 'hidden' }}
    >
      <defs>
        {/* Photo edge distortion — turbulence displaces the mask boundary */}
        <filter
          id="ink-develop"
          x="-45%" y="-45%"
          width="190%" height="190%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.0055 0.008"
            numOctaves="5"
            seed="12"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="160"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="18" result="soft" />
          <feComposite in="soft" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Color atmosphere distortion — very heavy blur, used on haze clouds */}
        <filter
          id="ink-atmosphere"
          x="-60%" y="-60%"
          width="220%" height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.009"
            numOctaves="3"
            seed="5"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="50" />
        </filter>

        {/* Lite version for reduced-motion / mobile */}
        <filter
          id="ink-develop-lite"
          x="-30%" y="-30%"
          width="160%" height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008 0.011"
            numOctaves="2"
            seed="12"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="10" />
        </filter>
      </defs>
    </svg>
  )
}
