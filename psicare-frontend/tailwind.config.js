/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        // Paleta PsiCare 3.0 - Baseada no #2ca77a
        primary: {
          50: "#f0fdf9",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#2ca77a", // Sua cor original (ajustada para ser o centro)
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
          DEFAULT: "#2ca77a",
        },
        // Cinzas neutros para UI profissional (Slate)
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          DEFAULT: "#1f2937",
        },
        background: "#f8fafc", // Fundo levemente frio
        surface: "#ffffff",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        card: "0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)",
        "card-hover": "0 0 0 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
