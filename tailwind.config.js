/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'tablet': '768px',
      'l': '1440px',
      'xl': '1600px'
    },
    extend: {
      colors: {
        'light-green': '#00E45B',
        'background-color': '#262A34',
        'navbar-color': '#323644',
        'grey': '#6A6A6A'
      }
    },
  },
  plugins: [],
}