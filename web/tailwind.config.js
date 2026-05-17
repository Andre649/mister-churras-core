/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        papel: '#E8E2D2',
        pergaminho: '#DCD7C9',
        'sangue-boi': '#8E2B0C',
        madeira: '#4A3728',
        prensa: '#1A1A1A',
        cafe: '#5D4037',
        'ouro-velho': '#B8860B',
        brasa: {
          500: '#8E2B0C', // Now using Sangue Boi as default Brasa
          600: '#4A3728',
          700: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
