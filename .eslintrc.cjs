/**
 * ESLint config (JS) — uses the TypeScript parser and plugin.
 * Kept minimal and safe: extends Next.js recommended config and enables @typescript-eslint parser.
 */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  rules: {
    // project-specific overrides go here
  }
}
