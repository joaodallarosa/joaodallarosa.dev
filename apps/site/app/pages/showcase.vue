<script setup lang="ts">
import ReactButtonIsland from '~/components/showcase/ReactButtonIsland.vue'

const kinds = ['project', 'post', 'note', 'log'] as const
const tagLabels = ['nuxt', 'lit', 'design-systems', 'accessibility']

// Shared with the site-wide footer toggle (PROJECT.md §4 / Phase 3) — toggling here or
// in the footer reflects everywhere, since it's the same persisted state.
const { devMode, toggle: toggleDevMode } = useDevMode()
</script>

<template>
  <div>
    <h1>Component showcase</h1>
    <p>
      Consumes the real <code>design-system</code> package (Lit Web Components) — not mockups.
      See <code>PROJECT.md</code> §4 for what Developer Mode's x-ray skin is meant to demonstrate.
    </p>

    <ClientOnly>
      <ds-button
        variant="secondary"
        @click="toggleDevMode"
      >
        Developer Mode: {{ devMode ? 'On' : 'Off' }}
      </ds-button>

      <section aria-labelledby="showcase-button">
        <h2 id="showcase-button">
          Button
        </h2>
        <div class="demo-row">
          <ds-button variant="primary">
            Publish
          </ds-button>
          <ds-button variant="secondary">
            Save draft
          </ds-button>
          <ds-button
            variant="primary"
            disabled
          >
            Publish
          </ds-button>
        </div>
      </section>

      <section aria-labelledby="showcase-tag">
        <h2 id="showcase-tag">
          Tag
        </h2>
        <div class="demo-row">
          <ds-tag
            v-for="label in tagLabels"
            :key="label"
          >
            {{ label }}
          </ds-tag>
        </div>
      </section>

      <section aria-labelledby="showcase-badge">
        <h2 id="showcase-badge">
          Badge
        </h2>
        <p>Kind</p>
        <div class="demo-row">
          <ds-badge
            v-for="kind in kinds"
            :key="kind"
            :kind="kind"
          >
            {{ kind }}
          </ds-badge>
        </div>
        <p>Status</p>
        <div class="demo-row">
          <ds-badge status="draft">
            Draft
          </ds-badge>
          <ds-badge status="published">
            Published
          </ds-badge>
        </div>
      </section>

      <section aria-labelledby="showcase-card">
        <h2 id="showcase-card">
          Card
        </h2>
        <!--
          Native `slot` attributes, not Vue's `#slot` API: ds-card is a custom element
          with a real Shadow DOM, and content is projected via native slot assignment
          (see PROJECT.md §3). eslint-disable is for vue/no-deprecated-slot-attribute,
          which doesn't distinguish native slot projection from Vue 2's slot syntax.
        -->
        <ds-card kind="log">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <span slot="title">Refinishing the workbench</span>
          <!-- eslint-disable vue/no-deprecated-slot-attribute -->
          <ds-badge
            slot="badge"
            kind="log"
          >
            Log
          </ds-badge>
          <!-- eslint-enable vue/no-deprecated-slot-attribute -->
          <p>Stripped, sanded, and re-oiled the shop workbench over a long weekend.</p>
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <span slot="footer">2026-07-02 · woodworking</span>
        </ds-card>
      </section>

      <section aria-labelledby="showcase-interop">
        <h2 id="showcase-interop">
          Framework interop
        </h2>
        <p>
          The exact same <code>ds-button</code> custom element, embedded live from two different
          frameworks — the strongest answer to "will this actually drop into a React app" is showing it,
          not asserting it (PROJECT.md §3, Showcase commitment).
        </p>
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
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.interop-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
}
</style>
