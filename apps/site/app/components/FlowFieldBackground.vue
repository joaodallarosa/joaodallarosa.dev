<script setup lang="ts">
import type { FlowFieldHandle } from '~/utils/flow-field-sketch'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { mountFlowField } from '~/utils/flow-field-sketch'

const { scheme } = useColorScheme()
const containerRef = useTemplateRef<HTMLDivElement>('container')
let handle: FlowFieldHandle | undefined
// Bumped on every (re)mount attempt so a stale async mountFlowField() resolving after a
// newer scheme switch (or unmount) discards its instance instead of clobbering the live one.
let generation = 0

async function mount() {
  if (!containerRef.value) return
  const thisGeneration = ++generation
  const mounted = await mountFlowField(containerRef.value, scheme.value)
  if (thisGeneration !== generation) mounted.destroy()
  else handle = mounted
}

onMounted(mount)

// The sketch reads its ink/paper palette once at mount time (see flow-field-sketch.ts), so a
// live scheme switch needs a fresh instance rather than a reactive prop.
watch(scheme, () => {
  handle?.destroy()
  handle = undefined
  mount()
})

onBeforeUnmount(() => {
  generation++
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
