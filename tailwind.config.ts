import type { Config } from "tailwindcss";
import semantic from "./tailwind.raiz.config";
const config: Config = { ...semantic, content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] };
export default config;
