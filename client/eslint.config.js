import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]|^motion$", argsIgnorePattern: "^_" }],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["useAuth", "useTheme", "useToast", "NAV_LINKS", "ROLE_ICONS", "stagger"],
        },
      ],
    },
  },
  {
    files: ["**/*.test.{js,jsx}", "src/test/**"],
    languageOptions: { globals: { ...globals.vitest } },
  },
];
