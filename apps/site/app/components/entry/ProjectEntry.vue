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
    <p
      v-if="entry.description"
      class="text-lg leading-snug"
    >
      {{ entry.description }}
    </p>
    <header
      v-if="entry.cover?.src"
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

    <dl
      v-if="entry.role || stack.length"
      class="mb-6 flex flex-col gap-3 font-mono text-sm text-text-muted sm:flex-row sm:flex-wrap sm:gap-x-8"
    >
      <div
        v-if="entry.role"
        class="flex items-baseline gap-2"
      >
        <dt class="uppercase tracking-wide">
          Role
        </dt>
        <dd class="text-text">
          {{ entry.role }}
        </dd>
      </div>
      <div
        v-if="stack.length"
        class="flex flex-wrap items-center gap-2"
      >
        <dt class="uppercase tracking-wide">
          Stack
        </dt>
        <dd class="flex flex-wrap gap-2">
          <span
            v-for="tech in stack"
            :key="tech"
            class="rounded-full border border-border px-2.5 py-0.5 text-xs uppercase tracking-wide text-text-muted"
          >
            {{ tech }}
          </span>
        </dd>
      </div>
    </dl>

    <ul
      v-if="links.length"
      class="mb-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-wide"
    >
      <li
        v-for="link in links"
        :key="link.href"
      >
        <a
          :href="link.href"
          class="inline-flex items-center gap-1 text-accent transition-colors duration-(--motion-duration-base) ease-mechanical hover:text-accent-hover"
        >
          {{ link.label }}
          <span aria-hidden="true">&rarr;</span>
        </a>
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
