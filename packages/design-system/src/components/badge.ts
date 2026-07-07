import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { xrayStyles, xrayTag } from '../utils/xray.js'

export type BadgeKind = 'project' | 'post' | 'note' | 'log'
export type BadgeStatus = 'draft' | 'published'

/**
 * Non-interactive kind/status indicator. Kind hues and status colors are
 * deliberately separate palettes (see docs/design-prompt.md §1) so status
 * reads independently of content kind.
 */
@customElement('ds-badge')
export class DsBadge extends LitElement {
  static styles = [
    xrayStyles,
    css`
      :host {
        display: inline-block;
      }

      .root {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1, 0.25rem);
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs, 0.75rem);
        font-weight: var(--font-weight-mono-em, 500);
        line-height: var(--line-height-ui, 1.4);
        padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
        border-radius: 2px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-text-muted, #868c91);
      }

      .root[data-kind='project'] {
        background: color-mix(in srgb, var(--color-kind-project, #6ea8d8) 16%, transparent);
        color: var(--color-kind-project, #6ea8d8);
      }

      .root[data-kind='post'] {
        background: color-mix(in srgb, var(--color-kind-post, #4fb6a6) 16%, transparent);
        color: var(--color-kind-post, #4fb6a6);
      }

      .root[data-kind='note'] {
        background: color-mix(in srgb, var(--color-kind-note, #9b8fd1) 16%, transparent);
        color: var(--color-kind-note, #9b8fd1);
      }

      .root[data-kind='log'] {
        background: color-mix(in srgb, var(--color-kind-log, #c97b5a) 16%, transparent);
        color: var(--color-kind-log, #c97b5a);
      }

      .root[data-status='draft'] {
        background: transparent;
        color: var(--color-status-draft, #5b6166);
        border: 1px dashed var(--color-status-draft, #5b6166);
        padding-block: calc(var(--space-1, 0.25rem) - 1px);
      }

      .root[data-status='published'] {
        background: transparent;
        color: var(--color-status-published, #ffb000);
      }

      .root[data-status='published']::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
    `,
  ]

  @property({ type: String }) kind?: BadgeKind
  @property({ type: String }) status?: BadgeStatus

  render() {
    return html`
      <span class="root" part="root" data-kind=${this.kind ?? ''} data-status=${this.status ?? ''}>
        ${xrayTag(`ds-badge[${this.kind ?? this.status ?? 'plain'}]`)}
        <slot></slot>
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge
  }
}
