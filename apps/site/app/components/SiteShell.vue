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
  { to: '/note', labelKey: 'nav.notes' },
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
      class="sticky sm:fixed z-1 top-0 left-0 flex flex-col flex-nowrap items-stretch sm:items-center justify-start sm:justify-between gap-y-3 sm:gap-y-0 w-full sm:w-9 h-auto sm:h-screen py-3 sm:pt-5 sm:pb-7 px-4 sm:px-0 overflow-y-auto bg-bg border-b sm:border-b-0 sm:border-r border-border"
    >
      <!--
        Mobile: `sm:contents` dissolves this wrapper at the desktop breakpoint so the brand
        link and the utility cluster become direct flex children of the rail again (restoring
        the original top/middle/bottom rail order via the sm:order-* classes below) — on
        mobile it's a real row: brand left, locale + theme toggle right.
      -->
      <div class="flex w-full items-center justify-between gap-4 sm:contents">
        <NuxtLink
          :to="localePath('/')"
          class="sm:order-1 [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 shrink min-w-0 sm:min-w-auto max-w-[60%] sm:max-w-none overflow-hidden sm:overflow-visible text-ellipsis sm:text-clip font-mono text-base font-medium tracking-[0.08em] text-text whitespace-nowrap"
        >
          joaodallarosa.dev
        </NuxtLink>

        <div class="sm:order-3 flex flex-row sm:flex-col items-center shrink-0 gap-4 sm:gap-5">
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

            Two renders share the same scheme/toggleScheme state and the same sliding-pill
            design (sun/moon glyph, clearer at a glance than a tiny dot): a horizontal switch
            on mobile's horizontal bar, and a vertical switch (same pill, rotated 90deg via
            swapped h/w and translate-y instead of translate-x) on desktop's vertical rail —
            a shared shape rendered twice rather than one element reflowed with responsive
            classes, since the slide axis itself changes, not just size/position.
          -->
          <ClientOnly>
            <button
              type="button"
              class="relative hidden sm:flex h-13.5 w-7.5 shrink-0 items-center rounded-full border border-border bg-bg-raised hover:border-accent"
              :aria-pressed="scheme === 'light'"
              :aria-label="`${t('colorScheme.label')}: ${scheme === 'light' ? t('colorScheme.light') : t('colorScheme.dark')}`"
              @click="toggleScheme"
            >
              <span
                class="absolute top-0.75 left-0.75 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-accent text-bg transition-transform duration-(--motion-duration-base) ease-mechanical"
                :class="scheme === 'dark' ? 'translate-y-[24px]' : 'translate-y-0'"
              >
                <svg
                  v-if="scheme === 'light'"
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />
                  <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20 14.5a8.5 8.5 0 1 1-10.5-10.4A8.5 8.5 0 0 0 20 14.5Z" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              class="relative flex sm:hidden h-7.5 w-13.5 shrink-0 items-center rounded-full border border-border bg-bg-raised"
              :aria-pressed="scheme === 'light'"
              :aria-label="`${t('colorScheme.label')}: ${scheme === 'light' ? t('colorScheme.light') : t('colorScheme.dark')}`"
              @click="toggleScheme"
            >
              <span
                class="absolute top-0.75 left-0.75 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-accent text-bg transition-transform duration-(--motion-duration-base) ease-mechanical"
                :class="scheme === 'dark' ? 'translate-x-[24px]' : 'translate-x-0'"
              >
                <svg
                  v-if="scheme === 'light'"
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />
                  <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20 14.5a8.5 8.5 0 1 1-10.5-10.4A8.5 8.5 0 0 0 20 14.5Z" />
                </svg>
              </span>
            </button>

            <template #fallback>
              <button
                type="button"
                class="relative hidden sm:flex h-13.5 w-7.5 shrink-0 items-center rounded-full border border-border bg-bg-raised"
                disabled
                :aria-label="`${t('colorScheme.label')}: ${t('colorScheme.dark')}`"
              >
                <span class="absolute bottom-0.75 left-0.75 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-disabled-text text-bg">
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20 14.5a8.5 8.5 0 1 1-10.5-10.4A8.5 8.5 0 0 0 20 14.5Z" />
                  </svg>
                </span>
              </button>
              <button
                type="button"
                class="relative flex sm:hidden h-7.5 w-13.5 shrink-0 items-center rounded-full border border-border bg-bg-raised"
                disabled
                :aria-label="`${t('colorScheme.label')}: ${t('colorScheme.dark')}`"
              >
                <span class="absolute top-0.75 left-0.75 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-disabled-text text-bg">
                  <svg
                    viewBox="0 0 24 24"
                    class="h-3.5 w-3.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20 14.5a8.5 8.5 0 1 1-10.5-10.4A8.5 8.5 0 0 0 20 14.5Z" />
                  </svg>
                </span>
              </button>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!--
        Mobile: horizontal scroll-snap slider (a modern mobile-nav pattern — scrollable pill
        tabs, e.g. Airbnb's category bar) instead of the old wrap-to-a-second-line list, which
        is what clipped the theme toggle at narrow widths. Desktop keeps the original vertical
        text-link column (sm:flex-col, no scroll/snap/mask, no pill background).
      -->
      <nav
        aria-label="Main"
        class="sm:order-2 flex w-full sm:w-auto flex-row sm:flex-col flex-nowrap items-center gap-x-2 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none [-webkit-overflow-scrolling:touch] scrollbar-none mask-[linear-gradient(90deg,transparent,black_4%,black_96%,transparent)] sm:mask-none [-webkit-mask-image:linear-gradient(90deg,transparent,black_4%,black_96%,transparent)] sm:[-webkit-mask-image:none]"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="relative shrink-0 snap-start rounded-full px-4 py-2 sm:px-0 sm:py-0 [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 whitespace-nowrap font-mono text-base uppercase tracking-[0.15em] transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent"
          :class="isActive(item.to) ? 'bg-accent text-bg sm:bg-transparent sm:text-accent font-medium' : 'bg-bg-raised sm:bg-transparent text-text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ t(item.labelKey) }}
          <span
            v-if="isActive(item.to)"
            class="hidden sm:block absolute top-[-0.75em] h-1 w-1 left-1/2 -translate-x-1/2 rounded-full bg-accent"
            aria-hidden="true"
          />
        </NuxtLink>

        <!-- Plain anchor, not NuxtLink: /storybook is a static build copied into public/,
             not a Nuxt route — a NuxtLink would try to client-side-route it through Vue
             Router and 404 instead of letting the browser fetch the static file. Label is
             hardcoded (not i18n'd) since "Design System" reads the same in every locale.
             Hidden on mobile: the slider is scoped to real site sections, not a link out to
             a separate static Storybook build — desktop keeps it in the rail as before. -->
        <a
          href="/storybook/"
          class="hidden sm:block [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl] sm:rotate-180 whitespace-nowrap font-mono text-base uppercase tracking-[0.15em] text-text-muted transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent"
        >
          Design System
        </a>
      </nav>
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

      <footer class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 w-full max-w-content mx-auto py-5 px-6 font-mono text-base text-text-muted border-t border-border">
        <p class="m-0">
          &copy; {{ new Date().getFullYear() }} Joao Dalla Rosa
        </p>
        <a
          href="mailto:joaofilipedallarosa@gmail.com"
          class="text-accent transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent-hover"
        >
          {{ t('footer.contactMe') }}
        </a>
      </footer>
    </div>

    <CookieBanner />
  </div>
</template>
