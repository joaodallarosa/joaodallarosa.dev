<script setup lang="ts">
import type { LogCollectionItem } from '@nuxt/content'

defineProps<{ entry: LogCollectionItem }>()
</script>

<template>
  <article>
    <p v-if="entry.status !== 'published'">
      Draft
    </p>
    <h1>{{ entry.title }}</h1>
    <p>{{ entry.category }}</p>
    <p>{{ entry.description }}</p>

    <ul v-if="entry.materials?.length">
      <li
        v-for="material in entry.materials"
        :key="material.name"
      >
        {{ material.name }} <span v-if="material.quantity">({{ material.quantity }})</span>
      </li>
    </ul>

    <ol v-if="entry.steps?.length">
      <li
        v-for="(step, index) in entry.steps"
        :key="index"
      >
        {{ step }}
      </li>
    </ol>

    <ContentRenderer :value="entry" />
  </article>
</template>
