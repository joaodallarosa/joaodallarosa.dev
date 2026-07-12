<script setup lang="ts">
import type { NoteCollectionItem } from '@nuxt/content'

definePageMeta({ layout: 'content' })

const { t, locale } = useI18n()

const { data: notes } = await useAsyncData(`note-list-${locale.value}`, () =>
  queryCollection('note')
    .where('status', '=', 'published')
    .where('locale', '=', locale.value)
    .order('date', 'DESC')
    .all(),
)

function readingTime(entry: NoteCollectionItem) {
  return Math.max(1, Math.round((entry.body?.value?.length ?? 0) / 100))
}

function formattedDate(entry: NoteCollectionItem) {
  return new Date(entry.date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

useSeoMeta({
  title: () => t('nav.notes'),
  description: 'Writing on code, design systems, and whatever else is on the workbench.',
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <h1 class="mb-8 font-serif text-xl text-text sm:mb-12">
      {{ t('nav.notes') }}
    </h1>

    <p
      v-if="!notes?.length"
      class="font-mono text-base text-text-muted"
    >
      Nothing published yet.
    </p>

    <ul
      v-else
      class="flex flex-col divide-y divide-border"
    >
      <li
        v-for="note in notes"
        :key="note.path"
      >
        <NuxtLink
          :to="note.path"
          class="group flex flex-col gap-4 py-8 first:pt-0 sm:flex-row sm:gap-6"
        >
          <NuxtImg
            v-if="note.cover"
            :src="note.cover.src"
            :alt="note.cover.alt"
            width="240"
            height="126"
            loading="lazy"
            class="aspect-1200/630 w-full shrink-0 rounded-sm border border-border object-cover sm:w-60"
          />
          <div class="flex flex-col gap-2">
            <h2 class="font-serif text-lg leading-headline text-text transition-colors group-hover:text-accent">
              {{ note.title }}
            </h2>
            <p class="font-serif text-base leading-reading text-text-muted">
              {{ note.description }}
            </p>
            <p class="font-mono text-base uppercase tracking-wide text-text-muted">
              {{ formattedDate(note) }} · {{ readingTime(note) }} min read
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
