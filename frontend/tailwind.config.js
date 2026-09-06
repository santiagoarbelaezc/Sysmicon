/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'admin': {
          50: '#fafafa',
          100: '#f5f5f5',
          150: '#ededed',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
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
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        cad: '0.18em',
        technical: '0.22em',
        display: '-0.03em',
        architect: '0.25em',
        ultra: '0.3em',
      },
      boxShadow: {
        'sm-custom': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'md-custom': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'lg-custom': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'gold': '0 8px 25px rgba(0, 0, 0, 0.5)',
        'glass': '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.05)',
        'admin-card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'admin-card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'admin-floating': '0 20px 35px -10px rgba(0, 0, 0, 0.08)',
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
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'zoom-slow': 'zoomSlow 20s infinite alternate ease-in-out',
        'progress': 'slideProgress 3.5s linear infinite',
        'scroll-down': 'scrollDown 2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
