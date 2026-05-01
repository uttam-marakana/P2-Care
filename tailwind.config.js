const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-teal': '#1ca39c',
        'brand-navy': '#215262',
        'brand-blue': '#235e7d',
        'brand-sky': '#3ebaff',
        'brand-orange': '#f17732',
        'brand-dark': '#2f3b4c',
        'brand-gray': '#707070',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Sora', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(13, 148, 136, 0.10)',
        glow: '0 0 30px 5px rgba(28, 163, 156, 0.25)',
        nav: '0 2px 20px 0 rgba(0, 0, 0, 0.08)',
      },
      screens: {
        xs: '420px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};