module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'react-refresh', 'import', 'jsx-a11y'],
  settings: {
    ecmaVersion: 'latest',
    react: {
      version: 'detect',
    },
    // need this settings to resolve our imports
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  ignorePatterns: [
    'dist',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '!*.js',
    '.*.js',
    '*.json',
    'scripts',
  ],
  rules: {
    'no-console': 'warn', //don't use console.log
    'no-debugger': 'warn', //don't use debug
    'no-warning-comments': 'warn', //don't add in a comment the word warn
    'object-shorthand': 'error', //shorthand syntax
    //avoid change the function´s arg inside it (get clean function)
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['acc', 'next'],
      },
    ],
    'react/prop-types': 'off', //Evitar props tengan type
    //error if jsx is not closed
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-props-no-spreading': 'off', //Evitar use props como var y no como attribute
    //Evitar curly braces unnecessary en attributes
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    //avoid anchor as link
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link', 'NextLink', 'RouterLink'],
        aspects: ['invalidHref'],
      },
    ],
    'react/jsx-no-target-blank': 'off',
    'react/react-in-jsx-scope': 'off', //don't need import react
    'require-jsdoc': 'off', //no error if not document a function
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '$/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          ['builtin', 'external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          'unknown',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-default-export': 'warn',
    'import/no-extraneous-dependencies': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended', //desactiva reglas eslint:recommended controladas por ts evita duplicidad
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking', //usar info de types detect errores
        'plugin:import/typescript',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./client/tsconfig.json', './client/tsconfig.vite.json'],
        //project: true, //para que function el recommended-requiring-type-checking buscando en el tsconfig
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        // rules para los archivos de Typescript
        '@typescript-eslint/ban-ts-comment': 'off', // permitir comentarios directiva (ex. evitar check type)
        //error if we use a var before define it
        '@typescript-eslint/no-use-before-define': [
          'error',
          { functions: false },
        ],
        //error si no consumimos una promise al llamarla (need await or then)
        '@typescript-eslint/no-floating-promises': [
          'error',
          { ignoreVoid: true },
        ],
      },
    },
  ],
};
