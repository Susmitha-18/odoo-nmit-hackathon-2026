/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce5fe',
          300: '#c3d2fd',
          400: '#a1b7fc',
          500: '#7090fa',
          600: '#4c6bf6',
          700: '#3b54e1',
          800: '#3244b7',
          900: '#2d3c92',
          950: '#1f2659',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
