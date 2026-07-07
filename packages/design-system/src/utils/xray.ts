import { css, html } from 'lit'

/**
 * Developer Mode's x-ray skin, shared across leaf components.
 * Toggled by presence of `data-dev-mode` on any ancestor (see PROJECT.md §4) —
 * no per-component JS needed, components just carry the CSS for their own x-ray state.
 */
export const xrayStyles = css`
  :host-context([data-dev-mode]) .root {
    position: relative;
    outline: 1px dashed var(--devmode-outline-color, #ffc94d);
    outline-offset: 2px;
  }

  .xray-tag {
    display: none;
  }

  :host-context([data-dev-mode]) .xray-tag {
    display: block;
    position: absolute;
    top: -1.1em;
    left: 0;
    z-index: 1;
    padding: 0 4px;
    font-family: var(--devmode-font, monospace);
    font-size: 9px;
    line-height: 1.4;
    color: var(--devmode-text, #ffc94d);
    background: var(--devmode-bg, #0b0c0d);
    white-space: nowrap;
    pointer-events: none;
  }
`

export function xrayTag(label: string) {
  return html`<span class="xray-tag">${label}</span>`
}
