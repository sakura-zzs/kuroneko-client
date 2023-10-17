/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-undef': 'off'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
