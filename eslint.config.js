import eslintJS from "@eslint/js";
import eslintTS from "typescript-eslint";
import eslintPrettier from "eslint-config-prettier";
import globals from "globals";

export default eslintTS.config(
  eslintJS.configs.recommended,
  ...eslintTS.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-private-class-members": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  eslintPrettier
);
