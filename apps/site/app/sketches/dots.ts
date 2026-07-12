// Ported from creative/src/pieces/dots ("Only Lines") — rebuilds a photo as a field of short
// lines and dots, one per sample point, sized by local brightness.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const SPACING = 6
const INITIAL_BLACK_FREQUENCY = 12
const FREQUENCY_GAP = 0.14
const FREQUENCY_MULTIPLIER = 0.0035
const FREQUENCY_STEPS = 255 / (FREQUENCY_GAP * FREQUENCY_MULTIPLIER)
const LINE_WEIGHT = 1.1

function drawPixel(sk: p5, img: p5.Image, x: number, y: number) {
  sk.noFill()
  const pixel = img.get(x, y)
  sk.stroke(0)
  sk.strokeWeight(LINE_WEIGHT)
  const brightness = (pixel[0]! + pixel[1]! + pixel[2]!) / 3
  for (let i = 1; i <= FREQUENCY_STEPS; i++) {
    if (brightness < INITIAL_BLACK_FREQUENCY + FREQUENCY_GAP * i) {
      const lineSize = Math.max(SPACING - i * FREQUENCY_MULTIPLIER, 0)
      sk.line(x, y, x + lineSize, y + lineSize)
      return
    }
  }
  sk.point(x, y)
}

function renderImage(sk: p5, img: p5.Image) {
  for (let col = SPACING; col < img.width; col += SPACING) {
    for (let row = SPACING; row < img.height; row += SPACING) {
      drawPixel(sk, img, col, row)
    }
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    // p5 v2 dropped the separate preload() lifecycle in favor of an async setup() that
    // awaits its own asset loads.
    sk.setup = async () => {
      const img = await sk.loadImage('/images/sketches/cat.jpeg')
      const size = getSquareCanvasSize(container)
      img.resize(size, 0)
      // Original piece ran pixelDensity(6) for export-quality output; capped here to match
      // the perf budget already established for embedded sketches (see flow-field-sketch.ts).
      sk.pixelDensity(Math.min(window.devicePixelRatio || 1, 2))
      sk.createCanvas(size, size).parent(container)
      sk.background(255)
      renderImage(sk, img)
    }
  })

  return { destroy: () => instance.remove() }
}
