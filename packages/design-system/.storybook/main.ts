import type { StorybookConfig } from '@storybook/web-components-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
}

export default config
