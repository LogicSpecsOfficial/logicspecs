/* Version: v1.1.0
   Changelog: Explicitly defined content paths to ensure Turbopack correctly scans for utility classes.
*/

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // Standardizing content paths for Next.js 16 Turbopack
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#2563eb",
          light: "#F5F5F7",
          dark: "#0A0A0B",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;