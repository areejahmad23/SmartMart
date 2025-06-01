/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind applies styles to your React components
  ],
  theme: {
    extend: {
      screens: {
        'xl': {'max': '1200px'},
        'lg': {'max': '1080px'},
        'md-lg': {'max': '991px'},
        'md': {'max': '786px'},
        'sm': {'max': '576px'},
        'xs': {'max': '480px'},
        '2xs': {'max': '340px'}, 
      }
    },
  },
  plugins: [],
};
