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

// Grid tiles use `thumbnail` when set, falling back to `cover` for projects that haven't
// defined a dedicated one. Square images by convention, but the src can point at a
// .mp4/.webm instead to show a looping clip in the tile.
function tileImage(project: ProjectCollectionItem) {
  return project.thumbnail ?? project.cover
}

function isVideoCover(project: ProjectCollectionItem) {
  return /\.(?:mp4|webm)$/i.test(tileImage(project)?.src ?? '')
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
      class="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2"
    >
      <li
        v-for="project in projects"
        :key="project.path"
      >
        <NuxtLink
          :to="project.path"
          class="group relative block aspect-square overflow-hidden bg-bg-raised"
        >
          <video
            v-if="tileImage(project)?.src && isVideoCover(project)"
            :src="tileImage(project)!.src"
            class="h-full w-full object-cover"
            autoplay
            muted
            loop
            playsinline
          />
          <NuxtImg
            v-else-if="tileImage(project)?.src"
            :src="tileImage(project)!.src"
            :alt="tileImage(project)!.alt"
            loading="lazy"
            class="h-full w-full object-cover"
          />
          <span
            class="absolute inset-0 flex items-end bg-black/40 p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span class="font-serif text-sm leading-headline text-white">
              {{ project.title }}
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
