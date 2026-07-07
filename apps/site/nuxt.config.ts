// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/i18n', 'nuxt-studio'],
  devtools: { enabled: true },
  css: ['design-system/tokens.css', 'design-system/hydration.css', '~/assets/css/base.css'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('ds-'),
    },
  },
  compatibilityDate: '2025-07-15',
  typescript: {
    strict: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'pt-BR', language: 'pt-BR', name: 'Português (BR)', file: 'pt-BR.json' },
    ],
  },
  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'joaodallarosa',
      repo: 'joaodallarosa.dev',
      branch: 'main',
    },
  },
})
