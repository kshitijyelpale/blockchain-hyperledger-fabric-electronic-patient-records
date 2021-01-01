module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'google',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': [2, 140, 4, {ignoreUrls: true}],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', {args: 'none'}],
    'no-console': 'off',
    curly: 'error',
    eqeqeq: 'error',
    'no-throw-literal': 'error',
    strict: 'error',
    'no-var': 'error',
    'dot-notation': 'error',
    'no-tabs': 'error',
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-with': 'error',
    'operator-linebreak': 'error',
    yoda: 'error',
    'quote-props': ['error', 'as-needed'],
  },
};
