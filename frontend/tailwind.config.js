/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind applies styles to your React components
  ],
  theme: {
    extend: {
      screens: {
        '2xl': {'min': '1536px'},
        'xl': {'min': '1280px'},
        'lg': {'min': '1024px'},
        'md': {'min': '768px'},
        'sm': {'min': '640px'},
        // Custom breakpoints if needed
        'md-lg': {'min': '992px'},
      }
    },
  },
  plugins: [],
};
