import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { xrayStyles, xrayTag } from '../utils/xray.js'

export type ButtonVariant = 'primary' | 'secondary'

@customElement('ds-button')
export class DsButton extends LitElement {
  static styles = [
    xrayStyles,
    css`
      :host {
        display: inline-block;
      }

      .root {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2, 0.5rem);
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-mono-em, 500);
        line-height: var(--line-height-ui, 1.4);
        padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
        border: 1px solid transparent;
        border-radius: 2px;
        cursor: pointer;
        transition:
          background-color var(--motion-duration-base, 160ms) var(--motion-easing-mechanical, ease),
          color var(--motion-duration-base, 160ms) var(--motion-easing-mechanical, ease),
          border-color var(--motion-duration-base, 160ms) var(--motion-easing-mechanical, ease);
      }

      .root:focus-visible {
        outline: 2px solid var(--color-focus-ring, #ffc94d);
        outline-offset: 2px;
      }

      .root[data-variant='primary'] {
        background: var(--color-accent, #ffb000);
        color: var(--color-neutral-950, #0b0c0d);
      }

      .root[data-variant='primary']:hover:not(:disabled) {
        background: var(--color-accent-hover, #ffc94d);
      }

      .root[data-variant='secondary'] {
        background: transparent;
        color: var(--color-text, #eceeef);
        border-color: var(--color-border, #2a2e32);
      }

      .root[data-variant='secondary']:hover:not(:disabled) {
        border-color: var(--color-accent, #ffb000);
        color: var(--color-accent, #ffb000);
      }

      .root:disabled {
        background: var(--color-disabled-bg, #1c1f22);
        color: var(--color-disabled-text, #3d4247);
        border-color: transparent;
        cursor: not-allowed;
      }
    `,
  ]

  @property({ type: String }) variant: ButtonVariant = 'primary'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button'

  render() {
    return html`
      <button class="root" part="root" data-variant=${this.variant} type=${this.type} ?disabled=${this.disabled}>
        ${xrayTag(`ds-button[${this.variant}]`)}
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton
  }
}
