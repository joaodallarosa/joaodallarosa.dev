<script setup lang="ts">
import type { ProjectCollectionItem } from '@nuxt/content'

definePageMeta({ layout: 'content' })

const { t, locale } = useI18n()

const { data: projects } = await useAsyncData(`project-list-${locale.value}`, () =>
  queryCollection('project')
    .where('status', '=', 'published')
    .where('locale', '=', locale.value)
    .order('date', 'DESC')
    .all(),
)

function formattedDate(entry: ProjectCollectionItem) {
  return new Date(entry.date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

useSeoMeta({
  title: () => t('nav.projects'),
  description: 'Selected projects — from production e-commerce work to small design-system experiments.',
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <h1 class="mb-8 font-serif text-xl text-text sm:mb-12">
      {{ t('nav.projects') }}
    </h1>

    <p
      v-if="!projects?.length"
      class="font-mono text-base text-text-muted"
    >
      Nothing published yet.
    </p>

    <ul
      v-else
      class="flex flex-col divide-y divide-border"
    >
      <li
        v-for="project in projects"
        :key="project.path"
      >
        <NuxtLink
          :to="project.path"
          class="group flex flex-col gap-4 py-8 first:pt-0 sm:flex-row sm:gap-6"
        >
          <NuxtImg
            v-if="project.cover"
            :src="project.cover.src"
            :alt="project.cover.alt"
            width="240"
            height="126"
            loading="lazy"
            class="aspect-1200/630 w-full shrink-0 rounded-sm border border-border object-cover sm:w-60"
          />
          <div class="flex flex-col gap-2">
            <h2 class="font-serif text-lg leading-headline text-text transition-colors group-hover:text-accent">
              {{ project.title }}
            </h2>
            <p class="font-serif text-base leading-reading text-text-muted">
              {{ project.description }}
            </p>
            <p
              v-if="project.role"
              class="font-mono text-base uppercase tracking-wide text-text-muted"
            >
              {{ formattedDate(project) }}<template v-if="project.role"> · {{ project.role }}</template>
            </p>
            <ul
              v-if="project.stack?.length"
              class="flex flex-wrap gap-2"
            >
              <li
                v-for="tech in project.stack"
                :key="tech"
                class="rounded-full border border-border px-3 py-1 font-mono text-base text-text-muted"
              >
                {{ tech }}
              </li>
            </ul>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
