import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jetons Sémantiques Officiels Version 2.0
        canvas: "#F7F5F0",
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#EEEAE3",
        },
        ink: {
          DEFAULT: "#211D19",
          muted: "#645C54",
        },
        night: {
          DEFAULT: "#1B1916",
          text: "#F7F5F0",
        },
        cedar: "#6C4935",
        brass: "#A88958",
        line: "#D9D2C7",
        "control-border": "#857A6D",
        success: "#365343",
        error: "#963E38",
        focus: "#71512D",

        // Rétrocompatibilité nuancier collectionneur
        cigar: {
          ivory: {
            DEFAULT: "#F7F5F0",
            light: "#FAF7F2",
            surface: "#FFFFFF",
            dark: "#EEEAE3",
          },
          ink: {
            DEFAULT: "#211D19",
            pure: "#1B1916",
            muted: "#645C54",
            faint: "#857A6D",
          },
          cedar: {
            DEFAULT: "#6C4935",
            dark: "#3D281E",
            light: "#8B6448",
            subtle: "#543C2C",
          },
          brass: {
            DEFAULT: "#A88958",
            light: "#C9AA7A",
            dark: "#84683E",
            glow: "rgba(168, 137, 88, 0.18)",
          },
          pine: {
            DEFAULT: "#365343",
            light: "#4A6558",
            dark: "#23312A",
            subtle: "rgba(54, 83, 67, 0.08)",
          },
          stone: {
            DEFAULT: "#D9D2C7",
            subtle: "#EEEAE3",
            dark: "#857A6D",
          },
          gold: {
            DEFAULT: "#A88958",
            light: "#C9AA7A",
            dark: "#6C4935",
          },
        },
      },
      fontFamily: {
        sans: ["Outfit", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Cormorant Garamond", "Bodoni Moda", "Georgia", "serif"],
        display: ["Bodoni Moda", "Cormorant Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        "cigar-subtle": "0 2px 8px rgba(33, 29, 25, 0.04), 0 1px 2px rgba(33, 29, 25, 0.02)",
        "cigar-card": "0 10px 30px -5px rgba(33, 29, 25, 0.05), 0 0 0 1px rgba(217, 210, 199, 0.7)",
        "cigar-hover": "0 16px 36px -8px rgba(33, 29, 25, 0.08), 0 0 0 1px rgba(108, 73, 53, 0.35)",
        "cigar-brass": "0 0 20px rgba(168, 137, 88, 0.15)",
      },
      backdropBlur: {
        cigar: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
