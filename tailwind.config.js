/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        colors: {
         'salmon': "#F5D8DA",
         'gray-500': '#505050',
         'wine-light': '#A66576',
         'wine-black': '#995A6A',
         'gray-white-1': '#d9d9d9',
         'gray-white-2': '#f5f5f5',
        }
      },    
    }
}
