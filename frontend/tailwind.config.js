/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "secondary": "#006c49",
        "secondary-container": "#6cf8bb",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#00714d",
        "secondary-fixed": "#6ffbbe",
        "tertiary": "#684000",
        "tertiary-container": "#885500",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffd4a4",
        "tertiary-fixed": "#ffddb8",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "surface": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#464555",
        "outline": "#777587",
        "outline-variant": "#c7c4d8",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "full": "9999px"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
