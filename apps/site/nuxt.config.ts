// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/i18n', 'nuxt-studio', '@nuxtjs/sitemap', '@nuxt/image'],
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          // Sets <html data-color-scheme> before first paint (persisted choice, else OS
          // preference) so there's no flash of the wrong theme while colorscheme.client.ts's
          // plugin (which syncs Vue state to match) is still loading. See useColorScheme.ts.
          innerHTML: `(function(){try{var s=localStorage.getItem('joao-website:color-scheme');if(!s)s=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-color-scheme',s)}catch(e){}})()`,
        },
      ],
    },
  },
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
  site: {
    url: 'https://joaodallarosa.dev',
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
    baseUrl: 'https://joaodallarosa.dev',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'pt-BR', language: 'pt-BR', name: 'Português (BR)', file: 'pt-BR.json' },
    ],
  },
  sitemap: {
    // See server/api/__sitemap__/urls.ts for why this custom source exists instead of relying
    // on the module's built-in @nuxt/content auto-detection.
    sources: ['/api/__sitemap__/urls'],
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
