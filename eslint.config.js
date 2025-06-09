import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
  },
  {
    settings: { react: { version: "18.3" } },
  },

  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ["node_modules", "dist", "public", ".nuxt"],
  },
  eslintConfigPrettier,
];
