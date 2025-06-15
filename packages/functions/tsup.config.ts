import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // your main export file
  outDir: "dist",
  format: ["cjs"],
  target: "node20",
  platform: "node",
  // don't bundle these
  // TODO: can be removed? dependencies shouldn't be bundled by default
  external: ["firebase-admin", "firebase-functions"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  tsconfig: "./tsconfig.json",
});
