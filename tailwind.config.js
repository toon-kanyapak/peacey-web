/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8FAF8',
          dark: '#121614',
        },
        sage: {
          50: '#F1F6F3',
          100: '#DDEAE3',
          200: '#C0D8CC',
          300: '#A4C3B2',
          400: '#85AC97',
          500: '#6B9080',
          600: '#557466',
          700: '#425C51',
          800: '#31453D',
          900: '#22302A',
        },
        moss: '#A4C3B2',
        terracotta: {
          light: '#EDA791',
          DEFAULT: '#E07A5F',
          dark: '#C05C42',
        },
        lavender: '#C6AC8F',
        ink: '#2D3A34',
        mist: '#5F726A',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        blob: '3rem',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(45, 58, 52, 0.12)',
        lift: '0 18px 48px -20px rgba(45, 58, 52, 0.28)',
        glow: '0 0 60px -12px rgba(107, 144, 128, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%, -4%, 0) scale(1.06)' },
          '66%': { transform: 'translate3d(-3%, 3%, 0) scale(0.96)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Infinite loops live in CSS, never in framer-motion: a looping
        // framer animation inside an exiting <AnimatePresence> child never
        // reports exit-complete, which deadlocks mode="wait".
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.65' },
          '50%': { transform: 'scale(1.18)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.12' },
        },
        soundBar: {
          '0%, 100%': { height: '30%' },
          '25%': { height: '100%' },
          '50%': { height: '45%' },
          '75%': { height: '85%' },
        },
        thinkPulse: {
          '0%': { opacity: '0', transform: 'translateX(-6px)' },
          '25%, 60%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0.3', transform: 'translateX(0)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'drift-slow': 'driftSlow 26s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out both',
        'pulse-soft': 'pulseSoft 2.8s ease-in-out infinite',
        blink: 'blink 0.9s ease-in-out infinite',
        'sound-bar': 'soundBar 1.4s ease-in-out infinite',
        'think-pulse': 'thinkPulse 2.2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
