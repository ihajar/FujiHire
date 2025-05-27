/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rametto: ["RamettoOne"],
      },
      colors: {
        primary: '#3b308e',
        secondary: '#EC3E72',
        accent: '#D4F6ED',
        pink: '#FADBF1',
        blackish: '#070707'
      },
    },
  },
  plugins: [],
}