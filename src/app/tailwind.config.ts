/* Version: v1.0.0
   Changelog: Enabled class-based Dark Mode and injected custom LogicSpecs hardware-themed colors.
*/

import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Enable Class-based Dark Mode
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Linked to the variable defined in layout.tsx
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // LogicSpecs Custom Hardware Palette
        brand: {
          blue: "#2563eb",
          light: "#F5F5F7", // Apple-style light gray
          dark: "#0A0A0B",  // OLED-friendly charcoal
        },
      },
      // 2026 Glassmorphism Utilities
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;