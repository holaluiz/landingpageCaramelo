/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', 'sans-serif'],
        podium: ['"Montserrat"', '"FSP DEMO - PODIUM Sharp 4.11"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        interTight: ['"Inter Tight"', 'sans-serif'],
        caveat: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
};
