import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#FDFAF7',
        charcoal: '#1C1C1A',
        gold: '#B8975A',
        'gold-light': '#D4B483',
        'warm-gray': '#8A8479',
        'ashley-orange': '#F48120',
        cream: '#F7F3EE',
        deep: '#0F0F0D',
        sage: '#7A8C76',
        blush: '#D4B8A8',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8975A 0%, #D4B483 50%, #B8975A 100%)',
      },
    },
  },
  plugins: [],
}

export default config
