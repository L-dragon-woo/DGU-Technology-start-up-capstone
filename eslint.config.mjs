import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/out/**',
      '**/build/**',
      'apps/web/next-env.d.ts',
      '**/next-env.d.ts',
      'pnpm-lock.yaml',
      '.sisyphus/**',
      '.omx/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'Literal[value=/\\bborder-(l|r)-(?:[1-9]|primary|success|warning|info|destructive|brand|accent|secondary)\\b/]',
          message:
            'Decorative side-border stripes (border-l-4, border-l-primary, border-r-success, ...) are forbidden by RootMatch design principle. Use bg color, icon chip, typography weight, or a full border instead. See AGENTS.md > Design Principles > No Card Stripes.',
        },
        {
          selector:
            'TemplateElement[value.raw=/\\bborder-(l|r)-(?:[1-9]|primary|success|warning|info|destructive|brand|accent|secondary)\\b/]',
          message:
            'Decorative side-border stripes (border-l-4, border-l-primary, border-r-success, ...) are forbidden by RootMatch design principle. Use bg color, icon chip, typography weight, or a full border instead. See AGENTS.md > Design Principles > No Card Stripes.',
        },
        {
          selector: 'Literal[value=/\\btext-\\[1[01]px\\]/]',
          message:
            'Senior-first UX: text-[10px] / text-[11px] is below the readable minimum for RootMatch senior users (50+). Use text-[12px] for badges/meta, text-[13-15px] for support, text-[15-17px] for body. See AGENTS.md > Design Principles > Senior-First UX.',
        },
        {
          selector: 'TemplateElement[value.raw=/\\btext-\\[1[01]px\\]/]',
          message:
            'Senior-first UX: text-[10px] / text-[11px] is below the readable minimum for RootMatch senior users (50+). Use text-[12px] for badges/meta, text-[13-15px] for support, text-[15-17px] for body. See AGENTS.md > Design Principles > Senior-First UX.',
        },
      ],
    },
  },

  {
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2022,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['packages/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.es2022 },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  eslintConfigPrettier,
]
