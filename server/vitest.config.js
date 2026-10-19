import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: { NODE_ENV: "test", JWT_SECRET: "test-secret" },
    setupFiles: ["./tests/setup.js"],
    hookTimeout: 120_000, // first run downloads a MongoDB binary
    fileParallelism: false,
  },
});
