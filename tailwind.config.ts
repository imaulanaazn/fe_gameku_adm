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
        inter: ["Inter", "sans-serif"], // The name 'roboto' is arbitrary and can be whatever you want
      },
      colors: {
        "primary-900": "#B72025",
        "primary-600": "#EF4046",
        "primary-300": "#FAB4B6",
        "primary-100": "#FFE4E5",
        "primary-50": "#FFF3F3",
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
    },
  },
  lugins: [require("@tailwindcss/forms")],
};
export default config;
