module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'class-methods-use-this': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': 'off',
    'lines-between-class-members': 'off',
    'no-trailing-spaces': 'off',
    'import/no-cycle': 'off',
  },
};
