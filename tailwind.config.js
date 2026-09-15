/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0D1B2A",
          soft: "#16324A",
        },
        cream: {
          DEFAULT: "#fff",
          dark: "#F0E8D8",
        },
        rust: {
          DEFAULT: "#E2591B",
          dark: "#B8430F",
          light: "#F4793B",
        },
        kraft: {
          DEFAULT: "#C99049",
          light: "#E3B77E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px -12px rgba(13, 27, 42, 0.18)",
        lift: "0 24px 60px -16px rgba(13, 27, 42, 0.28)",
      },
    },
  },
  plugins: [],
};
