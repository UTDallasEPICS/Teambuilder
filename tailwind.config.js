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
        teal: 'rgb(98,158,145)',
        shaded: 'rgba(48, 100, 162, 0.3)',
        beige: 'rgb(253,245,217)',
        lightblue:'rgb(111, 201, 216)',
        // pill colors
        magenta: 'rgb(226, 108, 237)',
        green: 'rgb(119, 207, 119)',
        orange: 'rgb(255,160,122)',
        red: 'rgb(235, 100, 100)',
        gray: 'rgb(150,150,150)'
      },
      borderRadius: {
        '10': '10px', 
      },
    },
  },
  
  plugins: [],
}