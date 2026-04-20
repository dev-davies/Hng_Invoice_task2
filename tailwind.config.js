/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-purple': '#7C5DFA',
        'light-purple': '#9277FF',
        'dark-bg': '#141625',
        'component-bg': '#1E2139',
        'text-light': '#DFE3FA',
        'text-dark': '#0C0E16',
        'danger': '#EC5757',
        'danger-hover': '#FF9797',
      },
      fontFamily: {
        sans: ['"League Spartan"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


