export type BadgeKind = 'project' | 'note'
export type BadgeStatus = 'draft' | 'published'

const styles = `
  :host {
    display: inline-block;
  }

  .root {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1, 0.25rem);
    font-family: var(--font-family-mono, monospace);
    font-size: var(--font-size-base, 1rem);
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

  .root[data-kind='note'] {
    background: color-mix(in srgb, var(--color-kind-note, #4fb6a6) 16%, transparent);
    color: var(--color-kind-note, #4fb6a6);
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
`

/**
 * Non-interactive kind/status indicator. Kind hues and status colors are
 * deliberately separate palettes (see docs/design-prompt.md §1) so status
 * reads independently of content kind.
 */
export class DsBadge extends HTMLElement {
  static observedAttributes = ['kind', 'status']

  #root: HTMLSpanElement

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `<style>${styles}</style><span class="root" part="root"><slot></slot></span>`
    this.#root = shadow.querySelector('span')!
  }

  connectedCallback() {
    this.#update()
  }

  attributeChangedCallback() {
    this.#update()
  }

  get kind(): BadgeKind | undefined {
    return this.getAttribute('kind') as BadgeKind || undefined
  }

  set kind(value: BadgeKind | undefined) {
    if (value) this.setAttribute('kind', value)
    else this.removeAttribute('kind')
  }

  get status(): BadgeStatus | undefined {
    return this.getAttribute('status') as BadgeStatus || undefined
  }

  set status(value: BadgeStatus | undefined) {
    if (value) this.setAttribute('status', value)
    else this.removeAttribute('status')
  }

  #update() {
    if (this.kind) this.#root.dataset.kind = this.kind
    else delete this.#root.dataset.kind

    if (this.status) this.#root.dataset.status = this.status
    else delete this.#root.dataset.status
  }
}

customElements.define('ds-badge', DsBadge)

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge
  }
}
