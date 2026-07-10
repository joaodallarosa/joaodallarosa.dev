import type { Preview } from '@storybook/web-components'
import { setCustomElementsManifest } from '@storybook/web-components'
import customElements from './custom-elements.json'
import '../src/index.ts'
// Self-hosted, matching apps/site/nuxt.config.ts — one entry per weight/style actually used
// (see tokens.css's --font-weight-* values plus Typography.mdx's own weight samples), not the
// full family or a variable-font axis range.
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/600-italic.css'
import '@fontsource/fraunces/900-italic.css'
import '@fontsource/jetbrains-mono/300.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '../src/tokens/tokens.css'
import '../src/styles/hydration.css'

setCustomElementsManifest(customElements)

/*
 * Storybook toolbar global mirrors the site's light/dark token override
 * (docs/design-prompt.md) so it can be exercised without leaving the docs.
 */
const preview: Preview = {
  parameters: {
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    colorScheme: {
      name: 'Color scheme',
      description: 'Token color scheme override',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark (default)' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: 'dark',
  },
  decorators: [
    (story, context) => {
      document.documentElement.setAttribute('data-color-scheme', context.globals.colorScheme ?? 'dark')
      document.body.style.background = 'var(--color-bg)'
      document.body.style.color = 'var(--color-text)'
      document.body.style.fontFamily = 'var(--font-family-serif)'
      document.body.style.minHeight = '100vh'
      document.body.style.margin = '0'
      return story()
    },
  ],
}

export default preview
