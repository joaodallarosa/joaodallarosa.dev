<script setup lang="ts">
const STORAGE_KEY = 'joao-website:cookie-notice-dismissed'
const { t } = useI18n()
// Starts hidden (matches SSR output) and only reveals itself post-mount if the visitor hasn't
// already dismissed it — avoids a hydration mismatch without needing a ClientOnly wrapper,
// since "hidden" is a valid, non-shifting SSR state for this fixed-position overlay.
const dismissed = ref(true)

onMounted(() => {
  dismissed.value = localStorage.getItem(STORAGE_KEY) === '1'
})

function dismiss() {
  dismissed.value = true
  localStorage.setItem(STORAGE_KEY, '1')
}
</script>

<template>
  <div
    v-if="!dismissed"
    class="cookie-banner"
    role="region"
    :aria-label="t('cookieBanner.label')"
  >
    <p>{{ t('cookieBanner.text') }}</p>
    <button
      type="button"
      class="cookie-banner-dismiss"
      @click="dismiss"
    >
      {{ t('cookieBanner.dismiss') }}
    </button>
  </div>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  z-index: 90;
  right: var(--space-4);
  bottom: var(--space-4);
  left: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  max-width: 32rem;
  margin: 0 auto;
  padding: var(--space-4) var(--space-5);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text);
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border);
  border-radius: 2px;
}

.cookie-banner p {
  margin: 0;
}

.cookie-banner-dismiss {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-mono-em);
  color: var(--color-bg);
  background: var(--color-accent);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color var(--motion-duration-base) var(--motion-easing-mechanical);
}

.cookie-banner-dismiss:hover {
  background: var(--color-accent-hover);
}

.cookie-banner-dismiss:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
</style>
