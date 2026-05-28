/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          fondo: "rgb(var(--color-fondo) / <alpha-value>)",
          primario: "rgb(var(--color-primario) / <alpha-value>)",
          secundario: "rgb(var(--color-secundario) / <alpha-value>)",
          input: "rgb(var(--color-input) / <alpha-value>)",
          botonh: "rgb(var(--boton-hover) / <alpha-value>)",
        },        
      },
    },
  },
  plugins: [],
};