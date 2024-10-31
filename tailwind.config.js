/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        jura: ['Jura', 'sans-serif'], // Add Jura font here
      },
      spacing: {
      '13': '3.25rem',
      '15': '3.75rem',
      '128': '32rem',
      '144': '36rem',
      },
      margin: {
        '50' : '50px',
      },
      minWidth: {
        '395': '395px', // Add minimum width
      },
      minHeight: {
        '300': '300px', // Add minimum height
      },
      margin: {
        '25': '25px', // Add margin-right
      },
      colors: {
        aqua: '#00FFFF', // Add your desired aqua color here
      },
      borderRadius: {
        '10': '10px', 
      },
    },
  },
  
  plugins: [],
}

