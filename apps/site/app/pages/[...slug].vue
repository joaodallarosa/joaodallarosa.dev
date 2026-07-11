<script setup lang="ts">
import { resolveEntryByPath } from '~/composables/useEntry'

definePageMeta({ layout: 'content' })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const requestUrl = useRequestURL()

const { data: entry } = await useAsyncData(`entry-${route.path}`, () => resolveEntryByPath(route.path))

if (!entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
}

const backTo = computed(() => entry.value?.kind === 'project' ? '/project' : '/post')
const backLabel = computed(() => t('entry.backTo', {
  section: t(entry.value?.kind === 'project' ? 'nav.projects' : 'nav.posts'),
}))

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
    <NuxtLink
      :to="localePath(backTo)"
      class="mb-6 inline-flex items-center gap-2 font-mono text-base uppercase tracking-wide text-text-muted transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent"
    >
      <span aria-hidden="true">&larr;</span>
      {{ backLabel }}
    </NuxtLink>
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
