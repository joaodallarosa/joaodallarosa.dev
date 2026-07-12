<script setup lang="ts">
import type { SketchHandle } from '~/utils/sketch-canvas'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { projectSketchRegistry } from '~/sketches'

// Usable from markdown content as `::p5js-sketch{sketch="anxiety-tree"}` — see
// app/sketches/index.ts for the registry of available slugs. `aspect="wide"` is for sketches
// that expect a rectangular canvas rather than the default square tile.
// `auto-start` skips the click gate and mounts on load (see onMounted below) — use sparingly,
// e.g. a project's hero sketch, since it still pulls in p5 (~300KB) on first paint.
const props = withDefaults(defineProps<{
  sketch: string
  prompt?: string
  caption?: string
  aspect?: 'square' | 'wide'
  autoStart?: boolean
}>(), {
  prompt: 'Click to run',
  caption: undefined,
  aspect: 'square',
  autoStart: false,
})

const containerRef = useTemplateRef<HTMLDivElement>('container')
const started = ref(false)
const failed = ref(false)
const devModeSupported = ref(false)
const devModeActive = ref(false)
let handle: SketchHandle | undefined
// Set on unmount and re-checked after each await below — start() spans two async gaps
// (the sketch chunk's dynamic import, then the sketch's own p5/Tone setup), and if the
// component unmounts mid-flight the container ref goes null before those resolve.
let destroyed = false

async function start() {
  if (started.value || destroyed || !containerRef.value) return
  const container = containerRef.value
  const loadSketch = projectSketchRegistry[props.sketch]
  if (!loadSketch) {
    failed.value = true
    return
  }
  const { default: mount } = await loadSketch()
  if (destroyed) return
  const mounted = await mount(container)
  if (destroyed) {
    mounted.destroy()
    return
  }
  handle = mounted
  devModeSupported.value = !!handle.toggleDevMode
  devModeActive.value = false
  started.value = true
}

function reset() {
  handle?.destroy()
  handle = undefined
  started.value = false
  devModeSupported.value = false
  devModeActive.value = false
  start()
}

function toggleDevMode() {
  if (!handle?.toggleDevMode) return
  devModeActive.value = handle.toggleDevMode()
}

// autoStart still respects prefers-reduced-motion (docs/conventions.md) — visitors who've
// asked for reduced motion get the ordinary click gate instead of an unrequested animation.
onMounted(() => {
  if (props.autoStart && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start()
  }
})

onBeforeUnmount(() => {
  destroyed = true
  handle?.destroy()
})
</script>

<template>
  <figure class="not-prose my-4">
    <!-- max-w-[68ch] (not a px value) matches the global `p { max-width: 68ch }` rule in
         base.css, so the embed lines up flush with the surrounding article text instead of
         drifting narrower/wider than it at different aspect ratios or font sizes. No
         mx-auto: centering would offset this from the paragraphs' left edge above/below it. -->
    <div
      class="relative w-full max-w-[68ch] overflow-hidden rounded-sm border border-border bg-bg"
      :class="aspect === 'wide' ? 'aspect-video' : 'aspect-square'"
    >
      <div
        ref="container"
        class="h-full w-full"
      />
      <p
        v-if="failed"
        class="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-sm text-text-muted"
      >
        Unknown sketch: "{{ sketch }}"
      </p>
      <button
        v-else-if="!started"
        type="button"
        class="absolute inset-0 flex items-center justify-center bg-bg/90 font-mono text-sm text-text transition-colors hover:text-accent"
        @click="start"
      >
        {{ prompt }}
      </button>
      <div
        v-else
        class="absolute right-2 top-2 flex gap-2"
      >
        <button
          v-if="devModeSupported"
          type="button"
          class="rounded-full border border-border bg-bg/80 px-3 py-1 font-mono text-xs text-text-muted transition-colors hover:text-accent"
          :class="{ 'text-accent border-accent': devModeActive }"
          :aria-pressed="devModeActive"
          @click="toggleDevMode"
        >
          Dev mode
        </button>
        <button
          type="button"
          class="rounded-full border border-border bg-bg/80 px-3 py-1 font-mono text-xs text-text-muted transition-colors hover:text-accent"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </div>
    <figcaption
      v-if="caption"
      class="mt-2 font-mono text-sm text-text-muted"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
