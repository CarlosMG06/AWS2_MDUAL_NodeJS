import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    rules: {
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": "error",
    },
  },
  stylistic.configs.customize({
    quotes: "double",
    semi: true,
    braceStyle: "1tbs",
    arrowParens: true,
  }),
]);
