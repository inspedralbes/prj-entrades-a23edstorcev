/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-tertiary-fixed-variant": "#4600a8",
        "error-container": "#a70138",
        "surface-tint": "#f382ff",
        "outline-variant": "#40485d",
        "inverse-on-surface": "#4d556b",
        "surface-container": "#0f1930",
        "surface": "#060e20",
        "on-tertiary-container": "#000000",
        "on-surface": "#dee5ff",
        "tertiary-fixed-dim": "#b091ff",
        "on-secondary": "#004b58",
        "on-secondary-fixed-variant": "#005969",
        "surface-container-low": "#091328",
        "on-tertiary-fixed": "#1f0052",
        "error-dim": "#d73357",
        "surface-container-high": "#141f38",
        "on-error": "#490013",
        "surface-dim": "#060e20",
        "background": "#060e20",
        "on-tertiary": "#280067",
        "primary-fixed": "#ed69ff",
        "on-surface-variant": "#a3aac4",
        "surface-container-highest": "#192540",
        "secondary-dim": "#40ceed",
        "on-primary-fixed-variant": "#51005d",
        "on-error-container": "#ffb2b9",
        "on-primary-container": "#41004c",
        "on-secondary-fixed": "#003a45",
        "primary": "#f382ff",
        "secondary": "#53ddfc",
        "primary-container": "#ed69ff",
        "on-primary-fixed": "#000000",
        "primary-dim": "#ec63ff",
        "tertiary-container": "#8f60fa",
        "primary-fixed-dim": "#e451f9",
        "tertiary": "#ac8aff",
        "inverse-primary": "#a300bb",
        "on-primary": "#540061",
        "tertiary-fixed": "#bda2ff",
        "secondary-container": "#00687a",
        "on-background": "#dee5ff",
        "secondary-fixed": "#65e1ff",
        "secondary-fixed-dim": "#48d4f3",
        "surface-container-lowest": "#000000",
        "error": "#ff6e84",
        "inverse-surface": "#faf8ff",
        "tertiary-dim": "#8455ef",
        "on-secondary-container": "#ecfaff",
        "outline": "#6d758c",
        "surface-bright": "#1f2b49",
        "surface-variant": "#192540"
      },
      "fontFamily": {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      "animation": {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      "keyframes": {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}
