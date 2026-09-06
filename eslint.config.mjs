import eslint from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".astro/**", ".vercel/**", "dist/**", "node_modules/**", "src/env.d.ts"],
  },
  eslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
];
