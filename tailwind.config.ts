import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#040706",
        ink: "#08100d",
        emerald: "#2fc48d",
        gold: "#e7c58d",
        ivory: "#f7ead8"
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 45px rgba(47, 196, 141, 0.22)",
        gold: "0 0 35px rgba(231, 197, 141, 0.18)"
      },
      backgroundImage: {
        "luxury-radial":
          "radial-gradient(circle at 20% 10%, rgba(47,196,141,.18), transparent 28%), radial-gradient(circle at 78% 22%, rgba(231,197,141,.12), transparent 26%), linear-gradient(145deg, #020403 0%, #07100d 48%, #020403 100%)"
      }
    }
  },
  plugins: [forms]
};

export default config;
