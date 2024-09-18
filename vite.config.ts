/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  build: {
    minify: false,
    sourcemap: true,
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: "../src/sortable-names.ts",
      name: "sortable-names",
      fileName: "sortable-names",
      formats: ["es"],
    },
  },
  test: { root: "src" },
});
