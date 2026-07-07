import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig({
  files: ['src/**/*.ts'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    stylistic.configs.customize({ indent: 2, quotes: 'single', semi: false }),
  ],
})
