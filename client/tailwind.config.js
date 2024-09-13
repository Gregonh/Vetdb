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
      fontFamily: {
        'family-display': 'Linotte-Semibold, ui-serif',
        'family-secondary': 'OpenSans-SemiBold, Open Sans, system-ui',
        'family-body': 'Inter-Regular, system-ui, sans-serif',
        'family-caption': 'Inter-Light, system-ui',
        'family-subtitle': 'Inter-SemiBold, system-ui',
        'family-subtitletwo': 'Inter-Bold, system-ui',
      },
      fontSize: {
        //for viewport
        'vfont--3': 'var(--vfont--3)' /*overline*/,
        'vfont--2': 'var(--vfont--2)' /*caption*/,
        'vfont--1': 'var(--vfont--1)' /*body2, subtitle2, secondary*/,
        'vfont-0': 'var(--vfont-0)' /*body, subtitle1, */,
        'vfont-1': 'var(--vfont-1)' /* headers levels*/,
        'vfont-2': 'var(--vfont-2)',
        'vfont-3': 'var(--vfont-3)',
        'vfont-4': 'var(--vfont-4)',
        'vfont-5': 'var(--vfont-5)',
        //for container
        'cfont--3': 'var(--cfont--3)',
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
        //by topics
        'default-top-margin': 'var(--default-top-margin)',
        'root-gutter-space': 'var(--root-grid-gutter)', //can be: --vspace-m (in >= 1920) or --vspace-xs-m (in <1920)
        'container-default-padding': 'var(--container-default-padding)', // + drastic
        'header-default-padding': 'var(--header-default-padding)', //for now same as container-default-padding
        'footer-top-margin': 'var(--footer-top-margin)',
        'min-height-nav': 'var(--min-height-nav)',
        'min-height-footer': 'var(--min-height-nav)',

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
        'vspace-m-xl': 'var(--vspace-m-xl)',
        'vspace-l-2xl': 'var(--vspace-l-2xl)',
        'vspace-xs-m': 'var(--vspace-xs-m)',

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
      },
      maxWidth: {
        'root-container': 'var(--root-grid-max-width)',
        // for line-length, alternative to use max-w-prose that always give 65ch width or the line-length-grid css class
        'readable-vdiv': '34em', //68 characters if we consider 1 character is more or less 0.5em
      },
      colors: {
        elements: {
          background: 'var(--color-bg)',
          headline: 'var(--color-head)',
          paragraph: 'var(--color-paragraph)',
          link: 'var(--color-link)',
          subheadline: 'var(--color-head)',
          hover: 'var(--color-hover)',
        },
        card: {
          cardbackground: 'var(--color-card-bg)',
          cardheading: 'var(--color-card-heading)',
          cardparagraph: 'var(--color-card-text)',
          cardhighlight: 'var(--color-card-highlight)',
          cardtagbackground: 'var(--color-card-tag-bg)',
          cardtagtext: 'var(--color-card-tag-text)',
        },
        button: {
          button: 'var(--color-button)',
          buttontext: 'var(--color-button-text)',
          hoverbutton: 'var(--color-button-hover-bg)',
          hoverbuttontext: 'var(--color-button-hover-text)',
        },
        form: {
          background: 'var(--color-form-background)',
          input: 'var(--color-form-input)',
          labelplaceholder: 'var(--color-form-labelplaceholder)',
        },
        // icons or illustrations
        icons: {
          stroke: 'var(--color-icons-stroke)',
          main: 'var(--color-icons-main)',
          highlight: 'var(--color-icons-highlight)',
          secondary: 'var(--color-icons-secondary)',
          tertiary: 'var(--color-icons-tertiary)',
        },
        footer: {
          background: 'var(--color-footer-background)',
          headline: 'var(--color-footer-headline)',
          paragraph: 'var(--color-footer-paragraph)',
          links: 'var(--color-footer-links)',
          hover: 'var(--color-footer-hover)',
        },
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
