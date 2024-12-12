/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  useTabs: false,
  bracketSpacing: true,
  tabWidth: 2,
  endOfLine: 'lf',
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
};
