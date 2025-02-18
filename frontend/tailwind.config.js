/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          dark: "#1565c0",
          light: "#42a5f5",
        },
      },
    },
  },
  plugins: [],
};
