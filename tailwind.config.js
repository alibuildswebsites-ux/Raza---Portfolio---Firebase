
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: 'var(--color-pastel-blue)',
          lavender: 'var(--color-pastel-lavender)',
          mint: 'var(--color-pastel-mint)',
          peach: 'var(--color-pastel-peach)',
          cream: 'var(--color-pastel-cream)',
          gray: 'var(--color-pastel-gray)',
          charcoal: 'var(--color-pastel-charcoal)',
          dark: 'var(--color-pastel-dark)',
          surface: 'var(--color-pastel-surface)'
        },
        footer: {
          bg: 'var(--color-footer-bg)',
          text: 'var(--color-footer-text)',
          muted: 'var(--color-footer-muted)',
          shadow: 'var(--color-footer-shadow)'
        }
      },
      fontFamily: {
        pixel: ['"VT323"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px var(--shadow-color)',
        'pixel-sm': '2px 2px 0px 0px var(--shadow-color)',
        'pixel-lg': '6px 6px 0px 0px var(--shadow-color)',
        'pixel-press': '1px 1px 0px 0px var(--shadow-color)',
      }
    },
  },
  plugins: [],
}
