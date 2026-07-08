// Syncs reactive state with whatever the pre-hydration inline script (nuxt.config.ts's
// app.head.script) already wrote to <html data-color-scheme> — reads state only here, doesn't
// call set(), so it doesn't redundantly touch the DOM/localStorage a second time. If the
// visitor has never made an explicit choice, keeps following OS-level scheme changes live.
export default defineNuxtPlugin(() => {
  const { scheme, set } = useColorScheme()

  const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY) as 'light' | 'dark' | null
  const mq = window.matchMedia('(prefers-color-scheme: light)')
  scheme.value = stored ?? (mq.matches ? 'light' : 'dark')

  if (!stored) {
    mq.addEventListener('change', (event) => {
      if (!localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)) set(event.matches ? 'light' : 'dark')
    })
  }
})
