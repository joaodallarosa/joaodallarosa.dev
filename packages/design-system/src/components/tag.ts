import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { xrayStyles, xrayTag } from '../utils/xray.js'

/**
 * Interactive filter chip (content tags), distinct from ds-badge which is
 * non-interactive kind/status indication. See docs/design-prompt.md.
 */
@customElement('ds-tag')
export class DsTag extends LitElement {
  static styles = [
    xrayStyles,
    css`
      :host {
        display: inline-block;
      }

      .root {
        display: inline-flex;
        align-items: center;
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs, 0.75rem);
        font-weight: var(--font-weight-mono, 400);
        line-height: var(--line-height-ui, 1.4);
        padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
        border: 1px solid var(--color-border, #2a2e32);
        border-radius: 999px;
        background: transparent;
        color: var(--color-text-muted, #868c91);
        cursor: pointer;
        transition:
          border-color var(--motion-duration-fast, 100ms) var(--motion-easing-mechanical, ease),
          color var(--motion-duration-fast, 100ms) var(--motion-easing-mechanical, ease);
      }

      .root:focus-visible {
        outline: 2px solid var(--color-focus-ring, #ffc94d);
        outline-offset: 2px;
      }

      .root:hover {
        border-color: var(--color-accent, #ffb000);
        color: var(--color-text, #eceeef);
      }

      .root[aria-pressed='true'] {
        border-color: var(--color-accent, #ffb000);
        color: var(--color-accent, #ffb000);
      }
    `,
  ]

  @property({ type: Boolean, reflect: true }) selected = false

  #onClick() {
    this.selected = !this.selected
    this.dispatchEvent(
      new CustomEvent('ds-tag-toggle', {
        detail: { selected: this.selected },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`
      <button
        class="root"
        part="root"
        type="button"
        aria-pressed=${this.selected ? 'true' : 'false'}
        @click=${this.#onClick}
      >
        ${xrayTag(`ds-tag[selected=${this.selected}]`)}
        <slot></slot>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tag': DsTag
  }
}
