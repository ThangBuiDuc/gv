/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily:{
        montserrat : ['Montserrat']
      },
      colors: {
        primary:'#0083C2',
        hovercl: 'rgba(0, 0, 0, 0.05)',
        bordercl: 'rgba(0, 0, 0, 0.1)',
        calendarBoder: '#27aecb'
      },
      transitionProperty:{
        'height': 'max-height',
      }
    },
  },
  plugins: [],
}