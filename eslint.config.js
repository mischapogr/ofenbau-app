import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,cjs,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['.claude/**', 'docs/generated/**', 
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'demo-artifacts/**',
      'test-results/**',
      '.wrangler/**',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser + build-time globals.
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
  // Disable formatting rules that conflict with Prettier (keep this last).
  prettier,
]
