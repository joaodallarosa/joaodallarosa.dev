// Ported from creative/src/pieces/single-line ("A Line") — one continuous line, folded into
// a square with rounded turns at each row. Draws once on mount; no interaction.
import type p5 from 'p5'
import { getSquareCanvasSize, type SketchHandle } from '~/utils/sketch-canvas'

const LINE_SPACING = 30
const LINE_WEIGHT = 6

function drawSingleLine(sk: p5, startX: number, startY: number, width: number, height: number) {
  sk.stroke(0)
  sk.strokeWeight(LINE_WEIGHT)
  for (let row = 0; row <= height; row += LINE_SPACING) {
    const isLastRow = row + LINE_SPACING > height
    const lineStart = LINE_SPACING / 2
    const lineEnd = (row / LINE_SPACING) % 2 === 0 && isLastRow ? width : width - LINE_SPACING / 2
    for (let col = lineStart; col < lineEnd; col += 1) {
      sk.point(col + startX, row + startY)
    }

    if (isLastRow) continue
    sk.push()
    sk.strokeWeight(LINE_WEIGHT)
    sk.noFill()
    if ((row / LINE_SPACING) % 2) {
      sk.translate(LINE_SPACING + startX - LINE_SPACING / 2, row + startY + LINE_SPACING / 2, 0)
      sk.rotate(sk.HALF_PI + sk.PI * 2)
    }
    else {
      sk.translate(width + startX - LINE_SPACING / 2, row + startY + LINE_SPACING / 2, 0)
      sk.rotate(sk.HALF_PI + sk.PI)
    }
    sk.arc(0, 0, LINE_SPACING, LINE_SPACING, 0, sk.PI)
    sk.pop()
  }
}

export default async function mount(container: HTMLElement): Promise<SketchHandle> {
  const { default: P5 } = await import('p5')

  const instance = new P5((sk: p5) => {
    sk.setup = () => {
      const size = getSquareCanvasSize(container)
      sk.createCanvas(size, size).parent(container)
      drawSingleLine(sk, 50, 50, size - 100, size - 100)
    }
  })

  return { destroy: () => instance.remove() }
}
