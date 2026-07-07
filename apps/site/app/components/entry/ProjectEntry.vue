<script setup lang="ts">
import type { ProjectCollectionItem } from '@nuxt/content'

const props = defineProps<{ entry: ProjectCollectionItem }>()

const stack = computed(() => props.entry.stack ?? [])
const links = computed(() => props.entry.links ?? [])
const gallery = computed(() => props.entry.gallery ?? [])
</script>

<template>
  <article>
    <p v-if="entry.status !== 'published'">
      Draft
    </p>
    <h1>{{ entry.title }}</h1>
    <p>{{ entry.description }}</p>
    <img
      v-if="entry.cover"
      :src="entry.cover.src"
      :alt="entry.cover.alt"
    >

    <dl>
      <template v-if="entry.role">
        <dt>Role</dt>
        <dd>{{ entry.role }}</dd>
      </template>
      <dt v-if="stack.length">
        Stack
      </dt>
      <dd v-if="stack.length">
        {{ stack.join(', ') }}
      </dd>
    </dl>

    <ul v-if="links.length">
      <li
        v-for="link in links"
        :key="link.href"
      >
        <a :href="link.href">{{ link.label }}</a>
      </li>
    </ul>

    <ContentRenderer :value="entry" />

    <ul v-if="gallery.length">
      <li
        v-for="image in gallery"
        :key="image.src"
      >
        <img
          :src="image.src"
          :alt="image.alt"
        >
        <figcaption v-if="image.caption">
          {{ image.caption }}
        </figcaption>
      </li>
    </ul>
  </article>
</template>
