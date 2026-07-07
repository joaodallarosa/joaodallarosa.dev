import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { xrayStyles, xrayTag } from '../utils/xray.js'
import type { BadgeKind } from './badge.js'

/**
 * Entry preview container (homepage feed, related-entry lists). Slots:
 * cover, title, badge (kind/status), default (excerpt body), footer (meta).
 */
@customElement('ds-card')
export class DsCard extends LitElement {
  static styles = [
    xrayStyles,
    css`
      :host {
        display: block;
      }

      .root {
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 0.75rem);
        padding: var(--space-5, 1.5rem);
        background: var(--color-bg-raised, #131517);
        border: 1px solid var(--color-border, #2a2e32);
        border-left: 3px solid var(--card-accent, var(--color-border, #2a2e32));
        border-radius: 2px;
        transition: border-color var(--motion-duration-base, 160ms) var(--motion-easing-mechanical, ease);
      }

      .root:hover {
        border-color: var(--card-accent, var(--color-accent, #ffb000));
      }

      ::slotted([slot='cover']) {
        display: block;
        width: 100%;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-2, 0.5rem);
      }

      .title {
        margin: 0;
        font-family: var(--font-family-serif, serif);
        font-size: var(--font-size-lg, 1.375rem);
        line-height: var(--line-height-headline, 1.1);
        font-weight: var(--font-weight-subhead, 500);
        color: var(--color-text, #eceeef);
      }

      .body {
        font-family: var(--font-family-serif, serif);
        font-size: var(--font-size-base, 1rem);
        line-height: var(--line-height-reading, 1.6);
        color: var(--color-text-muted, #868c91);
      }

      .footer {
        font-family: var(--font-family-mono, monospace);
        font-size: var(--font-size-xs, 0.75rem);
        color: var(--color-text-muted, #868c91);
      }
    `,
  ]

  @property({ type: String }) kind?: BadgeKind

  render() {
    const cardAccentStyle = this.kind ? `--card-accent: var(--color-kind-${this.kind});` : nothing

    return html`
      <article class="root" part="root" style=${cardAccentStyle}>
        ${xrayTag(`ds-card[${this.kind ?? 'untyped'}]`)}
        <slot name="cover"></slot>
        <div class="header">
          <h3 class="title"><slot name="title"></slot></h3>
          <slot name="badge"></slot>
        </div>
        <div class="body"><slot></slot></div>
        <div class="footer"><slot name="footer"></slot></div>
      </article>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard
  }
}
