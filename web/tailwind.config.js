/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carvao: {
          900: '#18181B', // zinc-900
          950: '#09090B', // zinc-950
        },
        brasa: {
          500: '#F97316', // orange-500
          600: '#EA580C', // orange-600
          700: '#C2410C', // orange-700
        },
        offwhite: '#F5F5F4', // stone-100
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
