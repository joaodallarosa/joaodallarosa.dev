import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/i18n', 'nuxt-studio', '@nuxtjs/sitemap', '@nuxt/image'],
  // Hybrid rendering: this is a blog, so almost every route is static content that can be
  // built once and served from the edge (SSG via routeRules prerendering). The one exception
  // is Nuxt Studio (`/_studio`, plus its own `/api/**` endpoints for auth and saving content) —
  // that needs a live Node server to run against, so it stays on-demand SSR. `ssr: true` is
  // kept at the top level (rather than switching to `nuxt generate`/`ssr: false`) specifically
  // so that server still exists in production for Studio to run on.
  ssr: true,
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
    // Tailwind utilities, theme-mapped onto the tokens above (see the file's own comment) —
    // loaded before fonts.css/base.css so hand-written rules there still win over Preflight.
    '~/assets/css/tailwind.css',
    // Custom licensed font-face (Oldenorth) — not a @fontsource package; see fonts.css.
    '~/assets/css/fonts.css',
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
  routeRules: {
    '/**': { prerender: true },
    '/_studio/**': { prerender: false },
    '/api/**': { prerender: false },
  },
  compatibilityDate: '2025-07-15',
  // `routeRules['/**'].prerender` only marks paths as prerenderable *when discovered* — it
  // isn't itself a crawl seed (wildcards can't be enumerated). Without an explicit starting
  // route, Nitro's crawler had nothing to start from and prerendered zero pages (confirmed via
  // a local `VERCEL=1 pnpm build`: only the two @nuxt/content sql-dump assets got prerendered,
  // not even `/`). That's what caused the reported production 404-on-reload for entry pages
  // like /note/raising-my-hand — every request fell through to the live SSR function instead
  // of a static file, and that request path relies on nitro-nuxt/content's runtime dump-fetch
  // working. Seeding `/` here lets the crawler follow the real nav/listing links (home → /note,
  // /project → each entry) so every published route gets a static file at build time.
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      // The crawl legitimately hits a couple of expected-404 links it can't avoid following:
      // i18n's automatic hreflang alternate tags advertise a /fr/ and /pt-BR/ URL for every
      // entry even when that specific note/project has no translation yet (only the locale(s)
      // actually authored should 200 — this is correct runtime behavior, not a bug to silence),
      // and /storybook/ is a plain anchor to a static build outside Nuxt's own routing that the
      // crawler still visits since it's a same-origin link. Neither should abort the whole
      // production build over an unrelated route.
      failOnError: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
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
    detectBrowserLanguage: false,
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
      // This is a monorepo — without this, nuxt-studio assumes content/ lives at the
      // repo root and commits edits there instead of to apps/site/content/, silently
      // orphaning them (see docs/studio-setup.md conflict incident, 2026-07-11).
      rootDir: 'apps/site',
    },
  },
})
