import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './card.js'
import './badge.js'

interface CardArgs {
  kind?: 'project' | 'post' | 'note' | 'log'
  title: string
  body: string
  footer: string
}

const meta: Meta<CardArgs> = {
  title: 'Components/Card',
  component: 'ds-card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Entry preview container (homepage feed, related-entry lists). Named slots: `cover`, '
          + '`title`, `badge`, default (excerpt body), `footer` (meta). `kind` tints the left accent '
          + 'border via `--card-accent`.',
      },
    },
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [undefined, 'project', 'post', 'note', 'log'],
    },
    title: { control: 'text' },
    body: { control: 'text' },
    footer: { control: 'text' },
  },
  args: {
    kind: 'log',
    title: 'Refinishing the workbench',
    body: 'Stripped, sanded, and re-oiled the shop workbench over a long weekend.',
    footer: '2026-07-02 · woodworking',
  },
  render: args => html`
    <ds-card
      kind=${args.kind ?? ''}
      style="max-width: 24rem;"
    >
      <span slot="title">${args.title}</span>
      <ds-badge
        slot="badge"
        kind=${args.kind ?? ''}
      >
        ${args.kind}
      </ds-badge>
      <p>${args.body}</p>
      <span slot="footer">${args.footer}</span>
    </ds-card>
  `,
}

export default meta
type Story = StoryObj<CardArgs>

export const Default: Story = {}

export const Untyped: Story = {
  args: { kind: undefined },
}
