// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/i18n', 'nuxt-studio'],
  devtools: { enabled: true },
  css: [
    // Self-hosted (@fontsource, not a Google Fonts <link>) to match the project's
    // no-runtime-CDN-calls pattern and avoid sending visitor IPs to Google — see the
    // cookieless-analytics rationale in PROJECT.md §3. One entry per weight/style actually
    // used by tokens.css's --font-weight-* values and the one-off italic/900 uses in
    // index.vue, rather than the full static family or a variable-font axis range.
    '@fontsource/fraunces/400.css',
    '@fontsource/fraunces/500.css',
    '@fontsource/fraunces/600.css',
    '@fontsource/fraunces/600-italic.css',
    '@fontsource/fraunces/900-italic.css',
    '@fontsource/jetbrains-mono/300.css',
    '@fontsource/jetbrains-mono/400.css',
    '@fontsource/jetbrains-mono/500.css',
    'design-system/tokens.css',
    'design-system/hydration.css',
    '~/assets/css/base.css',
  ],
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
