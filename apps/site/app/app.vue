<script setup lang="ts">
const { locale } = useI18n()
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}))

// og:locale wants underscore-separated region tags (en_US), not the i18n module's
// hyphenated locale codes (en, fr, pt-BR) — mapped explicitly since there are only three.
const OG_LOCALES: Record<string, string> = { 'en': 'en_US', 'fr': 'fr_FR', 'pt-BR': 'pt_BR' }

useSeoMeta({
  titleTemplate: title => title ? `${title} · joaodallarosa.dev` : 'joaodallarosa.dev',
  ogSiteName: 'joaodallarosa.dev',
  ogLocale: computed(() => OG_LOCALES[locale.value] ?? 'en_US'),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
