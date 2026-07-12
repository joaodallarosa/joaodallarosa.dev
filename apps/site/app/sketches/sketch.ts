// Ported from creative/src/pieces/sketch ("Multiverse Pottery") — a spiral stack of ellipses
// climbing the canvas, shaped live by mouse position. Never clears the canvas between frames,
// so the trail is the point: each pass builds on the last.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    let size = 0
    let x = 0
    let y = 0
    let starting = 0
    let angle = 0
    let rotationSpeed = 0.5

    sk.setup = () => {
      size = getSquareCanvasSize(container)
      sk.createCanvas(size, size).parent(container)
      sk.angleMode(sk.DEGREES)
      sk.frameRate(120)
      x = 0
      y = size
      starting = 0
      angle = 0
    }

    sk.draw = () => {
      x += sk.random(-5, 5)
      y -= 4.5
      if (y < -100) {
        y = size + 100
        starting += 200
        rotationSpeed = sk.random(-0.5, 0.5)
      }
      sk.translate(x + starting, y, 0)
      sk.rotate(angle)
      sk.strokeWeight(sk.random(0.1, 0.8))
      sk.stroke(20, 0, 0)
      sk.noFill()
      sk.ellipse(0, 0, sk.mouseY / 2, sk.mouseX / 2)
      angle += rotationSpeed
    }
  })

  return { destroy: () => instance.remove() }
}
