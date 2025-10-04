/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#00bcd4',
      },
      boxShadow: {
        glow: '0 0 0 2px rgba(0, 188, 212, 0.4)',
      },
    },
  },
  plugins: [],
}
