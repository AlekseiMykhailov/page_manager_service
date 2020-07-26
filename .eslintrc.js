module.exports = {
  'root': true,
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true,
    'jquery': false,
    'jest': true,
    'jasmine': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'plugins': [
    'react'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'sourceType': 'module',
    'ecmaVersion': '2018'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-var': [
      'error'
    ],
    'no-console': [
      'off'
    ],
    'no-unused-vars': [
      'warn'
    ],
    'no-mixed-spaces-and-tabs': [
      'warn'
    ]
  }
};
