/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg1: "1024px",

      lg: "1025px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
      smallTablet: "600px",
    },
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
      },
      colors: {
        primary: "#0083C2",
        hovercl: "rgba(0, 0, 0, 0.05)",
        bordercl: "rgba(0, 0, 0, 0.1)",
        calendarBoder: "#27aecb",
        overlay: "rgba(0,0,0,.5)",
      },
      transitionProperty: {
        height: "max-height",
      },
    },
  },
  plugins: [require("tailwindcss-aria-attributes")],
};
