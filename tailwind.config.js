import { grey } from '@mui/material/colors';

/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#468585', // Light background 468585--dark green
          dark: '#468585', // Dark background
          text: '#6b7280', // Light text
          text_dark: '#d1d5db', // Dark text
          primary: '#1e3a8a', // Primary (blue-700)
          primary_dark: '#1d4ed8', // Dark primary (blue-600)
          primary_hover: '#9CDBA6', // Hover primary (blue-800)
        },
        primary: {
         g1: '#DEF9C4',
          g2: '#9CDBA6',
          g3: '#50B498',
          g4: '#468585'
        },
       
      },
    },
  },
  plugins: [],
};


