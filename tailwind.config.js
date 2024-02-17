/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'salmon-light': '#F5D8DA',
        'vinho-principal': '#A66576',
        'gray-princpial': '#505050',
        'gray-white-1': '#d9d9d9',
        'gray-white-2': '#f5f5f5'

    },
  },
  plugins: [],
}

