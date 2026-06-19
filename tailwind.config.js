/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Suppress unknown utility warnings for custom/gradient classes
  safelist: [
    {
      pattern: /bg-gradient-to-/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /bg-linear-to-/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /px-/,
      variants: ['hover', 'focus', 'md', 'lg'],
    },
  ],
}
