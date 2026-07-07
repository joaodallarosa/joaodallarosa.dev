<script setup lang="ts">
import { resolveEntryByPath } from '~/composables/useEntry'

const route = useRoute()

const { data: entry } = await useAsyncData(`entry-${route.path}`, () => resolveEntryByPath(route.path))

if (!entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
}
</script>

<template>
  <div v-if="entry">
    <EntryProjectEntry
      v-if="entry.kind === 'project'"
      :entry="entry"
    />
    <EntryPostEntry
      v-else-if="entry.kind === 'post'"
      :entry="entry"
    />
    <EntryNoteEntry
      v-else-if="entry.kind === 'note'"
      :entry="entry"
    />
    <EntryLogEntry
      v-else-if="entry.kind === 'log'"
      :entry="entry"
    />
  </div>
</template>
