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
    </footer>
  </div>
</template>
