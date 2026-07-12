<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

// Ported from creative/pages/nuggets — a pure CSS 3D box, no p5/canvas involved at all, so it
// lives alongside P5jsSketch as its own content component rather than going through the
// sketch registry. Usable from markdown content as `::nuggets-box`.
type Side = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom'
const SIDES = ['front', 'right', 'back', 'left', 'top', 'bottom'] as const satisfies readonly Side[]

const BOX_WIDTH = 700
const BOX_HEIGHT = 180
const BOX_DEPTH = 500

const cubeRef = useTemplateRef<HTMLDivElement>('cube')
const frontRef = useTemplateRef<HTMLDivElement>('front')
const backRef = useTemplateRef<HTMLDivElement>('back')
const rightRef = useTemplateRef<HTMLDivElement>('right')
const leftRef = useTemplateRef<HTMLDivElement>('left')
const bottomRef = useTemplateRef<HTMLDivElement>('bottom')
const topRef = useTemplateRef<HTMLDivElement>('top')

const side = ref<Side>('front')
let currentSideClass = ''

// The original set these via JS rather than static CSS so the box's proportions live in one
// place (BOX_WIDTH/HEIGHT/DEPTH) instead of six duplicated class rules; inline styles here
// intentionally take priority over the same-named transform rules in <style>, which only
// carry the non-geometry properties (text layout, transform-origin) that inline doesn't set.
function layoutFaces() {
  if (frontRef.value) {
    Object.assign(frontRef.value.style, {
      height: `${BOX_HEIGHT}px`,
      width: `${BOX_WIDTH}px`,
      background: '#e32929',
      transform: `rotateY(0deg) translateZ(${BOX_DEPTH / 2}px)`,
    })
  }
  if (rightRef.value) {
    Object.assign(rightRef.value.style, {
      height: `${BOX_HEIGHT}px`,
      width: `${BOX_DEPTH}px`,
      background: '#cc2424',
      transform: `rotateY(90deg) translateZ(${BOX_WIDTH - BOX_DEPTH / 2}px)`,
    })
  }
  if (leftRef.value) {
    Object.assign(leftRef.value.style, {
      height: `${BOX_HEIGHT}px`,
      width: `${BOX_DEPTH}px`,
      background: '#cc2424',
      transform: `rotateY(90deg) translateZ(${-BOX_DEPTH / 2}px)`,
    })
  }
  if (backRef.value) {
    Object.assign(backRef.value.style, {
      height: `${BOX_HEIGHT}px`,
      width: `${BOX_WIDTH}px`,
      background: '#b52020',
      transform: `rotateY(180deg) translateZ(${BOX_DEPTH / 2}px)`,
    })
  }
  if (bottomRef.value) {
    Object.assign(bottomRef.value.style, {
      height: `${BOX_DEPTH}px`,
      width: `${BOX_WIDTH}px`,
      background: '#b52020',
      transform: `rotateX(90deg) translateZ(${BOX_DEPTH / 2 - BOX_HEIGHT}px)`,
    })
  }
  if (topRef.value) {
    topRef.value.classList.remove('cube__face--top--opened')
    Object.assign(topRef.value.style, {
      height: `${BOX_DEPTH}px`,
      width: `${BOX_WIDTH}px`,
      background: 'yellow',
      transform: `translateZ(${-BOX_DEPTH / 2}px) rotateX(90deg)`,
    })
  }
}

function showSide(next: Side) {
  side.value = next
  const cube = cubeRef.value
  if (!cube) return
  const nextClass = `show-${next}`
  if (currentSideClass) cube.classList.remove(currentSideClass)
  cube.classList.add(nextClass)
  currentSideClass = nextClass
}

function openBox() {
  showSide('front')
  const top = topRef.value
  if (!top) return
  top.classList.add('cube__face--top--opened')
  top.style.transform = `translateZ(${-BOX_DEPTH / 2}px) rotateX(120deg)`
}

function reset() {
  layoutFaces()
  showSide('front')
}

onMounted(() => {
  layoutFaces()
  showSide('front')
})
</script>

<template>
  <figure class="not-prose my-8">
    <figcaption class="mb-2 font-mono text-sm text-text-muted">
      A CSS-only easter egg from the original site — no canvas, just six divs and a lot of
      `translateZ`. Pick a side, then open the box.
    </figcaption>
    <div class="overflow-x-auto rounded-sm border border-border bg-bg p-4">
      <div class="scene">
        <div
          ref="cube"
          class="cube"
        >
          <div
            ref="front"
            class="cube__face cube__face--front"
          >
            SURPRISE INSIDE!
          </div>
          <div
            ref="back"
            class="cube__face"
          />
          <div
            ref="right"
            class="cube__face"
          />
          <div
            ref="left"
            class="cube__face"
          />
          <div
            ref="bottom"
            class="cube__face"
          />
          <div
            ref="top"
            class="cube__face cube__face--top"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/ae/Los_Pollos_Hermanos_logo.png"
              alt="Los Pollos Hermanos logo"
            >
          </div>
          <div class="cube__face cube__face--inside">
            THIS WAS MADE ONLY WITH CSS
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-4 font-mono text-sm text-text-muted">
        <label
          v-for="option in SIDES"
          :key="option"
          class="inline-flex items-center gap-1"
        >
          <input
            type="radio"
            name="nuggets-side"
            :checked="side === option"
            @change="showSide(option)"
          >
          {{ option }}
        </label>
        <button
          type="button"
          class="ml-auto rounded-full border border-border px-3 py-1 text-text transition-colors hover:text-accent"
          @click="openBox"
        >
          Open the box
        </button>
        <button
          type="button"
          class="rounded-full border border-border px-3 py-1 text-text-muted transition-colors hover:text-accent"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.scene {
  width: 700px;
  height: 700px;
  perspective: 400px;
}

.cube {
  width: 200px;
  height: 50px;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-800px);
  transition: transform 1s;
}

.cube.show-front {
  transform: translateZ(-300px) rotateY(30deg) translateY(300px) rotateX(-30deg);
}
.cube.show-right {
  transform: translateZ(-800px) rotateY(-60deg) translateY(300px) rotateX(-20deg);
}
.cube.show-back {
  transform: translateZ(-600px) rotateY(-190deg) translateY(800px) rotateX(-20deg);
}
.cube.show-left {
  transform: translateZ(-400px) rotateY(60deg) translateY(300px) rotateX(-20deg);
}
.cube.show-top {
  transform: translateZ(-400px) rotateX(-90deg);
}
.cube.show-bottom {
  transform: translateZ(-400px) translateY(300px) rotateX(90deg);
}

.cube__face {
  position: absolute;
  border: 1px solid #222;
}

.cube__face--front {
  color: yellow;
  text-align: center;
  padding-top: 40px;
  font-size: 40px;
}

.cube__face--top {
  transform-origin: 50% top;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cube__face--top--opened {
  transition: transform 1s ease-out;
  transform-origin: 50% top;
}

.cube__face--inside {
  background-color: white;
  width: 700px;
  font-size: 40px;
}
</style>
