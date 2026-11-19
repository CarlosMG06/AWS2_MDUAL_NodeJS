import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

// Aquí no hi ha la línia de sourceType: "commonjs": els .js són ES Modules
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  stylistic.configs.customize({
    quotes: "double",
    semi: true,
    braceStyle: "1tbs",
    arrowParens: true,
  }),
]);
