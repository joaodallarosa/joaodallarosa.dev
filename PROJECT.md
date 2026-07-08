# Personal Site / Design System — Project Memory

_Last updated: 2026-07-08 (Phase 4 done, Phase 5 up next) · This file is the running source of truth for context, decisions, and "why." Hand this to a fresh Claude session before starting new work so it doesn't need to be re-explained._

---

## 1. Vision

Not a portfolio — a personal publication with a working lab attached. Showcases dev projects, creative coding, and completely non-technical stuff (a recipe, a repair, a woodworking build) under one voice: creative, technical, design-literate, playful but credible, never gimmicky.

**Three audiences, different needs:**
- Recruiters/hiring managers — skim, want quick credibility signal.
- Developers/designers — want to see *how you think*, not just outputs. Served by Developer Mode + component showcase.
- General readers — following a link to a non-tech post. Should never be made to care about the design system.

The design system is a **demonstration artifact**, not a product. Optimize for "impressive, well-reasoned, maintainable by one person" — not "scales to many teams/consumers."

---

## 2. Content model / IA

One underlying **Entry** concept, multiple **kinds**, not separate content types per topic:

```
Entry (base: title, slug, dates, status[draft/published], locale, tags, cover media)
 ├─ kind: "project" → role, stack, links, gallery, case-study body
 ├─ kind: "post"    → long-form body, reading time
 ├─ kind: "note"    → short body, no ToC/hero
 └─ kind: "log"     → category (woodworking/recipe/fix/...), optional steps/materials list
```

Implemented as Nuxt Content v3 typed collections — one schema per kind, shared base fields, one query surface. Navigation stays flat initially (tags/kind badges drive filtering); split into hard top-level sections only once volume demands it.

---

## 3. Tech stack — decisions and reasoning

| Layer | Choice | Why |
|---|---|---|
| App framework | Vue 3 + Nuxt | Matches existing skill, strong i18n story (`@nuxtjs/i18n`), good fit for content-heavy sites |
| Content | Nuxt Content v3 | Typed collections map cleanly to the Entry/kind model |
| CMS | Nuxt Studio (self-hosted OSS module, stable as of Jan 2026) | Git-backed, built-in drafts, Notion-like + Monaco + schema-form editors, direct GitHub/GitLab commits. **Constraint:** requires SSR hosting (not pure static export) — auth route + hybrid rendering required. **Gap:** automatic media optimization is roadmapped, not shipped yet — use `@nuxt/image` for optimization instead, works today and composes fine alongside Studio. |
| Design system | **Lit-based Web Components**, kept in-repo | See §4 — this is the one technology that gives genuine cross-framework portability, which turned out to matter a lot (see interop decision below) |
| Deployment | Vercel | No real friction for WebGL/perf. GDPR risk is **not** the host — it's what you bolt on top (analytics/trackers). Keep that minimal (see below) and there's little to solve. |
| Analytics | **Cookieless/privacy-first (Plausible-style)** — decided | No consent banner needed if no tracking cookies are set. Avoids the GDPR problem rather than solving it. |
| Repo structure | **Monorepo/workspace** (single repo, pnpm workspaces) — decided | Design system lives as its own package inside the same repo initially; can be split into a separate repo later without much pain once/if it's worth it. Reads as "a real, separate system" via package boundaries, not folder-of-components-in-the-site. |

### Design-system / Web Components — the SSR-vs-portability question, resolved

Two separate problems that got conflated at first:

1. **Cross-framework consumption** (a React dev drops your component into their app) — **easy now**. React 19 added full native custom-element support (properties, custom events, correct SSR attribute serialization) and passes 100% of Custom Elements Everywhere tests. Vue already handled this via `.prop` bindings for rich data. A Lit Web Component is natively usable in both without wrapper packages. **This is the actual answer to "will a React shop instant-no this" — and it argues for keeping Web Components, not dropping them.**
2. **SSR of your own site's pages** that embed those components — genuinely the harder part, but scoped narrower than it first looked. Resolution:
   - Page **body content** (headings, prose) stays plain semantic HTML rendered natively by Nuxt/Vue — never inside a Shadow Root. Keeps SEO/crawlability untouched by any of this.
   - Web Components are reserved for **discrete UI widgets** (buttons, tags, cards, nav elements, showcase controls) — accept a brief, CSS-hidden hydration step (`:not(:defined)` to avoid FOUC) rather than fighting for full Declarative Shadow DOM SSR everywhere.
   - Only do the full Lit-SSR-to-static-DSD-string trick for the rare above-the-fold case where a component must be visible with zero JS. Treat as a documented one-off technique, not a default requirement.
3. **Shadow DOM scope convention:** leaf/true components (Button, Tag, Badge, Card) get real Shadow DOM. Layout-ish/structural pieces avoid it to reduce SSR friction. (This is also the smaller-surface option for Developer Mode's "x-ray" overlay to reason about.)

### Showcase commitment — decided

A **React + Vue framework-interop demo** is included in the component showcase **from the start** (not bolted on later): the same actual custom element embedded live via a small Vue island and a small React island, side by side. This demonstrates portability rather than asserting it — the strongest possible answer to a skeptical visitor from either camp.

---

## 4. Developer Mode

Global toggle via a `data-dev-mode` attribute on `<html>`. Components themselves are aware of it and render an alternate "structural/x-ray" skin (boundaries, prop values, slot names) — built into component APIs, not a bolted-on overlay. This is itself evidence of clean component design, which is part of what's being demonstrated. Off by default; never shown to non-technical visitors unless they opt in.

---

## 5. AI workflows

**Constraint:** no Claude API key currently — no automated server-side AI calls.

Architecture: a generic **content workflow job** interface — `input: entry → output: draft entry/entries` — implemented per workflow. Translation is the first implementation; tagging/summarization/alt-text can be added later without redesigning the interface.

- **Now (manual/agent-triggered):** publish English draft → run a local agent (Claude Code or similar) that reads the entry and produces FR/PT-BR **draft** entries in Studio → review/edit each → publish independently. Never auto-publish a translation.
- **Later (if API access exists):** identical job logic, triggered by a webhook/CI step on publish instead of run by hand. Wiring change, not a redesign.

---

## 6. Claude-for-design workflow (repeatable loop)

1. **Once:** define tokens/principles (color, type, spacing, motion, tone) → Claude drafts the Design prompt → you run it once to establish the visual language.
2. **Per component:** Claude drafts a focused prompt referencing existing tokens → you run it → translate result into a Lit component spec → implement.
3. **Per page:** prompts reference *existing* components by name, not re-described visual language.
4. **Developer Mode / showcase:** its own design pass, done *after* base components are visually stable (avoid redesigning it every time a component changes).
5. **Ongoing:** repeat step 2/3 for new work; step 1 only revisited if the visual language itself evolves.

---

## 7. Working process (per "Building This With Claude")

- Plan before code — each feature gets a short reviewed spec before implementation.
- This file is the persistent memory — update it at the end of each session, not just at milestones.
- Small, reviewable increments; tests around non-visual logic (content queries, translation job, component prop contracts).
- Explicit, separate checklist items at each phase for: accessibility audit, SEO fundamentals, performance budget, privacy/cookie review — never assumed as side effects of "it works."

---

## 8. Known tensions (accepted, not fully resolved)

- WebGL richness vs. performance/accessibility → progressive enhancement only, respects `prefers-reduced-motion`, kept off content-heavy reading pages.
- Auto-translation vs. voice/quality → translations are reviewable drafts, never silent auto-publish.
- Developer Mode vs. simplicity for non-technical visitors → opt-in overlay, off by default.
- "On-the-fly, no redeploy" vs. Git-based CMS → Studio still triggers a rebuild via CI on publish; "no redeploy" means no manual git/deploy step *by you*, not literally zero rebuild time. Confirm this matches your expectation.

---

## 9. Open questions

**Resolved (2026-07-07, during Phase 0):**
- Git host for Studio integration — **GitHub**. Phase 0 only did a local `git init`; no remote created yet, but the README and future Studio OAuth setup (Phase 1) assume GitHub.
- Package manager — **pnpm**, confirmed (`pnpm@9.15.4`, pinned via `packageManager` in root `package.json`).
- Brand assets for the token-definition pass — **blank slate**, plus six explicit design influences supplied: Brutalism, *Alien* (1979) production design (watch for skeuomorphism), synthesizers (hardware), editorial magazine layout, Apple's Liquid Glass, *Tron: Legacy*. Folded into a self-contained Design Prompt — see `docs/design-prompt.md`. The prompt is drafted but **not yet run**; no token values exist anywhere in the repo yet.

**Resolved (2026-07-08, during Phase 1):**
- i18n routing — **subpath** (`/fr/`, `/pt-br/`), via `@nuxtjs/i18n`'s `prefix_except_default` strategy, `en` unprefixed.
- Nuxt Studio auth provider — **Google OAuth** for login (not GitHub OAuth); the Git provider (GitHub, for commits) stays independent of the auth provider — Studio supports this split natively via a separate GitHub PAT. See `docs/studio-setup.md`.

---

## 10. Phased plan

**Phase 0 — Foundations** ✅ *Done 2026-07-07*
Repo set up as a pnpm workspace (`apps/site` — Nuxt 4 — + `packages/design-system` — Lit, scaffolding only, no components yet). Nuxt Content v3 collection schemas defined for the Entry/kind model (`apps/site/content.config.ts`): four `page`-type collections (project/post/note/log) sharing a base schema, verified end-to-end against seed content (defaults, `cover`/`alt` structure, kind-specific fields all confirmed working). Baseline a11y/perf/SEO/privacy conventions doc (`docs/conventions.md`). Design-principles brief + the Design Prompt drafted (`docs/design-prompt.md`, §6 step 1) — **not yet run**; no token values exist yet, that's Phase 2. `reading time` (post) and the `note` kind's "no ToC/hero" are treated as rendering concerns, not schema fields — deferred to whichever Phase 1+ work renders these pages. One environment note: Node 20 is now EOL and has no prebuilt native binary for `better-sqlite3` (Nuxt Content's SQLite driver) — the workspace now requires **Node ≥22** (switched to the already-installed 22.19.0 via nvm during setup).

**Phase 1 — Core site shell + content pipeline** ✅ *Done 2026-07-08*
GitHub remote created (`joaodallarosa/joaodallarosa.dev`, public) and pushed. `@nuxtjs/i18n` installed with subpath routing (`prefix_except_default`, en/fr/pt-BR) — chrome-only translated strings (nav labels, language switcher) in `apps/site/i18n/locales/`; content-body translation is still Phase 6. Base app shell: `apps/site/app/layouts/default.vue` (header nav + language switcher + footer), flat homepage feed (`pages/index.vue`, published entries only, optional `?kind=` filter — matches §2's "flat nav, tags/kind badges drive filtering"), and a catch-all detail route (`pages/[...slug].vue`) that resolves an entry across all four collections regardless of status (so draft links stay previewable before publish) and dispatches to a per-kind template component under `app/components/entry/` (`ProjectEntry`/`PostEntry`/`NoteEntry`/`LogEntry`, each typed against `@nuxt/content`'s generated `*CollectionItem` types rather than hand-rolled shapes). All markup is plain unstyled semantic HTML — no design-system components consumed yet, no visual design applied (Phase 2). `nuxt-studio` (v1.7.0, self-hosted OSS, verified current as of this phase) installed and configured (`studio.repository` → GitHub, `studio` route `/_studio`); auth is Google OAuth per the resolved open question above. Verified `/_studio` correctly responds "no authentication provider found" (expected — the module works, credentials are the missing manual piece). **Deferred, requires Joao's own accounts (documented in `docs/studio-setup.md`):** creating the Google OAuth client and the GitHub PAT, setting the four `NUXT_STUDIO_*` env vars locally and in Vercel. Actual Vercel project creation/deployment is also out of scope for this phase — Studio's SSR requirement is just flagged as a constraint for whenever that happens.

**Phase 2 — Design system v0** ✅ *Done 2026-07-08*
Design Prompt (§6 step 1) run; output + rationale preserved in `docs/design-prompt.md`, values transcribed into `packages/design-system/src/tokens/tokens.css` (color/type/spacing/motion/tone, dark-mode-first with a `[data-color-scheme='light']` override, `prefers-reduced-motion` handling). Four leaf components shipped in Lit — `ds-button`, `ds-tag`, `ds-badge`, `ds-card` — each with real Shadow DOM and a shared Developer Mode x-ray skin (`packages/design-system/src/utils/xray.ts`, toggled by `data-dev-mode` presence via `:host-context()`, no per-component JS). `apps/site` consumes the package: `vue.compilerOptions.isCustomElement` matches `ds-*`, tokens/hydration CSS loaded globally via `nuxt.config.ts`, custom elements registered client-side only (`app/plugins/design-system.client.ts`). Component showcase page live at `/showcase` (linked from the site footer), consuming the real components with a working Dev Mode toggle. **React+Vue interop demo included**: the identical `ds-button` custom element mounted from a Vue island (plain template usage) and a React 19 island (`app/components/showcase/ReactButtonIsland.vue`, `react-dom/client` `createRoot`) side by side — verified in a real browser (Playwright) that both render pixel-identically and expose the same x-ray label, with zero console errors. Font loading (self-hosting Fraunces/JetBrains Mono, currently falling back to Georgia/monospace) is **deferred**, not part of Phase 2's scope (token *values* vs. asset delivery are separate concerns).

**Phase 3 — Developer Mode** ✅ *Done 2026-07-08*
A single persisted `useDevMode()` composable (`apps/site/app/composables/useDevMode.ts`, backed by `useState` + `localStorage`) drives the `data-dev-mode` attribute on `<html>` — replacing the showcase page's local-only toggle so the setting is shared and survives navigation/reload. A `devmode.client.ts` plugin restores it from `localStorage` on load. A footer toggle (`apps/site/app/layouts/default.vue`, i18n'd via `devMode.*` keys in all three locales) makes it available site-wide, not just on `/showcase`. Site chrome (header, both nav landmarks, main, footer) now carries the same dashed-outline + monospace corner-tag x-ray skin as the Phase 2 leaf components — a plain-CSS re-implementation of `packages/design-system/src/utils/xray.ts`'s visual grammar (chrome is outside any Shadow Root, so it can't literally share the Lit CSS, see `PROJECT.md` §3) using the same `--devmode-*` tokens, so it reads as one system rather than stopping at the package boundary. The one wrinkle: the footer toggle's label text needed `<ClientOnly>` — the persisted preference lives in `localStorage`, unavailable during SSR, so rendering it eagerly caused a Vue hydration text mismatch when dev mode was already on; verified via a real headless-browser run (toggle syncs between footer and showcase, persists across reload, x-ray labels render correctly, zero console warnings/errors) before landing the fix.

**Phase 4 — Visual redesign + Storybook reference** ✅ *Done 2026-07-08*

Triggered by feedback on Phase 2/3's output: the token *values* in `docs/design-prompt.md` were well-reasoned, but they only ever reached bare semantic HTML (`h1`/`p`/links) on the real pages (homepage, entry templates) — no grid structure, framing devices, or motion — so the site reads as generic dark-mode-plus-one-accent rather than expressing the intended references. Separately, `/showcase` (Phase 2) was a flat page of live demos, not the organized, spec'd reference tool actually wanted. Two workstreams:

- **A. Visual redesign** — grounded in ten concrete image references Joao provided (agency/brand/editorial sites, not the original text-only brief), analyzed and resolved in `docs/design-layout-references.md`. Key call: "bold" means layout/composition (bleed, violent scale contrast, asymmetric collage, full-bleed edges), not color — the Phase 2 palette stays unchanged. Resolved scope: the bold treatment applies to the site's **shell** (homepage, nav, hero/section-divider moments); long-form post/log reading content stays in the existing calmer editorial register. Exposed-grid/annotation/index-number language (seen in several references) stays exclusive to Developer Mode, not the default page. Bleed/cropping is literal (type can run past the viewport edge), which needs deliberate mobile treatment, not just scaled-down clipping. Foundation work: a fluid display/hero type scale (`--font-size-display`, `--font-size-hero`) and a `--content-max-width` token added to `packages/design-system/src/tokens/tokens.css`. A first in-repo homepage draft (bleeding wordmark, ticker, mismatched-span tile grid) was built, screenshotted, and **rejected** by Joao as reading like a generic "brutalist template" — reverted rather than committed. Per `docs/homepage-redesign-brief.md`'s handoff (see `feedback_external_design_tool_handoff` in the assistant's memory), Joao ran that brief through Google Stitch and brought back a concrete "Evolved Liquid Obsidian" direction — see the addenda in `docs/design-prompt.md` and `docs/design-layout-references.md` for exactly what that revised (palette/type unchanged; Liquid Glass now also used for persistent panels, not just transient overlays; a curated content-annotation device — object/figure labels — adopted into the default design distinct from Developer Mode's x-ray overlay; top header nav replaced by a vertical rail).

**Shipped 2026-07-08:** that direction implemented and verified live (desktop + mobile screenshots, zero console errors) — `apps/site/app/layouts/default.vue` now has a fixed vertical nav rail (brand, kind filters, language switcher, Dev Mode toggle; collapses to a two-row horizontal bar below 640px, since rotated text isn't legible at that width) replacing the old top header; `apps/site/app/pages/index.vue` has a bled two-line wordmark with a faint oversized watermark behind it, a glass data panel (bio + kind-filter links), a live status readout (locale/entry count/dev-mode state), a marquee ticker, and an "Archive Log" entry feed that alternates width/alignment per entry (not a uniform grid) with two card treatments — annotated image frames (`OBJ_NN`/`FIG. X` tags) for entries with a cover image, a glass panel with a giant faint index numeral for entries without one. New `--glass-*` tokens in `tokens.css` back the persistent glass panels. One real bug surfaced and fixed during verification: the classic "100vw / negative-margin" full-bleed trick assumes its ancestor is centered on the true viewport, which breaks once a fixed-width rail makes the layout asymmetric — `.site-body` also wasn't actually filling the remaining flex width (it was shrink-wrapping to `main`'s max-width), which compounded the miscalculation into real off-screen content clipping. Fixed by giving `.site-body` `flex: 1 1 auto` and deriving the bleed width/margin from explicit CSS custom properties instead of a bare viewport-relative percentage.

**Reading-page QA (closed out 2026-07-08):** all four entry templates (`ProjectEntry`/`PostEntry`/`NoteEntry`/`LogEntry`) verified live under the new rail at desktop and mobile (Playwright, real headless-browser screenshots), zero console errors beyond pre-existing missing placeholder seed images (unrelated). This surfaced a real bug, not just a "should still render fine" assumption: the mobile two-row bar kept the desktop rail's `position: fixed`, and `.site-body` only zeroed `margin-left` (for the now-absent left offset) with nothing accounting for the bar's own height — so page content rendered underneath it, clipping the first line or two. Fixed in `apps/site/app/layouts/default.vue`'s `@media (max-width: 640px)` block: the rail switches to `position: sticky` and `.site` switches to `flex-direction: column` at that breakpoint, so the bar occupies real flow space above `.site-body` instead of overlaying it. Rolling further "shell bold" treatment beyond the homepage is deferred to whenever Joao wants more of it — not blocking.

- **B. Component showcase → Storybook — shipped.** The custom `/showcase` page's generic Button/Tag/Badge/Card demo rows are gone; Storybook (`packages/design-system`, `pnpm --filter design-system storybook`, port 6006) is now the actual reference tool: a **Foundations** section (`src/foundations/*.mdx` — Colors, Typography, Spacing, Motion, each with live token-driven swatches/samples, not just prose) plus a **Components** section with one autodocs page per component (`src/components/*.stories.ts`), props/controls generated from each Lit component's own TypeScript source via `@custom-elements-manifest/analyzer` (`--litelement` flag — a built-in CLI flag, not a separate npm package as the plan draft assumed). The predicted integration friction was real and got the predicted fix: the analyzer's default globs also pick up compiled `dist/*.js` output and re-declare every component a second time with weaker (untyped, `dist`-derived) data, so `pnpm run analyze` restricts it to `--globs "src/components/**/*.ts"` — one clean declaration per tag, no dedupe transform needed on the Storybook side. One additional attribute-level touch-up story-side, not analyzer-side: `ds-button`'s `type` union (`'button' | 'submit' | 'reset'`) rendered as a raw JSON editor by default, so `button.stories.ts` sets an explicit `control: 'radio'` for it — small, per-property curation, not a systemic fix. Storybook's own chrome is themed from the real tokens (`.storybook/theme.ts`, dark bg/amber accent/mono font — not the generic default purple), and two toolbar globals (`.storybook/preview.ts`) let you exercise the two real runtime axes live in the docs: color scheme (dark/light) and Developer Mode's x-ray skin — verified in a real browser that toggling "Dev Mode: On" renders the exact same dashed-outline/corner-tag skin as the live site, and that the light-scheme toggle actually flips `data-color-scheme` on the preview iframe (confirmed via the story canvas view; the docs-page embedded preview lagged visually on the same toggle in one check, a minor embedded-iframe refresh quirk, not a token or decorator bug — not chased further). One MDX-specific gotcha hit and fixed: a plain Markdown table (`| Token | Value |...`) in `Typography.mdx` rendered as literal pipe-separated text instead of an HTML table — this MDX pipeline doesn't enable GFM table support by default — replaced with a raw HTML `<table>`, which MDX always renders regardless of Markdown extensions.

  The React+Vue framework-interop demo (Phase 2's "Showcase commitment") is deliberately **not** folded into Storybook — Storybook can't natively show "the same custom element mounted live from two different frameworks in one real page," since a Storybook renderer is single-framework. `/showcase` now exists solely for that demo (retitled "Framework interop demo" in both the page and the footer link) — verified live, zero console errors, both islands render pixel-identical `ds-button`s. Storybook itself is **not yet deployed** publicly (matches Phase 1's "actual Vercel deployment is out of scope" note) — `pnpm run build-storybook` produces a static `storybook-static/` build for whenever that gets wired up; for now it's a local-dev-only reference tool, documented in `packages/design-system/README.md`.

**Phase 5 — Creative coding / WebGL layer**
Restrained, progressive-enhancement interactions with explicit performance budgets defined up front.

**Phase 6 — AI translation workflow v1**
Manual/agent-triggered job per §5, integrated with Studio's draft flow.

**Phase 7 — Quality hardening**
Accessibility audit, SEO fundamentals check, performance budget verification, privacy/cookie review (confirm cookieless analytics wiring) — before calling anything "launched."

**Phase 8 — Ongoing**
Content and design-system iteration; extend AI workflows (tagging, summarization, alt-text); automate translation if/when API access becomes available; revisit design-system repo split if the workspace outgrows it.