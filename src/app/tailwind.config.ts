/* Version: v1.2.0
   Changelog: Simplified config to act as fallback for Next.js 16 / Tailwind v4.
*/

import type { Config } from "tailwindcss";

const config: Config = {
  // We keep this for dark mode strategy, but variables move to globals.css
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Broadest possible scan to prevent style purging
  ],
  theme: {
    extend: {
      // Fallback extensions if v4 engine misses them
      colors: {
        brand: {
          blue: "#2563eb",
          light: "#f5f5f7",
          dark: "#0a0a0b",
        },
      },
    },
  },
  plugins: [],
};

export default config;