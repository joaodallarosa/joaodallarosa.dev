<script setup lang="ts">
import type { PostCollectionItem } from '@nuxt/content'

definePageMeta({ layout: 'content' })

const { t, locale } = useI18n()

const { data: posts } = await useAsyncData(`post-list-${locale.value}`, () =>
  queryCollection('post')
    .where('status', '=', 'published')
    .where('locale', '=', locale.value)
    .order('date', 'DESC')
    .all(),
)

function readingTime(entry: PostCollectionItem) {
  return Math.max(1, Math.round((entry.body?.value?.length ?? 0) / 100))
}

function formattedDate(entry: PostCollectionItem) {
  return new Date(entry.date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

useSeoMeta({
  title: () => t('nav.posts'),
  description: 'Writing on code, design systems, and whatever else is on the workbench.',
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <h1 class="mb-8 font-serif text-xl text-text sm:mb-12">
      {{ t('nav.posts') }}
    </h1>

    <p
      v-if="!posts?.length"
      class="font-mono text-base text-text-muted"
    >
      Nothing published yet.
    </p>

    <ul
      v-else
      class="flex flex-col divide-y divide-border"
    >
      <li
        v-for="post in posts"
        :key="post.path"
      >
        <NuxtLink
          :to="post.path"
          class="group flex flex-col gap-4 py-8 first:pt-0 sm:flex-row sm:gap-6"
        >
          <NuxtImg
            v-if="post.cover"
            :src="post.cover.src"
            :alt="post.cover.alt"
            width="240"
            height="126"
            loading="lazy"
            class="aspect-1200/630 w-full shrink-0 rounded-sm border border-border object-cover sm:w-60"
          />
          <div class="flex flex-col gap-2">
            <h2 class="font-serif text-lg leading-headline text-text transition-colors group-hover:text-accent">
              {{ post.title }}
            </h2>
            <p class="font-serif text-base leading-reading text-text-muted">
              {{ post.description }}
            </p>
            <p class="font-mono text-base uppercase tracking-wide text-text-muted">
              {{ formattedDate(post) }} · {{ readingTime(post) }} min read
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
