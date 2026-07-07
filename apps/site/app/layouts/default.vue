<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

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
    <header class="site-header">
      <NuxtLink
        :to="localePath('/')"
        class="site-title"
      >
        joaodallarosa.dev
      </NuxtLink>

      <nav aria-label="Entry kinds">
        <NuxtLink
          v-for="item in kindNavItems"
          :key="item.kind"
          :to="{ path: localePath('/'), query: { kind: item.kind } }"
        >
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <nav :aria-label="t('language.label')">
        <NuxtLink
          v-for="l in availableLocales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
        >
          {{ l.name ?? l.code }}
        </NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Joao Dallarosa</p>
      <NuxtLink :to="localePath('/showcase')">
        Component showcase
      </NuxtLink>
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
  max-width: 64rem;
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
</style>
