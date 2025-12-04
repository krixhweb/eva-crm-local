/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#000000",
          surface: "#18181b",
          surfaceHover: "#27272a",
          border: "#27272a",
          text: "#e4e4e7",
          muted: "#a1a1aa"
        }
      }
    }
  },
  plugins: []
};
