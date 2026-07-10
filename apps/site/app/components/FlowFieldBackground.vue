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
  <!-- Teleported to body: this is a truly viewport-fixed ambient background, and .site-body
       (default.vue) has `container-type: inline-size` for its own reasons, which would
       otherwise make it this element's containing block instead of the real viewport. -->
  <Teleport to="body">
    <!-- bg-bg: fallback paint before the JS-generated paper-grain texture (see
         flow-field-sketch.ts's applyPaperTexture) lands — resolves to the current
         color-scheme's paper/bg token. -->
    <div
      ref="container"
      class="pointer-events-none fixed inset-0 -z-1 overflow-hidden bg-bg bg-repeat"
      aria-hidden="true"
    />
  </Teleport>
</template>

<style scoped>
/* p5 injects a raw <canvas> into the container above at runtime — outside this template,
   so it can't carry a Tailwind class. Canvases default to display: inline, which leaves a
   few px of whitespace below; force block instead. Vue's scoped attribute still reaches this
   element post-Teleport, so no wrapper class is needed to anchor the selector. */
:deep(canvas) {
  display: block;
}
</style>
