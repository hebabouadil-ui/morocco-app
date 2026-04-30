/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#B7472A',
          dark: '#8E331E',
          50: '#FBEFEA',
        },
        gold: { DEFAULT: '#C9A66B', dark: '#A38247' },
        ivory: '#F5EDE0',
        cream: '#FBF6EC',
        charcoal: { DEFAULT: '#1A1612', soft: '#2a2520' },
        line: '#E5DDD0',
        muted: '#7a6e5d',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wide-1': '0.05em',
        'wide-2': '0.1em',
        'wide-3': '0.2em',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 12s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
};
