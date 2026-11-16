import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--delft-primary) / <alpha-value>)',
        ink: 'rgb(var(--delft-ink) / <alpha-value>)',
        porcelain: 'rgb(var(--delft-porcelain) / <alpha-value>)',
        accent: 'rgb(var(--delft-accent) / <alpha-value>)',
        blush: 'rgb(var(--delft-blush) / <alpha-value>)',
        'anda-blue': 'rgb(var(--delft-primary) / <alpha-value>)',
        'anda-light-blue': 'rgb(var(--delft-porcelain) / <alpha-value>)',
        'anda-dark': 'rgb(var(--delft-ink) / <alpha-value>)',
      },
      maxWidth: {
        'anda': '1100px',
      },
    },
  },
  plugins: [],
};
export default config;
