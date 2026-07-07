<script setup lang="ts">
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

const props = defineProps<{ label: string }>()

const mountEl = useTemplateRef<HTMLDivElement>('mount')
let root: Root | null = null

onMounted(() => {
  if (!mountEl.value) return
  root = createRoot(mountEl.value)
  root.render(createElement('ds-button', { variant: 'secondary' }, props.label))
})

onBeforeUnmount(() => {
  root?.unmount()
})
</script>

<template>
  <div ref="mount" />
</template>
