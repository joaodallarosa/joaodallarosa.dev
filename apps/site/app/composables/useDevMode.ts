// Site-wide Developer Mode toggle (PROJECT.md §4 / Phase 3). Shared reactive state so the
// footer toggle, showcase page, and any future consumer stay in sync; persisted so the
// setting survives navigation and reloads without needing an account/server round-trip.
export const DEV_MODE_STORAGE_KEY = 'joao-website:dev-mode'

export function useDevMode() {
  const devMode = useState<boolean>('dev-mode', () => false)

  function set(value: boolean) {
    devMode.value = value
    if (import.meta.client) {
      document.documentElement.toggleAttribute('data-dev-mode', value)
      localStorage.setItem(DEV_MODE_STORAGE_KEY, value ? '1' : '0')
    }
  }

  function toggle() {
    set(!devMode.value)
  }

  return { devMode, set, toggle }
}
