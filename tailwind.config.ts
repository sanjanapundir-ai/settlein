import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // class strings live in lib/constants.ts — do not remove
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EE",
        ink: "#3B3452",
        butter: "#FFE9A8",
      },
      fontFamily: {
        heading: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        fluffy: "0 10px 30px -12px rgba(91, 76, 140, 0.25), 0 4px 12px -6px rgba(91, 76, 140, 0.12)",
      },
      keyframes: {
        pop: { "0%": { opacity: "0", transform: "scale(0.96) translateY(6px)" }, "100%": { opacity: "1", transform: "scale(1) translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-18px)" } },
      },
      animation: {
        pop: "pop 0.35s ease-out both",
        float: "float 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
