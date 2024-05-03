import { FlatCompat } from '@eslint/eslintrc';
import jsdoc from 'eslint-plugin-jsdoc';
import node from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier/recommended';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import unicorn from 'eslint-plugin-unicorn';
import vitest from 'eslint-plugin-vitest';
import path from 'node:path';
import url from 'node:url';

const standard = new FlatCompat({
  baseDirectory: path.dirname(url.fileURLToPath(import.meta.url)),
}).extends('eslint-config-standard');

/**
 * @type {Array<import('eslint').Linter.FlatConfig>}
 */
export default [
  ...standard,
  jsdoc.configs['flat/recommended-typescript-flavor-error'],
  node.configs['flat/recommended-script'],
  unicorn.configs['flat/recommended'],
  {
    files: ['*.js', '**/*.js'],
    ignores: ['**/coverage'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'sort-destructure-keys': sortDestructureKeys,
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-keyword-prefix': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/string-content': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/prefer-object-has-own': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/template-indent': 'off',
      'unicorn/require-post-message-target-origin': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkDefaultAndNamespaceImports: false,
          checkShorthandImports: false,
          allowList: {
            props: true,
            prop: true,
            Prop: true,
            Props: true,
          },
        },
      ],
      strict: 'error',
      'sort-destructure-keys/sort-destructure-keys': 2,
      'n/file-extension-in-import': ['error', 'always'],
      'n/no-missing-import': 'warn',
    },
  },
  {
    // Disable `jsdoc` rules for test files
    files: ['**/?(*.)+(spec|test).?(m)[jt]s?(x)'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'unicorn/error-message': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
  prettier,
];
