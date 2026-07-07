# design-system

Lit-based Web Components, kept in-repo alongside `apps/site`. Portable across frameworks by design — see [PROJECT.md](../../PROJECT.md) §3.

## Components

- `ds-button` — primary/secondary variants, disabled state.
- `ds-tag` — interactive filter chip, toggled via click (`ds-tag-toggle` event), `aria-pressed` reflects state.
- `ds-badge` — non-interactive `kind` (project/post/note/log) or `status` (draft/published) indicator.
- `ds-card` — entry preview container (`cover`/`title`/`badge`/`footer` slots + default excerpt slot), optional `kind` for accent border.

All four are leaf components with real Shadow DOM (see PROJECT.md §3's Shadow DOM scope convention) and carry their own Developer Mode x-ray skin (`packages/design-system/src/utils/xray.ts`) — no bolted-on overlay, activated globally by adding `data-dev-mode` to any ancestor element (typically `<html>`).

## Consuming this package

Design tokens and the `:not(:defined)` FOUC guard ship as plain CSS, loaded once globally by the host app:

```ts
// nuxt.config.ts
css: ['design-system/tokens.css', 'design-system/hydration.css']
```

Import `design-system` once (client-side) to register the custom elements, and tell your framework's compiler to treat `ds-*` tags as native elements rather than unresolved components. See `apps/site/nuxt.config.ts` and `apps/site/app/plugins/design-system.client.ts` for the reference wiring.

## Design tokens

Values and rationale: [docs/design-prompt.md](../../docs/design-prompt.md). Source of truth: `src/tokens/tokens.css`.
