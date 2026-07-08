// Restores the persisted Developer Mode preference on load. Client-only: localStorage and
// `document` don't exist during SSR, and dev mode is a sighted-developer aid, not
// server-rendered content (see docs/conventions.md).
export default defineNuxtPlugin(() => {
  const { set } = useDevMode()

  if (localStorage.getItem(DEV_MODE_STORAGE_KEY) === '1') {
    set(true)
  }
})
