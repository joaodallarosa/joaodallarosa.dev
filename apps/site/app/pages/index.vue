<script setup lang="ts">
import { ENTRY_COLLECTIONS } from '~/composables/useEntry'

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const kindFilter = computed(() => {
  const kind = route.query.kind
  return typeof kind === 'string' && ENTRY_COLLECTIONS.includes(kind as never) ? kind : null
})

const { data: entries } = await useAsyncData(
  () => `home-feed-${locale.value}-${kindFilter.value ?? 'all'}`,
  async () => {
    const collections = kindFilter.value ? [kindFilter.value as typeof ENTRY_COLLECTIONS[number]] : ENTRY_COLLECTIONS
    const results = await Promise.all(
      collections.map(collection =>
        queryCollection(collection)
          .where('status', '=', 'published')
          .where('locale', '=', locale.value)
          .all(),
      ),
    )
    return results.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  { watch: [locale, kindFilter] },
)
</script>

<template>
  <div>
    <h1>joaodallarosa.dev</h1>

    <ul v-if="entries?.length">
      <li
        v-for="entry in entries"
        :key="entry.path"
      >
        <NuxtLink :to="localePath(entry.path)">
          {{ entry.title }}
        </NuxtLink>
        <span>({{ entry.kind }})</span>
        <span
          v-for="tag in entry.tags"
          :key="tag"
        >#{{ tag }}</span>
      </li>
    </ul>
    <p v-else>
      No published entries yet.
    </p>
  </div>
</template>
