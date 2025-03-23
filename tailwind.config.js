/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#f43f5e",
          secondary: "#3b82f6",
          background: "#f9fafb",
          dark: "#111827"       // almost black
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"]
        },
        animation: {
          'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }