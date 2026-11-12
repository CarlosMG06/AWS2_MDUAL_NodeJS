import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

// Amb "type": "module", els .js són ES Modules: ja no cal la línia de sourceType: "commonjs"
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
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
