/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#F9FAFB',
        danger: '#E11D48',
        income: '#10B981',
        expense: '#F43F5E',
        'page-bg': '#F3F4F6',
        'card-bg': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
