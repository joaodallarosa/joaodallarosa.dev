// Ported from creative/src/pieces/anxiety-tree — a recursive line-growth study that branches
// and retries whenever a new branch would cross an existing one or leave a fixed 500px bound
// (a quirk of the original, kept as-is rather than tied to the current canvas size).
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const BOUNDS = 500

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

function segmentsIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false
  if (x1 === x3 && y1 === y3) return false

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  if (denominator === 0) return false

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
  return !(ua < 0 || ua > 1 || ub < 0 || ub > 1)
}

class Line {
  start: Point
  end: Point
  currentDrawPoint: Point
  children = 0
  finishedDrawing = false
  parent: number | undefined
  angle: number

  constructor(sk: p5, start: Point, end: Point) {
    this.start = start
    this.end = end
    this.currentDrawPoint = Object.create(start)
    this.angle = sk.atan2(this.end.y - this.start.y, this.end.x - this.start.x)
  }

  drawNextStep(sk: p5) {
    if (this.currentDrawPoint.round().isEqual(this.end.round())) {
      this.finishedDrawing = true
      return
    }
    const nextPoint = new Point(sk.cos(this.angle), sk.sin(this.angle))
    this.currentDrawPoint.sum(nextPoint)
    sk.point(this.currentDrawPoint.x, this.currentDrawPoint.y)
  }
}

class Human {
  lines: Line[]
  currentLine: Line

  constructor(sk: p5, size: number) {
    this.lines = [new Line(sk, new Point(size / 2, size), new Point(size / 2, size / 1.5))]
    this.currentLine = this.lines[0]!
  }

  drawStep(sk: p5) {
    if (!this.currentLine.finishedDrawing) {
      this.currentLine.drawNextStep(sk)
      return
    }
    const parent = this.currentLine.parent !== undefined ? this.lines[this.currentLine.parent] : undefined
    if (parent && parent.children < 2) this.createNewLine(sk, parent)
    else this.createNewLine(sk, this.currentLine)
  }

  createNewLine(sk: p5, from: Line) {
    from.children += 1
    let angle = from.angle + sk.random(-1, 1)
    let length = sk.int(sk.random(10, 60))
    let end = new Point(length * Math.cos(angle), length * Math.sin(angle))
    end.sum(from.end)
    let newLine = new Line(sk, Object.create(from.end), end)
    newLine.parent = this.lines.indexOf(from)

    let counter = 0
    while (
      end.x <= 0 || end.x > BOUNDS || end.y <= 0 || end.y >= BOUNDS
      || (this.intersects(newLine) && counter <= 500)
    ) {
      counter++
      angle = from.angle + sk.random(-2, 2)
      length = sk.int(sk.random(10, 60))
      end = new Point(length * Math.cos(angle), length * Math.sin(angle))
      end.sum(from.end)
      newLine = new Line(sk, Object.create(from.end), end)
    }

    if (counter >= 500) {
      const fallback = this.lines.find(line => line.children < 2)
      if (fallback) this.currentLine = fallback
      return
    }

    this.lines.push(newLine)
    this.currentLine = newLine
  }

  intersects(line: Line) {
    const others = this.lines.filter(candidate => this.lines.indexOf(candidate) !== line.parent)
    return others.some(other =>
      segmentsIntersect(line.start.x, line.start.y, line.end.x, line.end.y, other.start.x, other.start.y, other.end.x, other.end.y),
    )
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    let human: Human
    let go = false

    sk.setup = () => {
      const size = getSquareCanvasSize(container)
      sk.createCanvas(size, size).parent(container)
      sk.stroke(0)
      sk.strokeWeight(1)
      human = new Human(sk, size)
    }

    sk.draw = () => {
      if (!go) return
      human.drawStep(sk)
      human.drawStep(sk)
    }

    sk.mousePressed = () => {
      go = true
    }
  })

  return { destroy: () => instance.remove() }
}
