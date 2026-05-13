import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import fsdPlugin from 'eslint-plugin-fsd-lint'

import { defineConfig, globalIgnores } from 'eslint/config'

const fsdAlias = { value: '@', withSlash: true }

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    plugins: {
      fsd: fsdPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'fsd/forbidden-imports': ['error', { alias: fsdAlias }],
      'fsd/no-cross-slice-dependency': ['error', { alias: fsdAlias }],
      'fsd/no-public-api-sidestep': ['error', { alias: fsdAlias }],
      'fsd/no-relative-imports': [
        'error',
        { alias: fsdAlias, allowSameSlice: true, allowTypeImports: false },
      ],
      'fsd/no-ui-in-business-logic': ['error', { alias: fsdAlias }],
      'fsd/ordered-imports': ['warn', { alias: fsdAlias }],
    },
  },
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
  },
])
