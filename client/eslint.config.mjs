import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "warn",
      "react/react-in-jsx-scope": "off"
    },
  },
];
