<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()
const { devMode, toggle: toggleDevMode } = useDevMode()

const kindNavItems = [
  { kind: 'project', labelKey: 'nav.projects' },
  { kind: 'post', labelKey: 'nav.posts' },
  { kind: 'note', labelKey: 'nav.notes' },
  { kind: 'log', labelKey: 'nav.log' },
] as const

const availableLocales = computed(() => locales.value.filter(l => l.code !== locale.value))
const activeKind = computed(() => route.query.kind)
</script>

<template>
  <div class="site">
    <!--
      Vertical nav rail (Phase 4 "Liquid Obsidian" revision, docs/design-layout-references.md
      addendum) — replaces the previous top header. Fixed for the "panel-based, custom
      interface" structural read; collapses to a horizontal bar on narrow viewports rather
      than shrinking the rail in place, since rotated text at rail-bar width isn't legible.
    -->
    <aside
      class="site-rail"
      data-devmode-label="rail"
    >
      <NuxtLink
        :to="localePath('/')"
        class="rail-brand"
      >
        joaodallarosa.dev
      </NuxtLink>

      <nav
        aria-label="Entry kinds"
        class="rail-nav"
        data-devmode-label="nav[kind-filter]"
      >
        <NuxtLink
          v-for="item in kindNavItems"
          :key="item.kind"
          :to="{ path: localePath('/'), query: { kind: item.kind } }"
          class="rail-link"
          :class="{ 'is-active': activeKind === item.kind }"
        >
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <div class="rail-foot">
        <nav
          :aria-label="t('language.label')"
          class="rail-lang"
          data-devmode-label="nav[locale-switcher]"
        >
          <NuxtLink
            v-for="l in availableLocales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
          >
            {{ l.code.toUpperCase() }}
          </NuxtLink>
        </nav>

        <!--
          ClientOnly: the persisted preference lives in localStorage, unavailable during SSR —
          rendering a guessed state eagerly causes a hydration text mismatch (see
          devmode.client.ts). The fallback keeps layout stable instead of an empty slot.
        -->
        <ClientOnly>
          <button
            type="button"
            class="rail-devmode"
            :class="{ 'is-on': devMode }"
            :aria-pressed="devMode"
            :aria-label="`${t('devMode.label')}: ${devMode ? t('devMode.on') : t('devMode.off')}`"
            @click="toggleDevMode"
          >
            <span class="rail-devmode-dot" />
            DEV
          </button>
          <template #fallback>
            <button
              type="button"
              class="rail-devmode"
              disabled
              :aria-label="`${t('devMode.label')}: ${t('devMode.off')}`"
            >
              <span class="rail-devmode-dot" />
              DEV
            </button>
          </template>
        </ClientOnly>
      </div>
    </aside>

    <div class="site-body">
      <main data-devmode-label="main">
        <slot />
      </main>

      <footer
        class="site-footer"
        data-devmode-label="footer"
      >
        <p>&copy; {{ new Date().getFullYear() }} Joao Dallarosa</p>
        <NuxtLink :to="localePath('/showcase')">
          Framework interop demo
        </NuxtLink>
      </footer>
    </div>
  </div>
</template>

<style>
.site {
  display: flex;
  min-height: 100vh;
}

.site-rail {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: var(--space-9);
  height: 100vh;
  padding: var(--space-5) 0;
  overflow-y: auto;
  background: var(--color-bg);
  border-right: 1px solid var(--color-border);
}

.rail-brand {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-mono-em);
  letter-spacing: 0.08em;
  color: var(--color-text);
  white-space: nowrap;
}

.rail-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.rail-link {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: color var(--motion-duration-base) var(--motion-easing-mechanical);
}

.rail-link:hover {
  color: var(--color-accent);
}

.rail-link.is-active {
  position: relative;
  color: var(--color-accent);
  font-weight: var(--font-weight-mono-em);
}

.rail-link.is-active::before {
  content: '';
  position: absolute;
  top: -0.75em;
  left: 50%;
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: 50%;
  transform: translateX(-50%);
}

.rail-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.rail-lang {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.1em;
}

.rail-lang a {
  color: var(--color-text-muted);
}

.rail-lang a:hover {
  color: var(--color-accent);
}

.rail-devmode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  font-family: var(--font-family-mono);
  font-size: 9px;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
}

.rail-devmode:hover {
  color: var(--color-accent);
}

.rail-devmode-dot {
  width: 6px;
  height: 6px;
  background: var(--color-disabled-text);
  border-radius: 50%;
}

.rail-devmode.is-on .rail-devmode-dot {
  background: var(--color-accent);
}

.site-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  margin-left: var(--space-9);
}

main {
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.site-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-6);
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-5) var(--space-6);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.site-footer p {
  margin: 0;
}

@media (max-width: 640px) {
  /*
   * Two-row compact bar, not a shrunk vertical rail (rotated text isn't legible at this
   * width). Row 1: brand + lang/dev-mode utilities. Row 2: kind nav, wrapped — a deliberate
   * mobile-specific treatment rather than the desktop rail scaled down, per the "literal
   * bleed needs its own mobile design" principle (docs/design-layout-references.md).
   * `.site` switches to a column flow so the (now non-fixed, sticky) bar stacks above
   * `.site-body` instead of sitting beside it as a flex row item.
   */
  .site {
    flex-direction: column;
  }

  .site-rail {
    position: sticky;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: var(--space-3);
    width: 100%;
    height: auto;
    padding: var(--space-3) var(--space-4);
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .rail-brand {
    order: 1;
    margin-right: auto;
    writing-mode: horizontal-tb;
    transform: none;
  }

  .rail-foot {
    order: 2;
    flex-direction: row;
    gap: var(--space-4);
  }

  .rail-nav {
    order: 3;
    flex-basis: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--space-2) var(--space-4);
  }

  .rail-link {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .rail-link.is-active::before {
    top: auto;
    bottom: -0.6em;
  }

  .rail-lang {
    flex-direction: row;
  }

  .rail-devmode {
    flex-direction: row;
  }

  .site-body {
    margin-left: 0;
  }
}

/*
 * Developer Mode x-ray skin, applied to plain site chrome. Same visual grammar as
 * packages/design-system/src/utils/xray.ts (dashed outline + monospace corner tag) so the
 * design system's structural language reads as one system, not something that stops at the
 * package boundary (PROJECT.md §4). Chrome is plain HTML outside any Shadow Root, so this
 * is a plain-CSS re-implementation rather than a shared import.
 */
[data-dev-mode] .site-rail,
[data-dev-mode] .rail-nav,
[data-dev-mode] main,
[data-dev-mode] .site-footer {
  position: relative;
  outline: 1px dashed var(--devmode-outline-color);
  outline-offset: -1px;
}

[data-dev-mode] .site-rail::before,
[data-dev-mode] .rail-nav::before,
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
