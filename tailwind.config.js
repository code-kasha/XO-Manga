/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "templates/*.html",
    "templates/**/*.html",
    "templates/**/**/*.html",
    "templates/**/**/**/*.html",
  ],
  theme: {
    extend: {},
    screens: {
      mb: "320px",
      xxs: "400px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("tailwind-scrollbar")],
}
