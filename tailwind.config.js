/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          red: {
            DEFAULT: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
            deep: '#991B1B',
            border: '#B91C1C',
            bg: '#FEF2F2'
          },
          yellow: {
            DEFAULT: '#FACC15',
            light: '#FDE047',
            dark: '#EAB308',
            deep: '#854D0E',
            border: '#CA8A04',
            bg: '#FEFCE8'
          },
          blue: {
            DEFAULT: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
            deep: '#1E40AF',
            border: '#1D4ED8',
            bg: '#EFF6FF'
          },
          green: {
            DEFAULT: '#10B981',
            light: '#34D399',
            dark: '#059669',
            deep: '#065F46',
            border: '#047857',
            bg: '#ECFDF5'
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'block-red': '0 6px 0 #991b1b, 0 10px 15px -3px rgba(239, 68, 68, 0.35)',
        'block-yellow': '0 6px 0 #a16207, 0 10px 15px -3px rgba(234, 179, 8, 0.35)',
        'block-blue': '0 6px 0 #1e40af, 0 10px 15px -3px rgba(37, 99, 235, 0.35)',
        'block-green': '0 6px 0 #065f46, 0 10px 15px -3px rgba(16, 185, 129, 0.35)',
        'tactile': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'pop': '0 12px 24px -6px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
