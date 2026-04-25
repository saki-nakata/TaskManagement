/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        bg: '#F4F5F7',
        surface: '#FFFFFF',
        'col-bg': '#EBECF0',
        border: '#DFE1E6',
        text: '#172B4D',
        'text-sub': '#6B778C',
      },
    },
  },
  plugins: [],
}
