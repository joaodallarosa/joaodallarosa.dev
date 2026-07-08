import { existsSync } from 'node:fs'
import { cp, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(rootDir, '../packages/design-system/storybook-static')
const dest = path.resolve(rootDir, '../apps/site/public/storybook')

if (!existsSync(src)) {
  console.error('[copy-storybook] storybook-static not found — run `pnpm --filter design-system run build-storybook` first.')
  process.exit(1)
}

await rm(dest, { recursive: true, force: true })
await cp(src, dest, { recursive: true })
console.log(`[copy-storybook] copied ${src} -> ${dest}`)
