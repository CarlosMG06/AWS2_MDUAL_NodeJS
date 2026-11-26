import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      // El gestor d'errors d'Express necessita 4 paràmetres: _next no es fa servir
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
