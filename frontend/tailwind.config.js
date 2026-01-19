/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#0a0a0a",
          dark: "#121212",
          red: "#ff003c",
          neon: "#39ff14",
        }
      }
    },
  },
  plugins: [],
}