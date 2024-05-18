import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import jest from "eslint-plugin-jest";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    plugins: { jest },
    ...jest.configs["flat/recommended"],
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "warn",
      "jest/no-conditional-expect": "warn",
    },
  },
];
