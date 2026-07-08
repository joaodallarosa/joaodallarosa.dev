import p5 from 'p5'

// Literal hex tokens only (--color-neutral-950/-50) — NOT --color-bg/--color-text. Those are
// var()-chains, and getComputedStyle().getPropertyValue() on a custom property returns its raw
// computed value (the unresolved "var(--color-neutral-950)" token text), not the resolved color
// a normal CSS property would show. Reading the literal leaf tokens directly sidesteps that.
const INK_COLOR_VAR = '--color-neutral-950'
const PAPER_COLOR_VAR = '--color-neutral-50'
const DOT_COLOR_VAR = '--color-neutral-950'
const INK_COLOR_FALLBACK = '#0b0c0d'
const PAPER_COLOR_FALLBACK = '#f6f7f7'
const DOT_COLOR_FALLBACK = '#0b0c0d'

/**
 * All tunable knobs for the flow field, grouped in one place for quick tuning — every other
 * function reads from here rather than scattering magic numbers through the logic below.
 */
const FLOW_FIELD = {
  field: {
    // Spatial frequency of the Clifford-attractor field. Smaller = larger, slower-turning eddies.
    scale: 0.007,
    // a, b, c, d are randomized every mount within [-attractorRange, attractorRange].
    attractorRange: 2,
  },
  particles: {
    minCount: 160,
    maxCount: 260,
    // px^2 of viewport area per particle — controls how count scales with screen size.
    areaPerParticle: 8000,
    // Initial rightward velocity when a particle (re)enters at the left edge.
    spawnSpeed: 26,
    // How strongly velocity is pulled toward the field direction each frame.
    accel: 0.75,
    // Per-frame velocity decay (< 1). Lower = looser/more fluid, higher = stiffer.
    damping: 0.985,
    // Ink stroke thickness varies per particle within this range for a hand-drawn feel.
    strokeWeightMin: 0.2,
    strokeWeightMax: 1.8,
    // Ink opacity (0-255) varies per particle so overlapping strokes pool darker, like real ink.
    // Muted charcoal-on-paper needs more coverage than a glowing color would to read clearly.
    alphaMin: 50,
    alphaMax: 135,
  },
  trail: {
    // Alpha erased from existing ink per frame (0-255, see erase() in the draw loop below).
    // Lower = trails linger longer and pool darker where strokes overlap, like ink diffusing
    // into paper rather than a signal that blips and vanishes.
    fadeErase: 13,
  },
  // Dotted-notebook paper texture — a square dot grid, tiled as CSS background on the
  // container (see applyPaperTexture). Adjust freely; all knobs are read live per mount.
  paper: {
    // Distance in px between dot centers — also the tile size, so it must stay a whole
    // number for the grid to tile without seams.
    dotSpacing: 32,
    dotRadius: 1.3,
    // Dot opacity (0-255) over the paper color.
    dotAlpha: 125,
    // Subtle per-pixel paper grain underneath the dots (0 = perfectly flat paper color).
    grainStrength: 10,
  },
  // Cursor repel — particles within repelRadius px of the pointer get pushed away from it,
  // strongest at the center and fading to nothing at the radius edge. No effect on touch
  // devices beyond an active drag, since there's no persistent pointer to read otherwise.
  pointer: {
    repelRadius: 240,
    repelStrength: 4.5,
  },
  performance: {
    maxPixelDensity: 2,
    frameRate: 60,
  },
  staticField: {
    step: 28,
    strokeAlpha: 140,
  },
} as const

interface AttractorParams {
  a: number
  b: number
  c: number
  d: number
}

interface Pointer {
  x: number
  y: number
  active: boolean
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomAttractorParams(): AttractorParams {
  const r = FLOW_FIELD.field.attractorRange
  return {
    a: randomBetween(-r, r),
    b: randomBetween(-r, r),
    c: randomBetween(-r, r),
    d: randomBetween(-r, r),
  }
}

// Clifford-attractor-derived field: the value at (x, y) is the angle from that point to its
// image under the attractor map, which gives the field its looping, current-like structure
// instead of the turbulence a noise-based field would produce.
function fieldAngle(x: number, y: number, width: number, height: number, { a, b, c, d }: AttractorParams) {
  const nx = (x - width / 2) * FLOW_FIELD.field.scale
  const ny = (y - height / 2) * FLOW_FIELD.field.scale
  const x1 = d * Math.sin(a * nx) - Math.sin(b * ny)
  const y1 = c * Math.cos(a * nx) + Math.cos(b * ny)
  return Math.atan2(y1 - ny, x1 - nx)
}

function particleCountFor(width: number, height: number) {
  const raw = Math.round((width * height) / FLOW_FIELD.particles.areaPerParticle)
  return Math.min(FLOW_FIELD.particles.maxCount, Math.max(FLOW_FIELD.particles.minCount, raw))
}

function readToken(varName: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  return value || fallback
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

// Dotted-notebook paper texture lives on the container's CSS background, not on the canvas —
// the canvas stays transparent so the trail-fade (erase()) can fade ink toward transparency
// each frame without ever washing out a canvas-drawn texture. Generated once per mount as a
// single-dot tile (one dot per dotSpacing-sized tile) that repeats into a square dot grid.
// Rendered at devicePixelRatio resolution but laid out at the logical dotSpacing size (via
// background-size) so dots stay crisp on retina instead of blurring when downsampled.
function applyPaperTexture(container: HTMLElement, paperRgb: [number, number, number], dotRgb: [number, number, number]) {
  const { dotSpacing, dotRadius, dotAlpha, grainStrength } = FLOW_FIELD.paper
  const scale = Math.min(window.devicePixelRatio || 1, 2)
  const tilePx = Math.round(dotSpacing * scale)

  const canvas = document.createElement('canvas')
  canvas.width = tilePx
  canvas.height = tilePx
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.createImageData(tilePx, tilePx)
  const [r, g, b] = paperRgb
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainStrength
    imageData.data[i] = r + noise
    imageData.data[i + 1] = g + noise
    imageData.data[i + 2] = b + noise
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)

  ctx.beginPath()
  ctx.arc(tilePx / 2, tilePx / 2, dotRadius * scale, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${dotRgb[0]}, ${dotRgb[1]}, ${dotRgb[2]}, ${dotAlpha / 255})`
  ctx.fill()

  container.style.backgroundImage = `url(${canvas.toDataURL()})`
  container.style.backgroundSize = `${dotSpacing}px ${dotSpacing}px`
}

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  strokeWeight: number
  alpha: number

  constructor(width: number, height: number) {
    // Staggered negative start (not a hard 0) so the initial population is already spread
    // across the canvas instead of bursting through as one synchronized wavefront — every
    // respawn afterwards (see resetToLeftEdge) re-enters at the true left edge, x = 0.
    this.x = Math.random() * -width
    this.y = Math.random() * height
    this.vx = FLOW_FIELD.particles.spawnSpeed
    this.vy = 0
    this.strokeWeight = randomBetween(FLOW_FIELD.particles.strokeWeightMin, FLOW_FIELD.particles.strokeWeightMax)
    this.alpha = randomBetween(FLOW_FIELD.particles.alphaMin, FLOW_FIELD.particles.alphaMax)
  }

  resetToLeftEdge(height: number) {
    this.x = 0
    this.y = Math.random() * height
    this.vx = FLOW_FIELD.particles.spawnSpeed
    this.vy = 0
    this.strokeWeight = randomBetween(FLOW_FIELD.particles.strokeWeightMin, FLOW_FIELD.particles.strokeWeightMax)
    this.alpha = randomBetween(FLOW_FIELD.particles.alphaMin, FLOW_FIELD.particles.alphaMax)
  }

  step(sk: p5, width: number, height: number, params: AttractorParams, ink: p5.Color, pointer: Pointer) {
    const angle = fieldAngle(this.x, this.y, width, height, params)
    let ax = Math.cos(angle) * FLOW_FIELD.particles.accel
    let ay = Math.sin(angle) * FLOW_FIELD.particles.accel

    if (pointer.active) {
      const { repelRadius, repelStrength } = FLOW_FIELD.pointer
      const dx = this.x - pointer.x
      const dy = this.y - pointer.y
      const distSq = dx * dx + dy * dy
      if (distSq < repelRadius * repelRadius) {
        const dist = Math.sqrt(distSq) || 0.0001
        const falloff = 1 - dist / repelRadius
        const force = repelStrength * falloff
        ax += (dx / dist) * force
        ay += (dy / dist) * force
      }
    }

    this.vx = (this.vx + ax) * FLOW_FIELD.particles.damping
    this.vy = (this.vy + ay) * FLOW_FIELD.particles.damping

    const nx = this.x + this.vx
    const ny = this.y + this.vy
    const wrapped = nx < 0 || nx > width || ny < 0 || ny > height

    // Skip the connecting line when a particle wraps — otherwise it draws one long streak
    // clear across the canvas from its old edge to the left-edge respawn point.
    if (!wrapped) {
      ink.setAlpha(this.alpha)
      sk.stroke(ink)
      sk.strokeWeight(this.strokeWeight)
      sk.line(this.x, this.y, nx, ny)
      this.x = nx
      this.y = ny
    }
    else {
      this.resetToLeftEdge(height)
    }
  }
}

function renderStaticFrame(sk: p5, width: number, height: number, params: AttractorParams, ink: p5.Color) {
  sk.clear()
  const step = FLOW_FIELD.staticField.step
  ink.setAlpha(FLOW_FIELD.staticField.strokeAlpha)
  sk.stroke(ink)
  sk.strokeWeight(1)
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const angle = fieldAngle(x, y, width, height, params)
      sk.push()
      sk.translate(x, y)
      sk.rotate(angle)
      sk.line(0, 0, step * 0.7, 0)
      sk.pop()
    }
  }
}

export interface FlowFieldHandle {
  destroy: () => void
}

// Mounts a live p5 flow-field sketch (Clifford attractor field, ink-on-paper particle trails)
// into `container`, sized to fill it. Randomizes attractor params per mount, honors
// prefers-reduced-motion (renders one static field frame instead of animating), and pauses the
// draw loop while the tab is hidden.
export function mountFlowField(container: HTMLElement): FlowFieldHandle {
  const inkHex = readToken(INK_COLOR_VAR, INK_COLOR_FALLBACK)
  const paperHex = readToken(PAPER_COLOR_VAR, PAPER_COLOR_FALLBACK)
  const dotHex = readToken(DOT_COLOR_VAR, DOT_COLOR_FALLBACK)
  applyPaperTexture(container, hexToRgb(paperHex), hexToRgb(dotHex))

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const params = randomAttractorParams()
  // Window-level (not container-level) listener: the container has pointer-events: none so
  // clicks/hovers pass through to real page content sitting above it, but pointermove still
  // bubbles to window regardless of which element the cursor is actually over. clientX/Y map
  // directly to canvas-local coordinates since the container is a fixed, full-viewport div.
  const pointer: Pointer = { x: -9999, y: -9999, active: false }

  let particles: Particle[] = []
  let inkColor: p5.Color
  let resizeTimeout: ReturnType<typeof setTimeout> | undefined

  function seedParticles(width: number, height: number) {
    const count = particleCountFor(width, height)
    particles = Array.from({ length: count }, () => new Particle(width, height))
  }

  const instance = new p5((sk: p5) => {
    sk.setup = () => {
      const { width, height } = container.getBoundingClientRect()
      sk.createCanvas(width, height).parent(container)
      sk.pixelDensity(Math.min(window.devicePixelRatio || 1, FLOW_FIELD.performance.maxPixelDensity))
      sk.frameRate(FLOW_FIELD.performance.frameRate)
      sk.clear()
      inkColor = sk.color(inkHex)
      seedParticles(width, height)

      if (reducedMotionQuery.matches) {
        renderStaticFrame(sk, width, height, params, inkColor)
        sk.noLoop()
      }
    }

    sk.draw = () => {
      // Erase (not paint over) to fade trails — reveals the CSS paper texture underneath
      // instead of accumulating toward a flat color the way a painted overlay would.
      sk.erase(FLOW_FIELD.trail.fadeErase, FLOW_FIELD.trail.fadeErase)
      sk.noStroke()
      sk.fill(255)
      sk.rect(0, 0, sk.width, sk.height)
      sk.noErase()
      for (const particle of particles) particle.step(sk, sk.width, sk.height, params, inkColor, pointer)
    }
  })

  function handlePointerMove(event: PointerEvent) {
    pointer.x = event.clientX
    pointer.y = event.clientY
    pointer.active = true
  }
  function handlePointerLeave() {
    pointer.active = false
  }
  window.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('mouseleave', handlePointerLeave)

  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      instance.resizeCanvas(width, height)
      instance.clear()
      if (reducedMotionQuery.matches) {
        renderStaticFrame(instance, width, height, params, inkColor)
      }
      else {
        seedParticles(width, height)
      }
    }, 150)
  })
  resizeObserver.observe(container)

  function handleVisibilityChange() {
    if (document.hidden) instance.noLoop()
    else if (!reducedMotionQuery.matches) instance.loop()
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  function handleReducedMotionChange() {
    if (reducedMotionQuery.matches) {
      renderStaticFrame(instance, instance.width, instance.height, params, inkColor)
      instance.noLoop()
    }
    else if (!document.hidden) {
      instance.clear()
      instance.loop()
    }
  }
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

  return {
    destroy: () => {
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
      instance.remove()
    },
  }
}
