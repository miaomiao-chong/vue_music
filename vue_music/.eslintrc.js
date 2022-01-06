module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'indent':0,
    'space-before-function-paren':0,
    'no-irregular-whitespace': 'off',
    'no-unused-vars': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'quotes': 'off',
    'vue/no-unused-components': 'off',
    'no-trailing-spaces':'off',
    'eol-last':'off',
    'prefer-const':'off',
    'no-mixed-operators': 'off',
    'dot-notation':'off',
    'spaced-comment':'off',
    'import/no-duplicates':'off',
    'padded-blocks': 'off'
  }
}
