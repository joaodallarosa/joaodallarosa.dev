// Ported sketches mount inline in an article column rather than fullscreen, so the square
// canvas is capped by the embed container's own width instead of the window (creative's
// original getCanvasSize() read window.innerWidth/innerHeight directly).
export function getSquareCanvasSize(container: HTMLElement, max = 700) {
  const { width } = container.getBoundingClientRect()
  return Math.floor(width > 0 ? Math.min(width, max) : max)
}

export interface SketchHandle {
  destroy: () => void
  // Optional: only sketches with a debug view (e.g. clinamen's force-zone/velocity overlay)
  // implement this. Flips the sketch's internal dev mode and returns the new state, so
  // P5jsSketch's toolbar can surface a button only when a sketch actually supports it.
  toggleDevMode?: () => boolean
}

// For sketches embedded at a non-square aspect (see P5jsSketch's `aspect="wide"`) — reads
// both dimensions off the container's own rendered box (its CSS aspect-ratio class already
// shapes it) and scales both down together if the width needs capping, so the aspect ratio
// established by the frame's CSS is preserved rather than recomputed here.
export function getEmbedCanvasSize(container: HTMLElement, maxWidth = 900) {
  const { width, height } = container.getBoundingClientRect()
  if (width <= 0) return { width: maxWidth, height: Math.floor(maxWidth * 9 / 16) }
  const boundedWidth = Math.min(width, maxWidth)
  const scale = boundedWidth / width
  return { width: Math.floor(boundedWidth), height: Math.floor((height || boundedWidth * 9 / 16) * scale) }
}
