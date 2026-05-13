/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pergaminho: '#F4ECD8',
        prensa: '#1A1A1A',
        'ouro-velho': '#B8860B',
        'sangue-boi': '#8B0000',
        madeira: '#4A3728',
      },
      fontFamily: {
        sans: ['Special Elite', 'Courier Prime', 'monospace'],
        serif: ['Cinzel', 'Old Standard TT', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/parchment.png')",
      }
    },
  },
  plugins: [],
}
