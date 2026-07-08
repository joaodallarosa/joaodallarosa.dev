// Site-wide light/dark toggle (Phase 7). Defaults to the visitor's OS preference the first
// time they arrive (see the blocking inline script in nuxt.config.ts's app.head.script, which
// sets the <html data-color-scheme> attribute before first paint to avoid a flash), then
// remembers an explicit manual choice across visits. Mirrors useDevMode's useState +
// localStorage shape so both toggles behave consistently.
export const COLOR_SCHEME_STORAGE_KEY = 'joao-website:color-scheme'
export type ColorScheme = 'light' | 'dark'

export function useColorScheme() {
  const scheme = useState<ColorScheme>('color-scheme', () => 'dark')

  function set(value: ColorScheme) {
    scheme.value = value
    if (import.meta.client) {
      document.documentElement.setAttribute('data-color-scheme', value)
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, value)
    }
  }

  function toggle() {
    set(scheme.value === 'dark' ? 'light' : 'dark')
  }

  return { scheme, set, toggle }
}
