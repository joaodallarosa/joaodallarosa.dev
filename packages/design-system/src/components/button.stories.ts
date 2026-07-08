import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './button.js'

interface ButtonArgs {
  variant: 'primary' | 'secondary'
  disabled: boolean
  type: 'button' | 'submit' | 'reset'
  label: string
}

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  component: 'ds-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    type: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
    label: {
      control: 'text',
      description: 'Slotted content (not a real attribute — story-only convenience arg).',
    },
  },
  args: {
    variant: 'primary',
    disabled: false,
    type: 'button',
    label: 'Publish',
  },
  render: (args) => html`
    <ds-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      type=${args.type}
    >
      ${args.label}
    </ds-button>
  `,
}

export default meta
type Story = StoryObj<ButtonArgs>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Save draft' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
