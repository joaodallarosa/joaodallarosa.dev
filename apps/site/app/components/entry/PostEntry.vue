<script setup lang="ts">
import type { PostCollectionItem } from '@nuxt/content'

const props = defineProps<{ entry: PostCollectionItem }>()

const { locale } = useI18n()

// Rough placeholder: word count from rendered body isn't available pre-render,
// refine once real post bodies exist and rendering performance is measured.
const readingTimeMinutes = computed(() => Math.max(1, Math.round((props.entry.body?.value?.length ?? 0) / 100)))

const formattedDate = computed(() => new Date(props.entry.date).toLocaleDateString(locale.value, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}))
</script>

<template>
  <article>
    <p v-if="entry.status !== 'published'">
      Draft
    </p>
    <header
      v-if="entry.cover"
      class="mb-6 overflow-hidden rounded-lg sm:mb-8"
    >
      <NuxtImg
        :src="entry.cover.src"
        :alt="entry.cover.alt"
        loading="eager"
        sizes="100vw sm:80vw md:64rem"
        class="w-full"
      />
    </header>
    <h1 class="text-4xl leading-tight sm:text-5xl">
      {{ entry.title }}
    </h1>
    <p
      v-if="entry.description"
      class="mb-2 text-lg leading-snug"
    >
      {{ entry.description }}
    </p>
    <p class="mb-6 font-mono text-base uppercase tracking-wide text-text-muted">
      {{ formattedDate }} · {{ readingTimeMinutes }} min read
    </p>

    <!-- Table of contents hook point: render from entry.body.toc once real long-form posts exist -->

    <ContentRenderer :value="entry" />
  </article>
</template>
