/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        primary: '#43766C',
        secondary: '#B19470',
        accent: '#76453B',
        background: '#F8FAE5',
        text: '#272727',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwind-scrollbar-hide'),
  ],
};
