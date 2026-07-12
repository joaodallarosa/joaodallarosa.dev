// Ported from creative/src/pieces/synth — a single scanning line looping down the canvas.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    let y = 100

    sk.setup = () => {
      const size = getSquareCanvasSize(container)
      sk.createCanvas(size, size).parent(container)
      sk.stroke(255)
      sk.frameRate(30)
    }

    sk.draw = () => {
      sk.background(0)
      y -= 1
      if (y < 0) y = sk.height
      sk.line(0, y, sk.width, y)
    }
  })

  return { destroy: () => instance.remove() }
}
