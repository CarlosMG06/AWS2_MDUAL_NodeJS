import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    // El servidor s'executa amb Node
    files: ["servidor.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.node },
  },
  {
    // El codi de public/ s'executa al navegador
    files: ["public/**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.browser },
  },
];
