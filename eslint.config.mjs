import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: eslintReact,
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin
    }
  },
  {
    ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.js', 'build']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020
      },
      parserOptions: {
        project: ['tsconfig.json']
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'prefer-const': 'error',
      'no-console': 'warn',
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-catch': 'off'
    }
  }
);
