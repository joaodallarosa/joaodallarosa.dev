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
  <!-- z-2: only needs to beat our own page content (the nav rail's z-1, our own content), not
       Nuxt Studio's UI — SiteShell's root `isolate` contains this tier so it can't leak out and
       out-rank Studio's editing overlays. See SiteShell.vue's isolate comment for why. -->
  <div
    v-if="!dismissed"
    class="fixed inset-x-4 bottom-4 z-2 mx-auto flex max-w-lg flex-wrap items-center justify-between gap-4 rounded-xs border border-border bg-bg-raised px-5 py-4 font-mono text-base text-text"
    role="region"
    :aria-label="t('cookieBanner.label')"
  >
    <p class="m-0">{{ t('cookieBanner.text') }}</p>
    <button
      type="button"
      class="cursor-pointer rounded-xs border-none bg-accent px-4 py-2 font-mono text-base font-medium text-bg transition-colors duration-(--motion-duration-base) ease-mechanical hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      @click="dismiss"
    >
      {{ t('cookieBanner.dismiss') }}
    </button>
  </div>
</template>
