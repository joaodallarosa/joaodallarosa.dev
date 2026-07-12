// Ported from creative/src/pieces/circle-collision ("Clinamen") — an homage to Céleste
// Boursier-Mougenot's installation of the same name: plates drift on wind-like force zones
// and chime with Tone.js when they collide. Originally a dedicated full-viewport page in
// creative; embedded here at a wide (not square) aspect instead, and sized to the embed
// container rather than window.innerWidth/innerHeight. The click-to-run gate every sketch
// shares also happens to be the user gesture that satisfies the browser's audio-autoplay
// policy, so the original page's iOS "unmute" hack isn't needed here.
import type p5 from 'p5'
import { getEmbedCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const ZONE_FORCE = 0.001
const DENSITY = 0.00003
const PLAYERS_POOL = 10
const PLATE_SOUNDS = [
  '/audio/sketches/chime-1.wav',
  '/audio/sketches/chime-2.wav',
  '/audio/sketches/chime-3.wav',
]

function drawArrow(sk: p5, base: p5.Vector, vec: p5.Vector, color: [number, number, number]) {
  sk.push()
  sk.stroke(...color)
  sk.strokeWeight(3)
  sk.fill(...color)
  sk.translate(base.x, base.y)
  sk.line(0, 0, vec.x, vec.y)
  sk.rotate(vec.heading())
  const arrowSize = 10
  sk.translate(vec.mag() - arrowSize, 0)
  sk.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0)
  sk.pop()
}

class ForceZone {
  constructor(
    private position: p5.Vector,
    private width: number,
    private height: number,
    private force: p5.Vector,
  ) {}

  draw(sk: p5) {
    sk.push()
    sk.stroke(3)
    sk.fill(0, 0, 0, 0)
    sk.rect(this.position.x, this.position.y, this.width, this.height)
    sk.pop()
  }

  applyForce(particles: Particle[]) {
    for (const particle of particles) {
      if (this.isInside(particle.position)) particle.velocity.add(this.force)
    }
  }

  isInside(position: p5.Vector) {
    return position.x >= this.position.x && position.x <= this.position.x + this.width
      && position.y >= this.position.y && position.y <= this.position.y + this.height
  }
}

class Particle {
  position: p5.Vector
  velocity: p5.Vector
  acceleration: p5.Vector
  mass: number
  r: number

  constructor(sk: p5, x: number, y: number) {
    this.position = sk.createVector(x, y)
    this.velocity = sk.createVector(sk.random(-1, 1), sk.random(-1, 1))
    this.velocity.normalize()
    this.velocity.mult(sk.random(0.05, 0.2))
    this.acceleration = sk.createVector(0, 0)
    this.mass = sk.random(1, 8)
    this.r = sk.sqrt(this.mass) * 20
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  // Pushes the two particles apart and resolves an elastic collision, then reports the
  // impact strength so the caller can decide whether/how loud to chime.
  collide(other: Particle, onImpact: (impactMagnitude: number) => void) {
    const impactVector = other.position.copy().sub(this.position)
    let d = impactVector.mag()
    if (d >= this.r + other.r) return

    const overlap = d - (this.r + other.r)
    const dir = impactVector.copy()
    dir.setMag(overlap * 0.5)
    this.position.add(dir)
    other.position.sub(dir)

    d = this.r + other.r
    impactVector.setMag(d)
    const mSum = this.mass + other.mass
    const vDiff = other.velocity.copy().sub(this.velocity)
    const num = vDiff.dot(impactVector)
    const den = mSum * d * d

    const deltaVA = impactVector.copy().mult((2 * other.mass * num) / den)
    this.velocity.add(deltaVA.copy().mult(0.6))

    const deltaVB = impactVector.copy().mult((-2 * this.mass * num) / den)
    other.velocity.add(deltaVB.copy().mult(0.6))

    onImpact(Math.max(deltaVA.mag(), deltaVB.mag()))
  }

  edges(width: number, height: number) {
    if (this.position.x > width - this.r) {
      this.position.x = width - this.r
      this.velocity.x *= -0.2
    }
    else if (this.position.x < this.r) {
      this.position.x = this.r
      this.velocity.x *= -0.2
    }

    if (this.position.y > height - this.r) {
      this.position.y = height - this.r
      this.velocity.y *= -0.2
    }
    else if (this.position.y < this.r) {
      this.position.y = this.r
      this.velocity.y *= -0.2
    }
  }

  show(sk: p5, plateImg: p5.Image, devMode: boolean) {
    const strokeColor: [number, number, number] = devMode ? [0, 0, 0] : [247, 240, 252]
    sk.stroke(...strokeColor)
    sk.strokeWeight(1)
    sk.fill(255, 255, 255, 0)
    if (!devMode) {
      sk.image(plateImg, this.position.x - this.r, this.position.y - this.r, this.r * 2, this.r * 2)
    }
    sk.circle(this.position.x, this.position.y, this.r * 2)
    if (devMode) {
      const velocityPreview = sk.createVector(this.position.x, this.position.y)
      velocityPreview.mult(this.velocity)
      velocityPreview.mult(0.4)
      drawArrow(sk, this.position, velocityPreview, [255, 0, 0])
    }
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const [{ default: P5 }, Tone] = await Promise.all([import('p5'), import('tone')])

  // Chrome/Safari refuse to resume an AudioContext without a real user gesture, and its
  // resume() promise then never settles — for the click-to-run gate that gesture is the click
  // itself, but `autoStart` sketches (this one, as a project hero) skip that click, so awaiting
  // Tone.start() here would hang forever and the visual sketch below would never mount. Fire it
  // without blocking on it instead, and keep retrying on the page's first pointer/key interaction
  // (anywhere, not just this canvas) so sound unlocks as soon as one actually happens.
  const unlockAudio = () => void Tone.start()
  unlockAudio()
  window.addEventListener('pointerdown', unlockAudio)
  window.addEventListener('keydown', unlockAudio)

  const limiter = new Tone.Limiter(-1).toDestination()
  const playerMap: Record<string, string> = {}
  for (let i = 0; i < PLAYERS_POOL; i++) {
    playerMap[`hit${i}`] = PLATE_SOUNDS[Math.floor(Math.random() * PLATE_SOUNDS.length)]!
  }
  // Plate audio decodes over the network after this constructor returns — collisions can
  // start happening (t=0 particles already overlapping) before that finishes, so gate
  // playChime on the `onload` callback rather than calling player.start() on an unloaded buffer.
  let soundReady = false
  function markSoundReady() {
    soundReady = true
  }
  const players = new Tone.Players(playerMap, markSoundReady).connect(limiter)
  const backgroundPlayer = new Tone.Player({
    url: '/audio/sketches/water.mp3',
    autostart: true,
    loop: true,
    volume: -20,
  }).toDestination()

  let playerIndex = 0
  function playChime(volumeDb: number) {
    if (!soundReady) return
    const key = `hit${playerIndex}`
    playerIndex = (playerIndex + 1) % PLAYERS_POOL
    const player = players.player(key)
    player.volume.value = volumeDb
    player.start(Tone.now() + 0.001)
  }

  function playForImpact(impactMagnitude: number) {
    if (impactMagnitude < 0.2) return
    if (impactMagnitude <= 0.8) playChime(-35)
    else if (impactMagnitude <= 1.4) playChime(-25)
    else playChime(-15)
  }

  let width = 0
  let height = 0
  let forceZones: ForceZone[] = []
  const particles: Particle[] = []
  let devMode = false
  function toggleDevMode() {
    devMode = !devMode
    return devMode
  }

  function setupZones(sk: p5) {
    forceZones = [
      new ForceZone(sk.createVector(width / 3, 0), width / 3, height, sk.createVector(0, -ZONE_FORCE)),
      new ForceZone(sk.createVector(width / 2, 0), width / 2, height / 4, sk.createVector(ZONE_FORCE, 0)),
      new ForceZone(sk.createVector(0, 0), width / 2, height / 4, sk.createVector(-ZONE_FORCE, 0)),
      new ForceZone(sk.createVector(width / 2, height - height / 4), width / 2, height / 4, sk.createVector(-ZONE_FORCE, 0)),
      new ForceZone(sk.createVector(0, height - height / 4), width / 2, height / 4, sk.createVector(ZONE_FORCE, 0)),
      new ForceZone(sk.createVector(0, 0), width / 3, height, sk.createVector(0, ZONE_FORCE)),
      new ForceZone(sk.createVector((width / 3) * 2, 0), width / 3, height, sk.createVector(0, ZONE_FORCE)),
    ]
  }

  const instance = new P5((sk: p5) => {
    let plateImg: p5.Image

    sk.setup = async () => {
      plateImg = await sk.loadImage('/images/sketches/plate.png')
      const size = getEmbedCanvasSize(container)
      width = size.width
      height = size.height

      sk.pixelDensity(Math.min(window.devicePixelRatio || 1, 2))
      sk.createCanvas(width, height).parent(container)
      sk.frameRate(24)

      setupZones(sk)
      const plateCount = Math.floor(width * height * DENSITY)
      for (let i = 0; i < plateCount; i++) {
        particles.push(new Particle(sk, sk.random(0, width), sk.random(0, height)))
      }
    }

    sk.draw = () => {
      const bg: [number, number, number] = devMode ? [255, 255, 255] : [45, 136, 155]
      sk.background(...bg)

      for (const zone of forceZones) {
        if (devMode) zone.draw(sk)
        zone.applyForce(particles)
      }

      if (!devMode) {
        for (const particle of particles) {
          sk.push()
          const ctx = sk.drawingContext as CanvasRenderingContext2D
          ctx.shadowOffsetX = 35
          ctx.shadowOffsetY = -25
          ctx.shadowBlur = 40
          ctx.shadowColor = 'rgb(0 0 0 / 30%)'
          sk.fill(0)
          sk.circle(particle.position.x, particle.position.y, particle.r * 1.5)
          sk.pop()
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          particles[i]!.collide(particles[j]!, playForImpact)
        }
      }

      for (const particle of particles) {
        particle.update()
        particle.edges(width, height)
        particle.show(sk, plateImg, devMode)
      }
    }

    // Debug view toggle, ported as-is: shows force-zone outlines and velocity arrows. Also
    // exposed as toggleDevMode() below for the P5jsSketch toolbar's dev-mode button.
    sk.keyPressed = () => {
      if (sk.key === 'd' || sk.key === 'D') toggleDevMode()
    }
  })

  return {
    destroy: () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      instance.remove()
      backgroundPlayer.stop()
      backgroundPlayer.dispose()
      players.dispose()
      limiter.dispose()
    },
    toggleDevMode,
  }
}
