/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sys-dark': '#0D0D0D',
        'sys-dark-secondary': '#141414',
        'sys-light': '#FAFAFA',
        'wood': {
          light: '#CCCCCC',
          accent: '#FFFFFF',
          dark: '#1F1F1F',
          deep: '#0F0F0F',
          subtle: 'rgba(255, 255, 255, 0.08)',
        },
        'text-primary': '#FAFAFA',
        'text-secondary': '#B3B3B3',
        'text-muted': '#737373',
        'text-dark': '#0D0D0D',
        'text-dark-muted': '#555555',
      },
      fontFamily: {
        serif: ['"Magistral"', '"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Magistral"', '"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
