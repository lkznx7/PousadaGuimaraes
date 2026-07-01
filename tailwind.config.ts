import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#1F3D35",
        gold: "#C8A66A",
        linen: "#F2E9D8",
        taupe: "#BFAE96",
        ink: "#16231F",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(31, 61, 53, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
