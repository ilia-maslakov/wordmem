import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      /* ▼ добавили короткую вспышку */
      keyframes: {
        "slow-then-fast-fade-in": {
          "0%": { opacity: "0" },
          "70%": { opacity: "0.3" },
          "90%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
        pulseShort: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        "slow-then-fast": "slow-then-fast-fade-in 3s ease-out forwards",
        "pulse-short": "pulseShort 120ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
