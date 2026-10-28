import type { Config } from "tailwindcss";

// Isolated new vocabulary; legacy config remains owned by PR13 until consumers migrate.
const roles = ["brand", "action", "highlight", "info", "canvas", "surface", "ink", "muted", "line", "line-strong", "surface-soft", "surface-brand", "surface-info", "danger", "surface-danger", "warning", "surface-warning"];
const config: Config = {
  content: ["./components/ui/**/*.{ts,tsx}", "./components/shopping/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: { extend: {
    colors: Object.fromEntries(roles.map((role) => [role, `rgb(var(--color-${role}-rgb) / <alpha-value>)`])),
    fontFamily: { sans: ["Restok Manrope", "system-ui", "sans-serif"] },
    borderRadius: { control: "var(--radius-control)", panel: "var(--radius-panel)", budget: "var(--radius-budget)" },
  } },
  plugins: [],
};
export default config;
