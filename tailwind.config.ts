import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#5CE3A2",
          "green-light": "#76E6B1",
          "green-bright": "#73FB89",
          purple: "#882EFD",
          blue: "#478AED",
          cyan: "#2ADEE8",
          mint: "#63FFAC",
          yellow: "#ECFF6D",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.06)",
          light: "rgba(255,255,255,0.1)",
          dark: "rgba(0,0,0,0.04)",
          muted: "rgba(0,0,0,0.06)",
        },
        text: {
          primary: "rgba(0,0,0,0.8)",
          secondary: "rgba(0,0,0,0.6)",
          muted: "rgba(0,0,0,0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "ui-rounded", "system-ui", "sans-serif"],
        display: ["var(--font-louize)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
