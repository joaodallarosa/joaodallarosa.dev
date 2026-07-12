// Ported from creative/src/pieces/boyhood — a denser variant of anxiety-tree's line growth
// that self-terminates a branch once it collides with previously drawn ink (via sk.get()),
// rather than only checking against a fixed bound.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const LINE_LENGTH_MIN = 4
const LINE_LENGTH_MAX = 14
const STROKE_WEIGHT = 1
const LINE_MAX_CHILDREN = 2
const ANGLE_MIN = -1
const ANGLE_MAX = 1
const SPEED = 30
const COLLISION_PROBE_DISTANCE = 5

class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  sum(point: Point) {
    this.x += point.x
    this.y += point.y
  }

  isEqual(point: Point) {
    return this.x === point.x && this.y === point.y
  }

  round() {
    return new Point(Math.round(this.x), Math.round(this.y))
  }
}

function pixelIsWhite(pixel: number[]) {
  return pixel.length === 4 && pixel.every(channel => channel === 255)
}

class Line {
  start: Point
  end: Point
  currentDrawPoint: Point
  children = 0
  finishedDrawing = false
  parent: number | undefined
  steril = false
  angle: number
  nextPoint: Point

  constructor(sk: p5, start: Point, end: Point) {
    this.start = start
    this.end = end
    this.currentDrawPoint = Object.create(start)
    this.angle = sk.atan2(this.end.y - this.start.y, this.end.x - this.start.x)
    this.nextPoint = new Point(sk.cos(this.angle), sk.sin(this.angle))
  }

  drawNextStep(sk: p5, size: number) {
    this.checkCollision(sk, size)
    if (this.currentDrawPoint.round().isEqual(this.end.round())) {
      this.finishedDrawing = true
      return
    }
    this.currentDrawPoint.sum(this.nextPoint)
    sk.point(this.currentDrawPoint.x, this.currentDrawPoint.y)
  }

  // Assumes unpainted canvas pixels read back as opaque white. If growth halts instantly
  // after mounting, check that assumption first.
  checkCollision(sk: p5, size: number) {
    const probe = new Point(this.currentDrawPoint.x, this.currentDrawPoint.y)
    for (let i = 0; i < COLLISION_PROBE_DISTANCE; i++) {
      probe.sum(this.nextPoint)
      const pixel = sk.get(probe.x, probe.y) as number[]
      if (!pixelIsWhite(pixel) || probe.x < 0 || probe.x > size || probe.y < 0 || probe.y > size) {
        this.finishedDrawing = true
        this.end = this.currentDrawPoint
        this.steril = true
        return
      }
    }
  }
}

class Human {
  lines: Line[]
  currentLine: Line

  constructor(sk: p5, size: number) {
    this.lines = [new Line(sk, new Point(size / 2, size / 2), new Point(size / 2, size / 2 + 20))]
    this.currentLine = this.lines[0]!
  }

  drawStep(sk: p5, size: number, onFinished: () => void) {
    if (!this.currentLine.finishedDrawing) {
      this.currentLine.drawNextStep(sk, size)
      return
    }
    const parent = this.currentLine.parent !== undefined ? this.lines[this.currentLine.parent] : undefined
    if (parent && parent.children < LINE_MAX_CHILDREN) {
      this.createNewLine(sk, parent)
      return
    }
    const next = this.lineWithLessThanTwoChildren(sk)
    if (!next) {
      onFinished()
      return
    }
    this.currentLine = next
    this.createNewLine(sk, next)
  }

  createNewLine(sk: p5, from: Line) {
    from.children += 1
    const angle = from.angle + sk.random(ANGLE_MIN, ANGLE_MAX)
    const length = sk.int(sk.random(LINE_LENGTH_MIN, LINE_LENGTH_MAX))
    const end = new Point(length * Math.cos(angle), length * Math.sin(angle))
    end.sum(from.end)

    const newLine = new Line(sk, Object.create(from.end), end)
    newLine.parent = this.lines.indexOf(from)

    this.lines.push(newLine)
    this.currentLine = newLine
  }

  lineWithLessThanTwoChildren(sk: p5) {
    const candidates = this.lines.filter(line => line.children < LINE_MAX_CHILDREN && !line.steril)
    if (!candidates.length) return undefined
    return candidates[sk.int(sk.random(candidates.length - 1))]
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    let human: Human
    let go = false
    let size = 0

    sk.setup = () => {
      size = getSquareCanvasSize(container)
      // Original piece ran pixelDensity(3); capped to match the perf budget already
      // established for embedded sketches (see flow-field-sketch.ts).
      sk.pixelDensity(Math.min(window.devicePixelRatio || 1, 2))
      sk.createCanvas(size, size).parent(container)
      sk.stroke(0)
      sk.strokeWeight(STROKE_WEIGHT)
      human = new Human(sk, size)
    }

    sk.draw = () => {
      if (!go) return
      for (let i = 0; i < SPEED; i++) {
        human.drawStep(sk, size, () => (go = false))
      }
    }

    sk.mousePressed = () => {
      go = true
    }
  })

  return { destroy: () => instance.remove() }
}
