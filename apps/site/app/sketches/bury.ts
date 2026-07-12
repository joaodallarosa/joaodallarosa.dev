// Ported from creative/src/pieces/bury — dropping dirt-like polygons onto a buried coin.
// The original also plumbed a "type a word" mechanic through keyPressed, but the typed word
// was never actually rendered (its text() call was commented out upstream) and Enter spawns
// particles regardless of what was typed — so only the real visible behavior is kept here:
// click or press Enter to drop a burst of dirt from a random edge.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const GRAVITY = 0.1

interface SpawnZone { xFrom: number, xTo: number, yFrom: number, yTo: number }

function drawPolygon(target: p5 | p5.Graphics, x: number, y: number, radius: number, points: number) {
  const step = target.TWO_PI / points
  target.beginShape()
  for (let angle = 0; angle < target.TWO_PI; angle += step) {
    target.vertex(x + target.cos(angle) * radius, y + target.sin(angle) * radius)
  }
  target.endShape(target.CLOSE)
}

class Dirt {
  x: number
  y: number
  zPos: number
  size: number
  sizeDraw: number
  acceleration = 0
  slideVelocity: number
  slideX: number
  slideY: number
  friction: number
  still = false
  nPoints: number

  constructor(sk: p5, x: number, y: number, size: number) {
    this.x = x
    this.y = y
    const endX = size / 2 + sk.random(-200, 200)
    const endY = size / 2 + sk.random(-200, 200)
    const angle = sk.atan2(endY - y, endX - x)
    this.slideX = sk.cos(angle)
    this.slideY = sk.sin(angle)
    this.zPos = sk.random(40, 55)
    this.size = sk.random(10, 50)
    this.sizeDraw = this.size + this.zPos
    this.slideVelocity = sk.random(5, 30) / (this.size / 11)
    this.friction = this.size * 0.1
    this.nPoints = sk.random(3, 8)
  }

  updatePhysics(buffer: p5.Graphics, onSettle: (dirt: Dirt) => void) {
    if (this.still) return
    if (this.zPos >= 0) {
      this.acceleration += GRAVITY
      this.zPos -= this.acceleration
      this.sizeDraw = this.size + this.zPos
    }
    else if (this.slideVelocity > 0) {
      this.slideVelocity -= this.friction
    }
    else {
      this.slideVelocity = 0
      this.still = true
      drawPolygon(buffer, this.x, this.y, this.sizeDraw, this.nPoints)
      onSettle(this)
      return
    }
    this.x += this.slideVelocity * this.slideX
    this.y += this.slideVelocity * this.slideY
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    let size = 0
    let buffer: p5.Graphics
    let coinImg: p5.Image
    let dirtParticles: Dirt[] = []
    let spawnZones: SpawnZone[] = []

    // p5 v2 dropped the separate preload() lifecycle in favor of an async setup() that
    // awaits its own asset loads.
    sk.setup = async () => {
      coinImg = await sk.loadImage('/images/sketches/coin.png')
      size = getSquareCanvasSize(container)
      sk.pixelDensity(1)
      sk.createCanvas(size, size).parent(container)
      sk.stroke(60)
      buffer = sk.createGraphics(size, size)
      buffer.fill(0)
      buffer.stroke(60)
      sk.frameRate(60)

      spawnZones = [
        { xFrom: -100, xTo: -80, yFrom: 0, yTo: size },
        { xFrom: size + 80, xTo: size + 100, yFrom: 0, yTo: size },
        { xFrom: 0, xTo: size, yFrom: -100, yTo: -80 },
        { xFrom: 0, xTo: size, yFrom: size + 80, yTo: size + 100 },
      ]
    }

    function spawnDirt(count: number) {
      const zone = sk.random(spawnZones)
      for (let i = 0; i < count; i++) {
        dirtParticles.push(new Dirt(sk, sk.random(zone.xFrom, zone.xTo), sk.random(zone.yFrom, zone.yTo), size))
      }
    }

    sk.draw = () => {
      sk.background(255)
      sk.image(coinImg, size / 2 - 100, size / 2 - 100, 200, 200)
      sk.image(buffer, 0, 0)
      dirtParticles
        .sort((a, b) => a.sizeDraw - b.sizeDraw)
        .forEach(particle => particle.updatePhysics(buffer, (settled) => {
          dirtParticles = dirtParticles.filter(candidate => candidate !== settled)
        }))
    }

    sk.mousePressed = () => spawnDirt(sk.random(50, 200))

    sk.keyPressed = () => {
      if (sk.key === sk.ENTER) spawnDirt(sk.random(20, 200))
    }
  })

  return { destroy: () => instance.remove() }
}
