import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ground: '#100e0a',
        surface: '#1a1711',
        'surface-2': '#221f18',
        ink: '#f0ead8',
        'ink-muted': '#a09880',
        'ink-dim': '#5a5548',
        accent: '#c97d2e',
        'accent-hover': '#d98f3e',
        verdigris: '#5a8a6e',
        'verdigris-light': '#7aaa8e',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        'widest-2': '0.3em',
      },
    },
  },
  plugins: [],
}

export default config
