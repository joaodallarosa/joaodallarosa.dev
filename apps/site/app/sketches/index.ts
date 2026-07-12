import type { SketchHandle } from '~/utils/sketch-canvas'

export type SketchMount = (container: HTMLElement) => Promise<SketchHandle>

// Keyed by the ported piece's original creative/src/pieces/<slug> folder name — this is also
// the `sketch` attribute value used in content bodies, e.g. `::p5js-sketch{sketch="dots"}`.
export const projectSketchRegistry: Record<string, () => Promise<{ default: SketchMount }>> = {
  'anxiety-tree': () => import('./anxiety-tree'),
  'boyhood': () => import('./boyhood'),
  'bury': () => import('./bury'),
  'clinamen': () => import('./clinamen'),
  'dots': () => import('./dots'),
  'not-art': () => import('./not-art'),
  'single-line': () => import('./single-line'),
  'sketch': () => import('./sketch'),
  'synth': () => import('./synth'),
}
