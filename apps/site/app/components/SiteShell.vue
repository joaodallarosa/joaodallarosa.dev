<script setup lang="ts">
// Shared chrome (nav rail, footer, cookie banner) for every layout. `contained` toggles
// whether <main> gets the padded, centered reading column (--content-max-width) or the full
// width of the shell — see layouts/default.vue (full space, for the homepage) vs
// layouts/content.vue (constrained, for text/list pages).
withDefaults(defineProps<{ contained?: boolean }>(), { contained: false })

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()
const { scheme, toggle: toggleScheme } = useColorScheme()

const navItems = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/post', labelKey: 'nav.posts' },
  { to: '/project', labelKey: 'nav.projects' },
] as const

const availableLocales = computed(() => locales.value.filter(l => l.code !== locale.value))
const isActive = (to: string) => route.path === localePath(to)
</script>

<template>
  <!--
    `isolate`: contains the z-3/z-1/z-2 tiers below (skip-link, nav rail, cookie banner) inside
    their own stacking context. Without it those are just bare positive z-index values, which
    unconditionally out-rank *any* sibling sitting at the default z-index:auto — including
    Nuxt Studio's own editing UI, which mounts as a sibling on document.body and apparently
    doesn't set an explicit z-index on its root (only on elements internal to it). That let our
    z-1 nav rail render on top of Studio's media-picker modal (see the Select Image dialog bug,
    2026-07-11). `isolate` keeps our internal ordering working while making this whole subtree
    behave like an ordinary unpositioned box from Studio's point of view, so it can never win
    against a positioned Studio element regardless of either side's numeric z-index.
  -->
  <div class="isolate flex flex-col sm:flex-row min-h-screen">
    <a
      href="#main-content"
      class="absolute z-3 top-2 left-2 py-2 px-4 font-mono text-base text-bg bg-accent rounded-xs translate-y-[-200%] transition-transform duration-(--motion-duration-base) ease-mechanical focus:translate-y-0"
    >
      {{ t('a11y.skipToContent') }}
    </a>

    <!--
      Vertical nav rail (Phase 4 "Liquid Obsidian" revision, docs/design-layout-references.md
      addendum) — replaces the previous top header. Fixed for the "panel-based, custom
      interface" structural read; collapses to a horizontal bar on narrow viewports rather
      than shrinking the rail in place, since rotated text at rail-bar width isn't legible.

      z-1 only has to beat the skip-link's z-3 and our own page content — see the `isolate`
      comment above for why it's safe from leaking above Studio's UI.
    -->
    <aside
      class="sticky sm:fixed z-1 top-0 left-0 flex flex-row sm:flex-col flex-wrap sm:flex-nowrap items-center justify-between gap-y-3 sm:gap-y-0 w-full sm:w-9 h-auto sm:h-screen py-3 sm:pt-5 sm:pb-7 px-4 sm:px-0 overflow-y-auto bg-bg border-b sm:border-b-0 sm:border-r border-border"
    >
      <NuxtLink
        :to="localePath('/')"
        class="order-1 sm:order-0 [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 shrink min-w-0 sm:min-w-auto max-w-[60%] sm:max-w-none overflow-hidden sm:overflow-visible text-ellipsis sm:text-clip font-mono text-base font-medium tracking-[0.08em] text-text whitespace-nowrap"
      >
        joaodallarosa.dev
      </NuxtLink>

      <nav
        aria-label="Main"
        class="order-3 sm:order-0 basis-full sm:basis-auto flex flex-row sm:flex-col flex-wrap sm:flex-nowrap items-center justify-start gap-x-4 gap-y-2 sm:gap-6"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="relative [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 whitespace-nowrap font-mono text-base uppercase tracking-[0.15em] transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent"
          :class="isActive(item.to) ? 'text-accent font-medium' : 'text-text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ t(item.labelKey) }}
          <span
            v-if="isActive(item.to)"
            class="absolute left-1/2 bottom-[-0.6em] sm:top-[-0.75em] sm:bottom-auto h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
            aria-hidden="true"
          />
        </NuxtLink>

        <!-- Plain anchor, not NuxtLink: /storybook is a static build copied into public/,
             not a Nuxt route — a NuxtLink would try to client-side-route it through Vue
             Router and 404 instead of letting the browser fetch the static file. Label is
             hardcoded (not i18n'd) since "Design System" reads the same in every locale. -->
        <a
          href="/storybook/"
          class="[writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 whitespace-nowrap font-mono text-base uppercase tracking-[0.15em] text-text-muted transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent"
        >
          Design System
        </a>
      </nav>

      <div class="order-2 sm:order-0 flex flex-row sm:flex-col items-center shrink-0 gap-4 sm:gap-5">
        <nav
          :aria-label="t('language.label')"
          class="flex flex-row sm:flex-col items-center gap-2 font-mono text-base tracking-widest"
        >
          <NuxtLink
            v-for="l in availableLocales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            class="text-text-muted hover:text-accent"
          >
            {{ (l.code.split('-')[0] ?? l.code).toUpperCase() }}
          </NuxtLink>
        </nav>

        <!--
          ClientOnly: the persisted preference lives in localStorage, unavailable during SSR —
          rendering a guessed state eagerly causes a hydration text mismatch (see
          colorscheme.client.ts). The fallback keeps layout stable instead of an empty slot.
        -->
        <ClientOnly>
          <button
            type="button"
            class="flex flex-row sm:flex-col items-center gap-2 p-0 font-mono text-[9px] tracking-[0.15em] text-text-muted bg-transparent border-none cursor-pointer hover:text-accent"
            :aria-pressed="scheme === 'light'"
            :aria-label="`${t('colorScheme.label')}: ${scheme === 'light' ? t('colorScheme.light') : t('colorScheme.dark')}`"
            @click="toggleScheme"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="scheme === 'light' ? 'bg-accent' : 'bg-disabled-text'"
            />
            {{ scheme === 'light' ? 'LIGHT' : 'DARK' }}
          </button>
          <template #fallback>
            <button
              type="button"
              class="flex flex-row sm:flex-col items-center gap-2 p-0 font-mono text-[9px] tracking-[0.15em] text-text-muted bg-transparent border-none cursor-pointer"
              disabled
              :aria-label="`${t('colorScheme.label')}: ${t('colorScheme.dark')}`"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-disabled-text" />
              DARK
            </button>
          </template>
        </ClientOnly>
      </div>
    </aside>

    <div class="flex flex-1 flex-col min-w-0 min-h-screen ml-0 sm:ml-9">
      <main
        id="main-content"
        tabindex="-1"
        class="flex flex-1 flex-col w-full"
        :class="contained ? 'max-w-content mx-auto py-8 px-6' : ''"
      >
        <slot />
      </main>

      <footer class="flex flex-wrap items-center gap-x-6 gap-y-3 w-full max-w-content mx-auto py-5 px-6 font-mono text-base text-text-muted border-t border-border">
        <p class="m-0">
          &copy; {{ new Date().getFullYear() }} Joao Dalla Rosa
        </p>
      </footer>
    </div>

    <CookieBanner />
  </div>
</template>
