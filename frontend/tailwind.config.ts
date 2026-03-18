import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B1220', // dark shell like Grafana
          panel: '#0F172A',
          panel2: '#0B1020',
        },
        border: 'rgba(148,163,184,0.14)',
      },
      boxShadow: {
        panel: '0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config

