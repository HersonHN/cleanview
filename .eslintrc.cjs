module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // handles TS and JS
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',               // JS recommended rules
    'plugin:@typescript-eslint/recommended', // TS recommended rules
    'plugin:prettier/recommended',      // Prettier integration
  ],
  rules: {
    'prettier/prettier': 'error', // show prettier issues as ESLint errors
  },
  ignorePatterns: ['node_modules', 'dist'], // common ignores
};