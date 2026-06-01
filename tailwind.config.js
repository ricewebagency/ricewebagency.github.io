/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      keyframes: {
        'menu-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'menu-fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'menu-panel-in': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'menu-panel-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(60px)' },
        },
        'menu-item-in': {
          '0%': { opacity: '0', transform: 'translateX(-16px) scale(0.95)' },
          '60%': { opacity: '1', transform: 'translateX(4px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'menu-item-out': {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to: { opacity: '0', transform: 'translateX(12px) scale(0.97)' },
        },
      },
      animation: {
        'menu-fade-in': 'menu-fade-in 250ms ease-out both',
        'menu-fade-out': 'menu-fade-out 220ms ease-in both',
        'menu-panel-in': 'menu-panel-in 380ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'menu-panel-out': 'menu-panel-out 230ms ease-in both',
        'menu-item-in': 'menu-item-in 290ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'menu-item-out': 'menu-item-out 180ms ease-in both',
      },
    },
  },
  plugins: [],
};
