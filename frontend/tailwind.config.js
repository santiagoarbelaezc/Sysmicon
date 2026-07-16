/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sys-dark': '#002345',
        'sys-dark-secondary': '#001A33',
        'sys-light': '#FFFFFF',
        'dark-blue': '#002345',
        'gray-blue': '#4C7AA6',
        'pale-blue': '#C2E1FF',
        'dark-gray': '#242424',
        'light-gray': '#D9D9D9',
        'wood': {
          light: '#D9D9D9',
          accent: '#C2E1FF',
          dark: '#4C7AA6',
          deep: '#002345',
          subtle: 'rgba(194, 225, 255, 0.15)',
        },
        'text-primary': '#FFFFFF',
        'text-secondary': '#C2E1FF',
        'text-muted': '#D9D9D9',
        'text-dark': '#002345',
        'text-dark-muted': '#4C7AA6',
      },
      fontFamily: {
        serif: ['"Exo 2"', '"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Exo 2"', '"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        cad: '0.18em',
        technical: '0.22em',
        display: '-0.03em',
      },
      boxShadow: {
        'sm-custom': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'md-custom': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'lg-custom': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'gold': '0 8px 25px rgba(0, 0, 0, 0.5)',
        'glass': '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.05)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        zoomSlow: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        slideProgress: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        scrollDown: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '50.1%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        }
      },
      animation: {
        'zoom-slow': 'zoomSlow 20s infinite alternate ease-in-out',
        'progress': 'slideProgress 3.5s linear infinite',
        'scroll-down': 'scrollDown 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
