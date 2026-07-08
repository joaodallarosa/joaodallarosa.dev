<script setup lang="ts">
import type { PostCollectionItem } from '@nuxt/content'

const props = defineProps<{ entry: PostCollectionItem }>()

// Rough placeholder: word count from rendered body isn't available pre-render,
// refine once real post bodies exist and rendering performance is measured.
const readingTimeMinutes = computed(() => Math.max(1, Math.round((props.entry.body?.value?.length ?? 0) / 100)))
</script>

<template>
  <article>
    <p v-if="entry.status !== 'published'">
      Draft
    </p>
    <header v-if="entry.cover">
      <NuxtImg
        :src="entry.cover.src"
        :alt="entry.cover.alt"
        loading="eager"
        sizes="100vw sm:80vw md:64rem"
      />
    </header>
    <h1>{{ entry.title }}</h1>
    <p>{{ entry.description }}</p>
    <p>{{ readingTimeMinutes }} min read</p>

    <!-- Table of contents hook point: render from entry.body.toc once real long-form posts exist -->

    <ContentRenderer :value="entry" />
  </article>
</template>
