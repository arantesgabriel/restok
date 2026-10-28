import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    environment: "node",
    // Bound concurrent DOM workers so baseline checks remain usable during builds/captures.
    maxWorkers: 4,
  },
});
