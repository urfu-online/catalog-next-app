module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  extends: [
    'next/core-web-vitals',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    // 'eslint:recommended',
    // 'prettier',
    // 'plugin:prettier/recommended',
  ],
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        jsxSingleQuote: false,
        semi: false,
        printWidth: 120,
        bracketSpacing: true,
        trailingComma: 'all',
        jsxBracketSameLine: false,
        arrowParens: 'always',
        textSpanIsEmpty: false,
      },
    ],
    indent: [
      'warn',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1, maxEOF: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    camelcase: 'off',
    // JavaScript
    'no-shadow': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'import/no-duplicates': 'error',
    'react/prop-types': 'off',
    'prefer-rest-param': 'off',
    'import/no-unresolved': 'off',
    // TypeScript
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-empty-function': ['warn', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    // 'max-len': [
    //   'error',
    //   {
    //     code: 150,
    //     // ignoreUrls: true, // Ignore URLs
    //     // ignoreComments: true, // Ignore comments
    //     // ignoreStrings: true, // Ignore strings
    //     // ignoreTemplateLiterals: true, // Ignore template literals
    //     // ignoreRegExpLiterals: true, // Ignore regular expressions
    //     // ignorePattern: '^\\s*<.+>$', // Ignore JSX lines
    //   },
    // ],
    'react/react-in-jsx-scope': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/link-passhref': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
