/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  safelist: [
    // Safe-list AQI indicator border & text utility classes
    'text-emerald-500', 'border-emerald-500', 'bg-emerald-500/10',
    'text-lime-500', 'border-lime-500', 'bg-lime-500/10',
    'text-amber-500', 'border-amber-500', 'bg-amber-500/10',
    'text-orange-500', 'border-orange-500', 'bg-orange-500/10',
    'text-red-500', 'border-red-500', 'bg-red-500/10',
    'text-purple-500', 'border-purple-500', 'bg-purple-500/10',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060B14',
          900: '#0A1220', // base background
          850: '#101A2E', // surface cards
          800: '#15223B', // elevated cards / hover
          750: '#1A2A47',
          700: '#223659',
          600: '#2E4774',
        },
        brand: {
          teal: '#14B8A6',
          emerald: '#10B981',
          blue: '#3B82F6',
          dark: '#0B3B5A',
        },
        cpcb: {
          good: '#00A651',
          satisfactory: '#8DC63F',
          moderate: '#F4C20D',
          poor: '#F58220',
          veryPoor: '#E03C31',
          severe: '#9B1C31',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px -5px rgba(20, 184, 166, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'smog-drift': 'drift 24s ease-in-out infinite alternate',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'scale(1) translate(0%, 0%)' },
          '50%': { transform: 'scale(1.05) translate(2%, 1%)' },
          '100%': { transform: 'scale(1) translate(-1%, 2%)' },
        },
      },
    },
  },
  plugins: [],
}
