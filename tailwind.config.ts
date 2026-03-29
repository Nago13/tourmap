// NOTE: This project uses Tailwind CSS v4, which is configured via CSS (@theme in globals.css).
// This file is provided for reference and tooling compatibility only.
// The canonical design tokens live in app/globals.css under @theme inline.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#03161d",
          800: "#06232c",
          700: "#0a3040",
          600: "#0e3d52",
        },
        accent: "#00d4ff",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
