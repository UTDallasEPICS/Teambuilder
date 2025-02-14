/** @type {import('tailwindcss').Config} */
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
      colors: {
        aqua: '#5B9486',
        shaded: 'rgba(90,90,90,0.5)',
        general: '#E560F1',
        pillText: '#FDF5D9',
      },
      borderRadius: {
        '10': '10px', 
      },
    },
  },
  
  plugins: [],
}


