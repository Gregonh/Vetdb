/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    fontSize: {
      base: '1rem', // Set the base font size to 16px
    },
    extend: {
      fontSize: {
        //for viewport
        'vfont--2': 'var(--vfont--2)',
        'vfont--1': 'var(--vfont--1)',
        'vfont-0': 'var(--vfont-0)',
        'vfont-1': 'var(--vfont-1)',
        'vfont-2': 'var(--vfont-2)',
        'vfont-3': 'var(--vfont-3)',
        'vfont-4': 'var(--vfont-4)',
        'vfont-5': 'var(--vfont-5)',
        //for container
        'cfont--2': 'var(--cfont--2)',
        'cfont--1': 'var(--cfont--1)',
        'cfont-0': 'var(--cfont-0)',
        'cfont-1': 'var(--cfont-1)',
        'cfont-2': 'var(--cfont-2)',
        'cfont-3': 'var(--cfont-3)',
        'cfont-4': 'var(--cfont-4)',
        'cfont-5': 'var(--cfont-5)',
      },
      spacing: {
        //fixed space following a scale
        custom1: '0.25rem',
        custom2: '0.5rem',
        custom3: '0.75rem',
        custom4: '1rem',
        custom6: '1.5rem',
        custom8: '2rem',
        custom12: '3rem',
        custom16: '4rem',
        custom24: '6rem',
        custom32: '8rem',
        custom48: '12rem',
        custom64: '16rem',
        custom96: '24rem',
        custom128: '32rem',
        custom192: '40rem',
        custom256: '48rem',
        //utopia responsive scale according viewport
        'vspace-3xs': 'var(--vspace-3xs)',
        'vspace-2xs': 'var(--vspace-2xs)',
        'vspace-xs': 'var(--vspace-xs)',
        'vspace-s': 'var(--vspace-s)',
        'vspace-m': 'var(--vspace-m)',
        'vspace-l': 'var(--vspace-l)',
        'vspace-xl': 'var(--vspace-xl)',
        'vspace-2xl': 'var(--vspace-2xl)',
        'vspace-3xl': 'var(--vspace-3xl)',

        'vspace-3xs-2xs': 'var(--vspace-3xs-2xs)',
        'vspace-2xs-xs': 'var( --vspace-2xs-xs)',
        'vspace-xs-s': 'var(--vspace-xs-s)',
        'vspace-s-m': 'var(--vspace-s-m)',
        'vspace-m-l': 'var(--vspace-m-l)',
        'vspace-l-xl': 'var( --vspace-l-xl)',
        'vspace-xl-2xl': 'var(--vspace-xl-2xl)',
        'vspace-2xl-3xl': 'var(--vspace-2xl-3xl)',
        'vspace-s-l': 'var(--vspace-s-l)',
        'vspace-2xs-xl': 'var(--vspace-2xs-xl)',

        //utopia responsive scale according container
        'cspace-3xs': 'var(--cspace-3xs)',
        'cspace-2xs': 'var(--cspace-2xs)',
        'cspace-xs': 'var(--cspace-xs)',
        'cspace-s': 'var(--cspace-s)',
        'cspace-m': 'var(--cspace-m)',
        'cspace-l': 'var(--cspace-l)',
        'cspace-xl': 'var(--cspace-xl)',
        'cspace-2xl': 'var(--cspace-2xl)',
        'cspace-3xl': 'var(--cspace-3xl)',

        'cspace-3xs-2xs': 'var(--cspace-3xs-2xs)',
        'cspace-2xs-xs': 'var( --cspace-2xs-xs)',
        'cspace-xs-s': 'var(--cspace-xs-s)',
        'cspace-s-m': 'var(--cspace-s-m)',
        'cspace-m-l': 'var(--cspace-m-l)',
        'cspace-l-xl': 'var( --cspace-l-xl)',
        'cspace-xl-2xl': 'var(--cspace-xl-2xl)',
        'cspace-2xl-3xl': 'var(--cspace-2xl-3xl)',
        'cspace-s-l': 'var(--cspace-s-l)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
