import eslintConfigPrettierFlat from "eslint-config-prettier/flat";
import vuetify from "eslint-config-vuetify";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default vuetify(
  {},
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Turn off formatting rules via eslint-config-prettier
      ...eslintConfigPrettierFlat.rules,
    },
  },
);
