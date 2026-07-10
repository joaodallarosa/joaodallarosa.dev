import type { Meta, StoryObj } from '@storybook/web-components'
import './badge.js'

interface BadgeArgs {
  kind?: 'project' | 'post'
  status?: 'draft' | 'published'
  label: string
}

const meta: Meta<BadgeArgs> = {
  title: 'Components/Badge',
  component: 'ds-badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Non-interactive kind/status indicator. Kind hues and status colors are deliberately '
          + 'separate palettes (docs/design-prompt.md §1) so status reads independently of content kind — '
          + 'set either `kind` or `status`, not both, in real usage.',
      },
    },
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [undefined, 'project', 'post'],
    },
    status: {
      control: 'select',
      options: [undefined, 'draft', 'published'],
    },
    label: {
      control: 'text',
      description: 'Slotted content (not a real attribute — story-only convenience arg).',
    },
  },
  args: {
    kind: 'project',
    label: 'project',
  },
  render: args => `
    <ds-badge kind="${args.kind ?? ''}" status="${args.status ?? ''}">
      ${args.label}
    </ds-badge>
  `,
}

export default meta
type Story = StoryObj<BadgeArgs>

export const Kind: Story = {}

export const Status: Story = {
  args: { kind: undefined, status: 'published', label: 'published' },
}

export const AllKinds: Story = {
  render: () => `
    <div style="display: flex; gap: var(--space-3);">
      <ds-badge kind="project">project</ds-badge>
      <ds-badge kind="post">post</ds-badge>
    </div>
  `,
}

export const AllStatuses: Story = {
  render: () => `
    <div style="display: flex; gap: var(--space-3);">
      <ds-badge status="draft">Draft</ds-badge>
      <ds-badge status="published">Published</ds-badge>
    </div>
  `,
}
