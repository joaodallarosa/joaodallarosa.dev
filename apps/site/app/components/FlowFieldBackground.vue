<script setup lang="ts">
import type { FlowFieldHandle } from '~/utils/flow-field-sketch'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { mountFlowField } from '~/utils/flow-field-sketch'

const containerRef = useTemplateRef<HTMLDivElement>('container')
let handle: FlowFieldHandle | undefined

onMounted(() => {
  if (containerRef.value) handle = mountFlowField(containerRef.value)
})

onBeforeUnmount(() => {
  handle?.destroy()
})
</script>

<template>
  <div
    ref="container"
    class="flow-field"
    aria-hidden="true"
  />
</template>

<style scoped>
.flow-field {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* Fallback paint before the JS-generated paper-grain texture (see flow-field-sketch.ts's
     applyPaperTexture) lands — resolves to the current color-scheme's paper/bg token. */
  background-color: var(--color-bg);
  background-repeat: repeat;
}

.flow-field :deep(canvas) {
  display: block;
}
</style>
