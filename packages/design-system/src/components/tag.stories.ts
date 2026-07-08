import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './tag.js'

interface TagArgs {
  selected: boolean
  label: string
}

const meta: Meta<TagArgs> = {
  title: 'Components/Tag',
  component: 'ds-tag',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Slotted content (not a real attribute — story-only convenience arg).',
    },
  },
  args: {
    selected: false,
    label: 'nuxt',
  },
  render: args => html`
    <ds-tag ?selected=${args.selected}>${args.label}</ds-tag>
  `,
}

export default meta
type Story = StoryObj<TagArgs>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true },
}

export const Group: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--space-3);">
      <ds-tag>nuxt</ds-tag>
      <ds-tag selected>lit</ds-tag>
      <ds-tag>design-systems</ds-tag>
      <ds-tag>accessibility</ds-tag>
    </div>
  `,
}
