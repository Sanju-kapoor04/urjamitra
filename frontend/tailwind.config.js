/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#14243A',
          blue: '#2563EB',
          teal: '#14B8A6',
          bg: '#F7F9FC',
          card: '#FFFFFF',
          text: '#1E293B',
          warning: '#F59E0B',
          danger: '#DC2626',
          success: '#16A34A'
        }
      }
    },
  },
  plugins: [],
}
