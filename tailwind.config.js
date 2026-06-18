/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#E9F2EE', 100: '#D2E5DC', 500: '#1E6B4F', 700: '#15503B', 800: '#103D2E' },
        mint: { bg: '#DCEFE6', icon: '#43A884', text: '#1B6B4F' },
        sky: { 50: '#EAF2FE', 700: '#1D4ED8' },
        warn: { bg: '#F4E6C8', text: '#9A6B1E' },
        ink: '#15171A', muted: '#6B7280', line: '#E8EAED',
        surface: '#FFFFFF', 'surface-muted': '#F6F7F8',
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'] },
      borderRadius: { card: '16px' },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)' },
      maxWidth: { app: '440px' },
    },
  },
  plugins: [],
}