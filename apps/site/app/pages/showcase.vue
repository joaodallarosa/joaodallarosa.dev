<script setup lang="ts">
import ReactButtonIsland from '~/components/showcase/ReactButtonIsland.vue'
</script>

<template>
  <div>
    <h1>Framework interop demo</h1>
    <p>
      The full component reference — props/controls generated from each Lit component's own
      TypeScript source, plus Foundations pages for the design tokens — now lives in Storybook
      (<code>pnpm --filter design-system storybook</code>, not yet deployed publicly). This page
      keeps the one proof Storybook can't show on its own: the exact same custom element,
      embedded live from two different frameworks in the same real page — the strongest answer to
      "will this actually drop into a React app" is showing it, not asserting it (PROJECT.md §3,
      Showcase commitment).
    </p>

    <ClientOnly>
      <section aria-labelledby="showcase-interop">
        <h2 id="showcase-interop">
          ds-button, from both sides
        </h2>
        <div class="interop-grid">
          <div>
            <h3>Vue island</h3>
            <ds-button variant="secondary">
              From Vue
            </ds-button>
          </div>
          <div>
            <h3>React island</h3>
            <ReactButtonIsland label="From React" />
          </div>
        </div>
      </section>
    </ClientOnly>
  </div>
</template>

<style scoped>
.interop-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
</style>
