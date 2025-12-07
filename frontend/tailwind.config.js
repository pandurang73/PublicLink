/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#1ABC9C',
        background: '#F4F6F8',
      },
    },
  },
  plugins: [],
}
