module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    "react/prop-types": 0,
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  }
};
