import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // your main export file
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  // don't bundle these
  // TODO: can be removed? dependencies shouldn't be bundled by default
  external: ["firebase-admin", "firebase-functions"],
  sourcemap: true,
  clean: true,
  tsconfig: "./tsconfig.json",
});
