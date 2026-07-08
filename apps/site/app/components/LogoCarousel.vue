<script setup lang="ts">
interface LogoItem {
  name: string
  src: string
  ratio: number
}

const props = defineProps<{
  items: LogoItem[]
  pinned?: LogoItem
}>()

const srLabel = computed(() => {
  const list = props.items.map(item => item.name).join(', ')
  return props.pinned ? `${props.pinned.name} — also: ${list}` : list
})
</script>

<template>
  <div class="logo-carousel">
    <span class="sr-only">{{ srLabel }}</span>

    <span
      v-if="pinned"
      class="logo-carousel-pinned"
      aria-hidden="true"
      :style="{ '--logo-src': `url(${pinned.src})`, 'aspect-ratio': pinned.ratio }"
    />

    <div class="logo-carousel-viewport">
      <div
        class="logo-carousel-track"
        aria-hidden="true"
      >
        <div
          v-for="rep in 2"
          :key="rep"
          class="logo-carousel-group"
        >
          <span
            v-for="item in items"
            :key="`${rep}-${item.name}`"
            class="brand-logo"
            :style="{ '--logo-src': `url(${item.src})`, 'aspect-ratio': item.ratio }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
  border: 0;
}

.logo-carousel {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Shared recolor technique: every source logo/icon comes in whatever color (or none) the
   original ships in — a CSS mask driven by --logo-src replaces that with one currentColor-ish
   fill, so the strip reads as one system and stays correct across the light/dark toggle (a
   hardcoded invert() filter would go invisible against a light background). Height is fixed
   and width comes from each item's real aspect-ratio (passed in, not guessed), so a flat
   wordmark like Giorgio Armani's isn't squeezed into a fixed box and shrunk to a sliver. */
.logo-carousel-pinned,
.brand-logo {
  display: inline-block;
  flex-shrink: 0;
  width: auto;
  background-color: var(--color-text-muted);
  -webkit-mask-image: var(--logo-src);
  mask-image: var(--logo-src);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.logo-carousel-pinned {
  height: 26px;
  padding-right: var(--space-4);
  background-color: var(--color-text);
  border-right: 1px solid var(--glass-border);
  opacity: 0.9;
}

.logo-carousel-viewport {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}

.logo-carousel-track {
  display: flex;
  width: max-content;
  animation: logo-carousel-scroll 26s linear infinite;
}

.logo-carousel:hover .logo-carousel-track {
  animation-play-state: paused;
}

.logo-carousel-group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-6);
  padding-right: var(--space-6);
}

.brand-logo {
  height: 22px;
  opacity: 0.6;
  transition: opacity var(--motion-duration-base) var(--motion-easing-mechanical);
}

.logo-carousel:hover .brand-logo {
  opacity: 0.9;
}

@keyframes logo-carousel-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-carousel-track {
    animation: none;
  }
}
</style>
