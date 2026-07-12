// Ported from creative/src/pieces/not-art — six letters, each built from hundreds of tiny
// scattered text strokes and masked into shape. Layout is a fixed composition tuned for a
// ~700px canvas (letters intentionally run off the right/bottom edge), not a responsive grid,
// so positions are kept as literal constants rather than scaled to the embed size.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const FONT_SIZE = 350
const STROKE_COUNT = 480

function renderLetter(sk: p5, font: p5.Font, letter: string, x: number, y: number, fillText: string) {
  const textCnv = sk.createGraphics(FONT_SIZE, FONT_SIZE)
  textCnv.background(1000)
  textCnv.fill(0)
  textCnv.textFont(font)
  for (let i = 0; i < STROKE_COUNT; i++) {
    textCnv.textSize(sk.random(4, 25))
    textCnv.push()
    textCnv.translate(sk.random(0, textCnv.width), sk.random(0, textCnv.height))
    textCnv.rotate((sk.HALF_PI / 2) * sk.random(-1, 1))
    textCnv.text(fillText, 0, 0)
    textCnv.pop()
  }

  const maskImage = sk.createGraphics(FONT_SIZE, FONT_SIZE)
  maskImage.fill(0)
  maskImage.textSize(FONT_SIZE)
  maskImage.text(letter, 30, FONT_SIZE)

  const masked = textCnv.get()
  masked.mask(maskImage.get())
  sk.image(masked, x, y)
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    // p5 v2 dropped the separate preload() lifecycle in favor of an async setup() that
    // awaits its own asset loads.
    sk.setup = async () => {
      const font = await sk.loadFont('/fonts/sketches/flicker.otf')
      const size = getSquareCanvasSize(container)
      sk.createCanvas(size, size).parent(container)
      sk.background(1000)

      renderLetter(sk, font, 'N', -30, 0, 'art')
      renderLetter(sk, font, 'O', 200, 0, 'art')
      renderLetter(sk, font, 'T', 450, 0, 'art')
      renderLetter(sk, font, 'A', -20, 300, 'not')
      renderLetter(sk, font, 'R', 200, 300, 'not')
      renderLetter(sk, font, 'T', 450, 300, 'not')
    }
  })

  return { destroy: () => instance.remove() }
}
