import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-900": "rgb(251 146 60 / 0.9)",
        "primary-600": "#EF4046",
        "primary-300": "#FAB4B6",
        "primary-100": "#FFE4E5",
        "primary-50": "#FFF3F3",
        "primary-25": "#fff7f7",
        "neutral-900": "#111827",
        "neutral-800": "#1F2937",
        "neutral-700": "#374151",
        "neutral-600": "#4B5563",
        "neutral-500": "#6B7280",
        "neutral-400": "#9CA3AF",
        "neutral-300": "#D1D5DB",
        "neutral-200": "#E5E7EB",
        "neutral-100": "#F3F4F6",
        "neutral-50": "#F9FAFB",
      },
      gridTemplateColumns: {
        "auto-lg": "repeat(auto-fill, minmax(170px, 1fr))",
        "auto-md": "repeat(auto-fill, minmax(140px, 1fr))",
        "auto-sm": "repeat(auto-fill, minmax(100px, 1fr))",
        "auto-xs": "repeat(auto-fill, minmax(75px, 1fr))",
      },
      backgroundColor: {
        darkPrimary: "#0f0f14",
        darkSecondary: "#161721 ",
        darkAccent: "orange-400/90",
      },
    },
    screens: {
      xs: "375px",
      // => @media (min-width: 375px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
