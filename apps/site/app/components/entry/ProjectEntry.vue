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
    <h1 class="text-4xl leading-tight sm:text-5xl">
      {{ entry.title }}
    </h1>
    <p>{{ entry.description }}</p>
    <NuxtImg
      v-if="entry.cover"
      :src="entry.cover.src"
      :alt="entry.cover.alt"
      loading="eager"
      sizes="100vw sm:80vw md:64rem"
    />

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
        <NuxtImg
          :src="image.src"
          :alt="image.alt"
          loading="lazy"
          sizes="100vw sm:80vw md:64rem"
        />
        <figcaption v-if="image.caption">
          {{ image.caption }}
        </figcaption>
      </li>
    </ul>
  </article>
</template>
