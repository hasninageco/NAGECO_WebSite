import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#fff",
        brand: {
          50: "#fff",
          100: "#fff",
          500: "#1f73dd",
          700: "#3e89ef",
          900: "#000000"
        }
      }
    }
  },
  plugins: []
};

export default config;