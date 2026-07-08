<script setup lang="ts">
import { ENTRY_COLLECTIONS } from '~/composables/useEntry'

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { devMode } = useDevMode()

// Homepage-only re-theme for the ink-on-paper flow field background (Phase 5): flips every
// dark-mode-first token in tokens.css to its existing [data-color-scheme='light'] override.
// Scoped to this page via useHead's component lifecycle — Nuxt/unhead removes this htmlAttrs
// entry on navigation away, reverting <html> to the default (dark) scheme automatically, and
// it's applied during SSR too so there's no dark-then-light flash on first load.
useHead({ htmlAttrs: { 'data-color-scheme': 'light' } })

const kindFilter = computed(() => {
  const kind = route.query.kind
  return typeof kind === 'string' && ENTRY_COLLECTIONS.includes(kind as never) ? kind : null
})

const { data: entries } = await useAsyncData(
  () => `home-feed-${locale.value}-${kindFilter.value ?? 'all'}`,
  async () => {
    const collections = kindFilter.value ? [kindFilter.value as typeof ENTRY_COLLECTIONS[number]] : ENTRY_COLLECTIONS
    const results = await Promise.all(
      collections.map(collection =>
        queryCollection(collection)
          .where('status', '=', 'published')
          .where('locale', '=', locale.value)
          .all(),
      ),
    )
    return results.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  { watch: [locale, kindFilter] },
)

const dateFormatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value)).toUpperCase()
}

// Archive Log composition (Phase 4 "Liquid Obsidian" pass): entries alternate width/alignment
// in a stacked flow rather than a uniform grid — the earlier grid-of-tiles draft was rejected
// as reading like a checklist of patterns instead of a composed layout. Cycles so it still
// reads intentionally past three entries.
const LOG_LAYOUTS = ['log-item--wide-left', 'log-item--narrow-right', 'log-item--center']
function layoutClass(index: number) {
  return LOG_LAYOUTS[index % LOG_LAYOUTS.length]
}
function objectTag(index: number) {
  return `OBJ_${String(index + 1).padStart(2, '0')}`
}
function figureTag(index: number) {
  return `FIG. ${String.fromCharCode(65 + (index % 26))}`
}

const marqueeItems = ['/// joaodallarosa.dev', 'personal publication', 'working lab', 'projects — posts — notes — logs']
const marqueeRepeats = Array.from({ length: 4 })
</script>

<template>
  <div class="home">
    <FlowFieldBackground />

    <section
      class="hero"
      data-devmode-label="home[hero]"
    >
      <p
        class="hero-watermark"
        aria-hidden="true"
      >
        LAB
      </p>

      <p class="hero-eyebrow">
        Personal site / design system lab
      </p>

      <h1 class="hero-mark">
        <span class="hero-mark-line hero-mark-line--crop">joao</span>
        <span class="hero-mark-line hero-mark-line--accent">dallarosa</span>
      </h1>

      <div class="hero-panel">
        <p class="hero-panel-text">
          A personal publication with a working lab attached — dev projects, creative
          coding, and everything else, in one voice.
        </p>
        <div class="hero-panel-links">
          <NuxtLink :to="{ path: localePath('/'), query: { kind: 'project' } }">
            Projects
          </NuxtLink>
          <NuxtLink :to="{ path: localePath('/'), query: { kind: 'post' } }">
            Posts →
          </NuxtLink>
        </div>
      </div>

      <div class="hero-meta">
        <p>LOCALE: {{ locale.toUpperCase() }}</p>
        <p>ENTRIES INDEXED: {{ entries?.length ?? 0 }}</p>
        <div
          class="hero-status"
          :class="{ 'is-dev': devMode }"
        >
          <span class="hero-status-dot" />
          SYS.STATUS: {{ devMode ? 'DEV MODE' : 'ONLINE' }}
        </div>
      </div>
    </section>

    <div
      class="marquee"
      aria-hidden="true"
    >
      <div class="marquee-track">
        <template
          v-for="i in marqueeRepeats"
          :key="i"
        >
          <span
            v-for="item in marqueeItems"
            :key="item"
            class="marquee-item"
          >{{ item }}</span>
        </template>
      </div>
    </div>

    <section
      class="log"
      data-devmode-label="home[archive-log]"
    >
      <div class="log-header">
        <h2>Archive Log</h2>
        <p class="log-index-label">
          Index of entries
        </p>
      </div>

      <div
        v-if="entries?.length"
        class="log-list"
      >
        <article
          v-for="(entry, index) in entries"
          :key="entry.path"
          class="log-item"
          :class="layoutClass(index)"
        >
          <div
            v-if="entry.cover"
            class="log-image-frame"
          >
            <img
              :src="entry.cover.src"
              :alt="entry.cover.alt"
              class="log-image"
              loading="lazy"
            />
            <span class="log-tag log-tag--obj">{{ objectTag(index) }}</span>
            <span class="log-tag log-tag--fig">{{ figureTag(index) }}</span>
          </div>
          <span
            v-else
            class="log-index-numeral"
            aria-hidden="true"
          >{{ String(index + 1).padStart(2, '0') }}</span>

          <div class="log-panel">
            <div class="log-panel-meta">
              <span
                class="log-kind"
                :data-kind="entry.kind"
              >{{ entry.kind }}</span>
              <span class="log-date">{{ formatDate(entry.date) }}</span>
            </div>
            <h3 class="log-title">
              {{ entry.title }}
            </h3>
            <p class="log-description">
              {{ entry.description }}
            </p>
            <NuxtLink
              :to="localePath(entry.path)"
              class="log-cta"
            >
              Read entry →
            </NuxtLink>
          </div>
        </article>
      </div>
      <p
        v-else
        class="log-empty"
      >
        No published entries yet.
      </p>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
}

/*
 * Full-bleed breakout (pattern #6): escapes <main>'s padded --content-max-width column to
 * touch the edges of .site-body (default.vue) — the true viewport minus the fixed nav rail's
 * width. The classic 100vw/-50vw breakout trick assumes margin-left's percentage resolves
 * against an ancestor that's exactly as wide as the true viewport; here the immediate
 * containing block (.home, sized to main's capped content-max-width) is narrower than that,
 * and site-body itself is offset by the rail, so the trick needs its own local variables
 * instead of a bare percentage to stay correct at every viewport width.
 */
.home {
  --site-body-width: calc(100vw - var(--space-9));
  --main-width: min(var(--content-max-width), var(--site-body-width));
  --main-inset: calc((var(--site-body-width) - var(--main-width)) / 2);
}

@media (max-width: 640px) {
  .home {
    --site-body-width: 100vw;
  }
}

.hero,
.marquee,
.log {
  width: var(--site-body-width);
  margin-left: calc(-1 * (var(--main-inset) + var(--space-6)));
}

.hero {
  position: relative;
  padding: var(--space-9) var(--space-6) var(--space-8);
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.hero-watermark {
  position: absolute;
  left: 4%;
  top: 50%;
  z-index: 0;
  margin: 0;
  font-family: var(--font-family-serif);
  font-size: 32vw;
  font-weight: var(--font-weight-display);
  line-height: 1;
  color: var(--color-text);
  opacity: 0.04;
  mix-blend-mode: overlay;
  writing-mode: vertical-rl;
  transform: translateY(-50%) rotate(180deg);
  pointer-events: none;
  user-select: none;
}

.hero-eyebrow {
  position: relative;
  z-index: 1;
  margin: 0 0 var(--space-6);
  padding-left: var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-mono-em);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

/* Violent scale contrast (pattern #2): the wordmark sits at the hero/display scale while the
   eyebrow/meta text stays at --font-size-xs — no stepped middle sizes bridging the two. */
.hero-mark {
  position: relative;
  z-index: 1;
  margin: 0 0 var(--space-8);
  font-family: var(--font-family-serif);
  font-weight: var(--font-weight-display);
  line-height: var(--line-height-headline);
  letter-spacing: -0.02em;
}

.hero-mark-line {
  display: block;
  font-size: var(--font-size-hero);
}

.hero-mark-line--accent {
  font-size: var(--font-size-display);
  font-style: italic;
  text-align: right;
  padding-right: var(--space-6);
  color: var(--color-accent);
}

/* Bleed/crop (pattern #1): pulled past the left edge and clipped by .hero's overflow: hidden,
   rather than sized to comfortably fit a padded box. */
.hero-mark-line--crop {
  margin-left: -0.08em;
}

/*
 * Liquid glass data panel (Phase 4 addendum) — a persistent structural panel, not a transient
 * overlay; see docs/design-prompt.md's addendum for why that's now in-scope for --glass-*.
 */
.hero-panel {
  position: relative;
  z-index: 1;
  max-width: 34rem;
  padding: var(--space-6);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-accent);
  border-radius: 2px;
}

.hero-panel::before,
.hero-panel::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--color-accent);
  opacity: 0.8;
}

.hero-panel::before {
  top: -1px;
  right: -1px;
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}

.hero-panel::after {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

.hero-panel-text {
  margin: 0 0 var(--space-5);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  font-weight: 300;
  line-height: var(--line-height-reading);
  color: var(--color-text);
}

.hero-panel-links {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-top: 1px solid var(--glass-border);
}

.hero-meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-6);
  margin-top: var(--space-8);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.hero-meta p {
  margin: 0;
}

.hero-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.hero-status.is-dev {
  color: var(--color-accent);
  border-color: var(--glass-border-accent);
}

.hero-status-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
}

.marquee {
  overflow: hidden;
  background: var(--color-bg-raised);
  border-bottom: 1px solid var(--color-border);
}

.marquee-track {
  display: flex;
  width: max-content;
  padding: var(--space-2) 0;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
  animation: marquee 28s linear infinite;
}

.marquee-item {
  padding-right: var(--space-6);
}

.marquee-item:nth-child(4n + 1) {
  color: var(--color-accent);
  opacity: 0.8;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}

.log {
  padding: var(--space-9) var(--space-6);
}

.log-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-9);
  border-bottom: 1px solid var(--color-border);
}

.log-header h2 {
  margin: 0;
  font-size: var(--font-size-3xl);
}

.log-index-label {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
}

/* Asymmetric composition (pattern #4): alternating width/alignment in a stacked flow, not a
   uniform grid of equal tiles. */
.log-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.log-item--wide-left {
  width: 68%;
  margin-right: auto;
}

.log-item--narrow-right {
  width: 50%;
  margin-left: auto;
}

.log-item--center {
  width: 78%;
  margin: 0 auto;
}

.log-image-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border);
}

.log-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(60%);
  transition: filter var(--motion-duration-slow) var(--motion-easing-fluid), transform var(--motion-duration-slow) var(--motion-easing-fluid);
}

.log-item:hover .log-image {
  filter: grayscale(0%);
  transform: scale(1.02);
}

.log-tag {
  position: absolute;
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-family-mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.log-tag--obj {
  top: var(--space-3);
  left: var(--space-3);
  color: var(--color-bg);
  background: var(--color-accent);
}

.log-tag--fig {
  right: var(--space-3);
  bottom: var(--space-3);
  color: var(--color-text-muted);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}

.log-index-numeral {
  position: absolute;
  top: -0.3em;
  right: var(--space-4);
  z-index: 0;
  font-family: var(--font-family-serif);
  font-style: italic;
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  color: var(--color-bg-raised);
  pointer-events: none;
  user-select: none;
}

.log-panel {
  position: relative;
  z-index: 1;
  padding: var(--space-6);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}

.log-item:hover .log-panel {
  border-color: var(--glass-border-accent);
}

.log-panel-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.log-kind {
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid currentColor;
}

.log-kind[data-kind='project'] {
  color: var(--color-kind-project);
}

.log-kind[data-kind='post'] {
  color: var(--color-kind-post);
}

.log-kind[data-kind='note'] {
  color: var(--color-kind-note);
}

.log-kind[data-kind='log'] {
  color: var(--color-kind-log);
}

.log-date {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.log-title {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-xl);
}

.log-description {
  max-width: 60ch;
  margin: 0 0 var(--space-4);
  color: var(--color-text-muted);
}

.log-cta {
  display: inline-block;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.log-empty {
  padding: var(--space-8) var(--space-6);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
  border: 1px dashed var(--color-border);
}

@media (max-width: 640px) {
  .hero-watermark {
    display: none;
  }

  .hero-mark-line--accent {
    text-align: left;
    padding-right: 0;
  }

  .hero-panel {
    max-width: none;
  }

  .log-item--wide-left,
  .log-item--narrow-right,
  .log-item--center {
    width: 100%;
    margin: 0;
  }

  .log-index-numeral {
    font-size: 5rem;
  }
}
</style>
