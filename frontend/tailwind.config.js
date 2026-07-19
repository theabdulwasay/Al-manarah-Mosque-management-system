/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#0E2E29',
          50: '#E8EFED',
          100: '#C7DAD5',
          200: '#93B5AC',
          300: '#5F8F83',
          400: '#356B5D',
          500: '#0E2E29',
          600: '#0C2823',
          700: '#0A211D',
          800: '#071A16',
          900: '#05120F',
        },
        brass: {
          DEFAULT: '#B8892B',
          50: '#FBF3E3',
          100: '#F3E0BB',
          200: '#E7C687',
          300: '#DBAC53',
          400: '#C99B3A',
          500: '#B8892B',
          600: '#976F22',
          700: '#75561B',
          800: '#533D13',
          900: '#31240B',
        },
        ivory: '#FAF7F0',
        sage: '#6B8F71',
      },
      fontFamily: {
        display: ['"Amiri"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'star-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23B8892B' stroke-opacity='0.08' stroke-width='1'%3E%3Cpath d='M30 2 L36 20 L54 20 L40 32 L46 50 L30 38 L14 50 L20 32 L6 20 L24 20 Z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
