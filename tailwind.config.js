/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          950: '#070D1E',
          900: '#0B132B',
          850: '#111C3D',
          800: '#1C2541',
          750: '#233154',
          700: '#3A506B',
          teal: {
            deep: '#082f38',
            dark: '#0B3C49',
            medium: '#134E5E',
            light: '#1B6A80'
          },
          cyan: {
            accent: '#00F0FF',
            muted: '#38BDF8',
            glow: 'rgba(56, 189, 248, 0.25)'
          },
          success: '#10B981',
          warning: '#F59E0B',
          risk: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'pillar': '0 10px 30px -10px rgba(7, 13, 30, 0.8), 0 0 1px 1px rgba(56, 189, 248, 0.15)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
