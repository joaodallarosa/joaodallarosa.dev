<script setup lang="ts">
import type { NoteCollectionItem } from '@nuxt/content'

defineProps<{ entry: NoteCollectionItem }>()
</script>

<template>
  <article>
    <p v-if="entry.status !== 'published'">
      Draft
    </p>
    <h1>{{ entry.title }}</h1>
    <ContentRenderer :value="entry" />
  </article>
</template>
