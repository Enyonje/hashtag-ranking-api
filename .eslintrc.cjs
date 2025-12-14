module.exports = {
  root: true,
  env: { node: true, es2020: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "no-console": "off"
  }
};