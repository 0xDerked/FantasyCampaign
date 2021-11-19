/* eslint-disable prettier/prettier */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    node: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: {
      "jsx": true
    },
  },
  rules: {
    "prettier/prettier": ["error", { singleQuote: false }],
    "@typescript-eslint/no-var-requires": 0,
	 "no-unused-vars":"warn"
  },
};
