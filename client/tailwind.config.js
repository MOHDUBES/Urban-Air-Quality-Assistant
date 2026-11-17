/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  safelist: [
    // AQI color classes — green
    'bg-green-50', 'text-green-700', 'border-green-400', 'bg-green-500',
    // lime
    'bg-lime-50', 'text-lime-700', 'border-lime-400', 'bg-lime-500',
    // yellow
    'bg-yellow-50', 'text-yellow-700', 'border-yellow-400', 'bg-yellow-500',
    // orange
    'bg-orange-50', 'text-orange-700', 'border-orange-400', 'bg-orange-500',
    // red
    'bg-red-50', 'text-red-700', 'border-red-400', 'bg-red-500',
    // purple
    'bg-purple-50', 'text-purple-700', 'border-purple-400', 'bg-purple-500',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
