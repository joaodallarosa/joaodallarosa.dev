<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

// Ported from the standalone `tarot-picker` repo — a pure CSS 3D deck of 22 cards. Click the
// deck to shuffle (a restart-the-CSS-animation trick), then draw up to 3 cards. The original
// sized cards off `window.screen.width` (a fullscreen-page assumption); adapted here to size
// off the embed container instead, and CSS custom properties are set on the container rather
// than `document.body` so they don't leak into the rest of the page.
withDefaults(defineProps<{
  prompt?: string
  caption?: string
}>(), {
  prompt: 'Clique nas cartas para embaralhar',
  caption: undefined,
})

const ALL_CARDS = Array.from({ length: 22 }, (_, i) => i + 1)
let tarot = [...ALL_CARDS]
let takenCards = 0
const cleanupFns: (() => void)[] = []

const containerRef = useTemplateRef<HTMLDivElement>('container')
const deckRef = useTemplateRef<HTMLDivElement>('deck')
const backCardRef = useTemplateRef<HTMLDivElement>('backCard')
const takenContainerRef = useTemplateRef<HTMLDivElement>('takenContainer')

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

function shuffle<T>(array: T[]) {
  for (let currentIndex = array.length; currentIndex !== 0;) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex]!, array[currentIndex]!]
  }
  return array
}

function calcCardSize() {
  const container = containerRef.value
  if (!container) return
  const available = container.getBoundingClientRect().width || window.innerWidth
  const cardWidth = Math.min(available / 3, 300)
  container.style.setProperty('--card-width', `${cardWidth}px`)
  container.style.setProperty('--card-height', `${cardWidth * 1.84}px`)
}

function onDeckClick() {
  shuffle(tarot)
  const container = containerRef.value
  const deck = deckRef.value
  const backCard = backCardRef.value
  if (!container || !deck || !backCard) return

  container.style.setProperty('--card-back-rotation', `${getRndInteger(-20, 20)}deg`)
  container.style.setProperty('--deck-rotation', `${getRndInteger(-10, 10)}deg`)

  backCard.classList.add('animate')
  deck.classList.add('animate-deck')

  // Restart the CSS animation from scratch on every click rather than letting a still-running
  // one continue: briefly clear it, then let the classes above re-trigger it.
  backCard.style.setProperty('-webkit-animation', 'none')
  deck.style.setProperty('-webkit-animation', 'none')
  const timeout = setTimeout(() => {
    backCard.style.removeProperty('-webkit-animation')
    deck.style.removeProperty('-webkit-animation')
  }, 10)
  cleanupFns.push(() => clearTimeout(timeout))
}

function animateElemFromTo(elem: HTMLElement, fromElem: HTMLElement, toElem: HTMLElement) {
  elem.style.top = `${fromElem.offsetTop}px`
  elem.style.left = `${fromElem.offsetLeft}px`
  toElem.style.height = `${elem.offsetHeight}px`

  const flipTimeout = setTimeout(() => {
    const inner = elem.getElementsByClassName('taken-card__inner')[0] as HTMLElement | undefined
    if (inner) inner.style.transform = 'rotateY(180deg)'
  }, 800)
  const moveTimeout = setTimeout(() => {
    elem.style.transform = `translateY(${toElem.offsetTop - fromElem.offsetTop}px) translateX(${
      (toElem.offsetLeft - fromElem.offsetLeft) + ((toElem.offsetWidth - elem.offsetWidth) / 2)
    }px)`
  }, 10)
  cleanupFns.push(() => clearTimeout(flipTimeout), () => clearTimeout(moveTimeout))
}

function drawCard() {
  const deck = deckRef.value
  const takenContainer = takenContainerRef.value
  if (takenCards > 2 || !deck || !takenContainer) return

  takenCards++
  const cardNumber = tarot.shift()!

  const takenCard = document.createElement('div')
  takenCard.classList.add('taken-card')
  const inner = document.createElement('div')
  inner.classList.add('taken-card__inner')
  const front = document.createElement('div')
  front.classList.add('taken-card__front')
  const back = document.createElement('div')
  back.classList.add('taken-card__back')
  back.style.backgroundImage = `url(/projects/tarot-picker/${cardNumber}.jpg)`
  inner.appendChild(front)
  inner.appendChild(back)
  takenCard.appendChild(inner)

  const slot = takenContainer.children[takenCards - 1] as HTMLElement
  slot.appendChild(takenCard)
  animateElemFromTo(takenCard, deck, slot)
}

function reset() {
  tarot = [...ALL_CARDS]
  takenCards = 0
  if (takenContainerRef.value) {
    for (const slot of Array.from(takenContainerRef.value.children)) slot.innerHTML = ''
  }
  backCardRef.value?.classList.remove('animate')
  deckRef.value?.classList.remove('animate-deck')
}

onMounted(() => {
  calcCardSize()
  window.addEventListener('resize', calcCardSize)
  cleanupFns.push(() => window.removeEventListener('resize', calcCardSize))
})

onBeforeUnmount(() => cleanupFns.forEach(fn => fn()))
</script>

<template>
  <figure class="not-prose my-8">
    <figcaption
      v-if="caption"
      class="mb-2 font-mono text-sm text-text-muted"
    >
      {{ caption }}
    </figcaption>
    <div
      ref="container"
      class="tarot-picker overflow-x-auto rounded-sm border border-border bg-bg p-6 text-center"
    >
      <p class="mb-4 font-mono text-sm text-text-muted">
        {{ prompt }}
      </p>

      <div class="tarot-scene">
        <div
          ref="deck"
          class="deck"
          @click="onDeckClick"
        />
        <div
          ref="backCard"
          class="back-card"
        />
      </div>

      <div class="mt-6 flex justify-center gap-4">
        <button
          type="button"
          class="rounded-full border border-border px-4 py-2 font-mono text-sm text-text transition-colors hover:text-accent"
          @click="drawCard"
        >
          Tirar Carta
        </button>
        <button
          type="button"
          class="rounded-full border border-border px-4 py-2 font-mono text-sm text-text-muted transition-colors hover:text-accent"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <div
        ref="takenContainer"
        class="taken-card-container mt-6"
      >
        <div />
        <div />
        <div />
      </div>
    </div>
  </figure>
</template>

<style scoped>
.tarot-picker {
  --card-width: 300px;
  --card-height: 552px;
  --card-back-rotation: 20deg;
  --deck-rotation: -10deg;
  --animation-timing: 0.7s;
  --card-border-radius: 10px;
}

.tarot-scene {
  margin: 0 auto;
  width: var(--card-width);
  position: relative;
}

.deck {
  position: relative;
  width: var(--card-width);
  height: var(--card-height);
  border-radius: var(--card-border-radius);
  background-image: url('/projects/tarot-picker/pattern.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 2px 1px 1px rgb(0 0 0 / 15%);
  transform-style: preserve-3d;
  transform: translateZ(0);
  cursor: pointer;
}

.deck::before,
.deck::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/projects/tarot-picker/pattern.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 2px 1px 1px rgb(0 0 0 / 15%);
}
.deck::before {
  left: 4px;
  top: 4px;
  z-index: -5;
  transform: translateZ(-0.25rem);
}
.deck::after {
  left: 8px;
  top: 8px;
  z-index: -6;
  transform: translateZ(-0.5rem);
}

.back-card {
  position: absolute;
  width: var(--card-width);
  height: var(--card-height);
  z-index: -1;
  border-radius: var(--card-border-radius);
  background-image: url('/projects/tarot-picker/pattern.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: none;
  transform-style: preserve-3d;
}

.taken-card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.taken-card-container > div {
  position: relative;
  width: 100%;
}

.animate-deck {
  animation: deckTilt var(--animation-timing) forwards;
}
.animate {
  animation: shuffle var(--animation-timing) forwards;
}

@keyframes deckTilt {
  50% {
    transform: translateX(calc(var(--card-width) / 2 * -1)) rotate3d(0, 1, 0, -40deg) rotate3d(0, 0, 1, var(--deck-rotation));
  }
}

@keyframes shuffle {
  from {
    box-shadow: 5px 0 8px -10px #333;
    transform: scale(0.6) translateZ(-30px);
    z-index: -1;
  }
  50% {
    transform: translateZ(-30px) translateX(calc(var(--card-width) / 1.3)) rotate3d(0, 0, 1, var(--card-back-rotation)) rotate3d(1, 0, 0, 20deg) rotate3d(0, 1, 0, -10deg);
    box-shadow: 5px 0 18px -10px #333;
    z-index: -1;
  }
  51% {
    transform: translateZ(500px) translateX(calc(var(--card-width) / 1.3)) rotate3d(0, 0, 1, var(--card-back-rotation)) rotate3d(1, 0, 0, 20deg) rotate3d(0, 1, 0, -10deg);
    z-index: 999;
  }
}

/* Created dynamically via document.createElement, so they never receive Vue's scoped
   data attribute — :deep() keeps these rules applying to them anyway. */
:deep(.taken-card) {
  position: absolute;
  width: var(--card-width);
  height: var(--card-height);
  z-index: 1;
  border-radius: 5px;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: translateZ(5rem);
}
:deep(.taken-card__inner) {
  width: 100%;
  height: 100%;
  transition: transform var(--animation-timing);
  transform-style: preserve-3d;
}
:deep(.taken-card__front),
:deep(.taken-card__back) {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--card-border-radius);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
:deep(.taken-card__front) {
  background-color: #bbb;
  background-image: url('/projects/tarot-picker/pattern.png');
}
:deep(.taken-card__back) {
  background-size: contain;
  color: white;
  transform: rotateY(180deg);
}
</style>
