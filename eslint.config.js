import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import vueEslintParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.*', 'prettier.config.cjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  prettierConfig,
)
