import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "oklch(var(--ink) / <alpha-value>)",
        canvas: "oklch(var(--canvas) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        line: "oklch(var(--line) / <alpha-value>)",
        primary: "oklch(var(--primary) / <alpha-value>)",
        "primary-strong": "oklch(var(--primary-strong) / <alpha-value>)",
        sage: "oklch(var(--sage) / <alpha-value>)",
        terracotta: "oklch(var(--terracotta) / <alpha-value>)",
        muted: "oklch(var(--muted) / <alpha-value>)",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "600",
        extrabold: "600",
        black: "600",
      },
      boxShadow: {
        sheet: "0 -8px 32px oklch(0.18 0.02 145 / 0.12)",
      },
      zIndex: {
        dropdown: "20",
        sticky: "30",
        modal: "40",
        toast: "50",
      },
    },
  },
  plugins: [],
};

export default config;
