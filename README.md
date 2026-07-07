# joao-website

A personal publication with a working lab attached — dev projects, creative coding, and non-technical work (recipes, repairs, builds) under one voice, with an in-repo Web Components design system as a demonstration artifact.

Full context, decisions, and phasing live in [PROJECT.md](./PROJECT.md) — read that first.

## Layout

- `apps/site` — the Nuxt app (content, pages, i18n).
- `packages/design-system` — Lit-based Web Components, consumed by the site and portable to other frameworks.

## Prerequisites

- Node ≥22 (Node 20 is end-of-life and no longer gets prebuilt native binaries for some dependencies — e.g. `better-sqlite3` — which forces a from-source compile)
- pnpm, via [corepack](https://pnpm.io/installation#using-corepack) (`corepack enable` picks up the pinned version from `packageManager` in `package.json`)

## Scripts

Run from the repo root:

- `pnpm dev` — start the site's dev server.
- `pnpm build` — build all packages.
- `pnpm lint` — lint all packages.
- `pnpm typecheck` — typecheck all packages.
