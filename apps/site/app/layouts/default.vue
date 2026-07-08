<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const { devMode, toggle: toggleDevMode } = useDevMode()

const kindNavItems = [
  { kind: 'project', labelKey: 'nav.projects' },
  { kind: 'post', labelKey: 'nav.posts' },
  { kind: 'note', labelKey: 'nav.notes' },
  { kind: 'log', labelKey: 'nav.log' },
] as const

const availableLocales = computed(() => locales.value.filter(l => l.code !== locale.value))
</script>

<template>
  <div class="site">
    <header
      class="site-header"
      data-devmode-label="header"
    >
      <NuxtLink
        :to="localePath('/')"
        class="site-title"
      >
        joaodallarosa.dev
      </NuxtLink>

      <nav
        aria-label="Entry kinds"
        data-devmode-label="nav[kind-filter]"
      >
        <NuxtLink
          v-for="item in kindNavItems"
          :key="item.kind"
          :to="{ path: localePath('/'), query: { kind: item.kind } }"
        >
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <nav
        :aria-label="t('language.label')"
        data-devmode-label="nav[locale-switcher]"
      >
        <NuxtLink
          v-for="l in availableLocales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
        >
          {{ l.name ?? l.code }}
        </NuxtLink>
      </nav>
    </header>

    <main data-devmode-label="main">
      <slot />
    </main>

    <footer
      class="site-footer"
      data-devmode-label="footer"
    >
      <p>&copy; {{ new Date().getFullYear() }} Joao Dallarosa</p>
      <NuxtLink :to="localePath('/showcase')">
        Component showcase
      </NuxtLink>
      <!--
        ClientOnly: the persisted preference lives in localStorage, which isn't available
        during SSR, so the server can't know whether this should read "On" or "Off" — rendering
        a guess would cause a hydration text mismatch once the client restores real state
        (see devmode.client.ts). The fallback keeps layout stable instead of an empty slot.
      -->
      <ClientOnly>
        <button
          type="button"
          class="devmode-toggle"
          @click="toggleDevMode"
        >
          {{ t('devMode.label') }}: {{ devMode ? t('devMode.on') : t('devMode.off') }}
        </button>
        <template #fallback>
          <button
            type="button"
            class="devmode-toggle"
            disabled
          >
            {{ t('devMode.label') }}: {{ t('devMode.off') }}
          </button>
        </template>
      </ClientOnly>
    </footer>
  </div>
</template>

<style>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-header,
.site-footer,
main {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-5) var(--space-6);
}

.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.site-title {
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-mono-em);
  color: var(--color-text);
}

.site-header nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
}

main {
  flex: 1;
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);
}

.site-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-6);
  border-top: 1px solid var(--color-border);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.site-footer p {
  margin: 0;
}

.devmode-toggle {
  margin-left: auto;
  padding: var(--space-1) var(--space-2);
  font-family: inherit;
  font-size: inherit;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  cursor: pointer;
}

.devmode-toggle:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

/*
 * Developer Mode x-ray skin, applied to plain site chrome. Same visual grammar as
 * packages/design-system/src/utils/xray.ts (dashed outline + monospace corner tag) so the
 * design system's structural language reads as one system, not something that stops at the
 * package boundary (PROJECT.md §4). Chrome is plain HTML outside any Shadow Root, so this
 * is a plain-CSS re-implementation rather than a shared import.
 */
[data-dev-mode] .site-header,
[data-dev-mode] .site-header nav,
[data-dev-mode] main,
[data-dev-mode] .site-footer {
  position: relative;
  outline: 1px dashed var(--devmode-outline-color);
  outline-offset: -1px;
}

[data-dev-mode] .site-header::before,
[data-dev-mode] .site-header nav::before,
[data-dev-mode] main::before,
[data-dev-mode] .site-footer::before {
  content: attr(data-devmode-label);
  position: absolute;
  top: -1.1em;
  left: 0;
  z-index: 1;
  padding: 0 4px;
  font-family: var(--devmode-font);
  font-size: 9px;
  line-height: 1.4;
  color: var(--devmode-text);
  background: var(--devmode-bg);
  white-space: nowrap;
  pointer-events: none;
}
</style>
