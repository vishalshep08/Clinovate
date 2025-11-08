/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          light: "#E0F7F4",
          DEFAULT: "#2EBFA5",
          dark: "#1E8C7B",
        },
      },
    },
  },
  plugins: [],
};
