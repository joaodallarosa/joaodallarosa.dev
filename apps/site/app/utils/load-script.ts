// For legacy third-party scripts that aren't npm packages / ES modules (e.g. no-linear-time's
// Blotter.js and particles.js bundles) — injects a classic <script> tag and resolves once it
// loads. Cached per src so remounting a component doesn't re-inject the same script twice.
const loadedScripts = new Map<string, Promise<void>>()

export function loadScriptOnce(src: string): Promise<void> {
  const cached = loadedScripts.get(src)
  if (cached) return cached

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
  loadedScripts.set(src, promise)
  return promise
}
