/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf9f5',
          100: '#f5f0e6',
          200: '#ebdcc7',
          300: '#dfc2a0',
          400: '#d0a274',
          500: '#c2854f',
          600: '#ab6e40',
          700: '#8b5434',
          800: '#71442f',
          900: '#5c3929',
          950: '#341d14',
        }
      }
    },
  },
  plugins: [],
};
