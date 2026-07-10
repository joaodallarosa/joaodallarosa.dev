export type ButtonVariant = 'primary' | 'secondary'

const styles = `
  :host {
    display: inline-block;
  }

  .root {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    font-family: var(--font-family-mono, monospace);
    font-size: var(--font-size-base, 1rem);
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
`

/**
 * Plain Custom Element (no reactive-property framework) — attributes are read
 * directly and pushed onto the shadow-DOM button in #update().
 */
export class DsButton extends HTMLElement {
  static observedAttributes = ['variant', 'disabled', 'type']

  #root: HTMLButtonElement

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `<style>${styles}</style><button class="root" part="root"><slot></slot></button>`
    this.#root = shadow.querySelector('button')!
  }

  connectedCallback() {
    this.#update()
  }

  attributeChangedCallback() {
    this.#update()
  }

  get variant(): ButtonVariant {
    return this.getAttribute('variant') as ButtonVariant || 'primary'
  }

  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value)
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled')
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value)
  }

  get type(): 'button' | 'submit' | 'reset' {
    return this.getAttribute('type') as 'button' | 'submit' | 'reset' || 'button'
  }

  set type(value: 'button' | 'submit' | 'reset') {
    this.setAttribute('type', value)
  }

  #update() {
    this.#root.dataset.variant = this.variant
    this.#root.type = this.type
    this.#root.disabled = this.disabled
  }
}

customElements.define('ds-button', DsButton)

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton
  }
}
