<script setup lang="ts">
import { resolveEntryByPath } from '~/composables/useEntry'

definePageMeta({ layout: 'content' })

const route = useRoute()
const requestUrl = useRequestURL()

const { data: entry } = await useAsyncData(`entry-${route.path}`, () => resolveEntryByPath(route.path))

if (!entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
}

const canonicalUrl = computed(() => new URL(route.path, requestUrl.origin).toString())

useSeoMeta({
  title: () => entry.value?.title,
  description: () => entry.value?.description,
  ogTitle: () => entry.value?.title,
  ogDescription: () => entry.value?.description,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: () => entry.value?.cover ? new URL(entry.value.cover.src, requestUrl.origin).toString() : undefined,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <div v-if="entry">
    <EntryProjectEntry
      v-if="entry.kind === 'project'"
      :entry="entry"
    />
    <EntryPostEntry
      v-else-if="entry.kind === 'post'"
      :entry="entry"
    />
  </div>
</template>
