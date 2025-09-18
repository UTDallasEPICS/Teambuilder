/** @type {import('tailwindcss').Config} */

import { colors } from "./utils/colors";

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        jura: ['Jura', 'sans-serif'],
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '128': '32rem',
        '144': '36rem',
      },
      margin: {
        '50' : '50px',
        '25': '25px',
      },
      minWidth: {
        '395': '395px',
      },
      minHeight: {
        '300': '300px',
      },
      colors,
      borderRadius: {
        '10': '10px', 
      },
    },
  },
  
  plugins: [],
}