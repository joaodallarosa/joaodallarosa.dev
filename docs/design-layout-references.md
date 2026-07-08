# Design layout references (Phase 4, workstream A)

**Status: references reviewed and decisions resolved 2026-07-08; page-by-page recomposition not yet built.** This doc does not replace `docs/design-prompt.md` — Phase 2's color/type/spacing/motion/tone tokens stay as-is (see Decision 4 below). What Phase 2 never addressed is *layout and composition*: it applied tokens to bare, safely-contained semantic HTML, which is why the real pages (not the isolated `/showcase` demos) read as generic dark-mode-plus-one-accent rather than expressing the site's stated influences. This doc closes that gap.

## Why this doc exists

Joao provided ten concrete image references (agency portfolios, brand case studies, editorial/fashion sites — not sci-fi/magazine stills this time, but the same underlying instruction: **bold means layout and structure, not "bold font weight" and not color**). The brief: match the compositional confidence of these references, stop looking like a generic AI-generated page.

## Structural patterns extracted (ranked by how often they recur across the ten references)

1. **Type/graphics bleed past the frame and get cropped, not contained.** A wordmark sliced by the left edge, a headline cropped mid-letterform across two lines, a logo that dwarfs its own canvas. Nothing is sized to comfortably fit inside a padded box.
2. **Violent scale contrast with no middle step.** A massive headline or graphic paired with genuinely tiny utility text (a repeated micro contact block, a 3-icon annotation strip, a small numbered list) — hierarchy jumps, it doesn't step gradually the way a typical type scale does.
3. **The grid itself rendered as decoration** — hairline rules slicing the canvas into exact rectangles, crosshair registration marks, small labels annotating parts of the design, dashed schematic construction lines. Brutalism's "show the seams," literally drawn as marks.
4. **Asymmetric collage, not a centered hero.** Elements overlap and interrupt each other at odd angles (two tilted overlapping "pages," a glitch pattern colliding with a 3D object and type, an uneven moodboard grid of mismatched tile sizes) instead of stacking politely in a single column.
5. **Repeating marquee/ticker text used as texture**, not just message (a rotated repeating ribbon banner, a rotating circular seal of repeated words).
6. **Full-bleed content touching the viewport edge**, sections separated only by hairline rules — no "container with breathing-room margin" feel.

## Decisions (resolved with Joao, 2026-07-08)

| Question | Decision | Why it matters |
|---|---|---|
| Should pattern #3 (exposed grid/annotation/index-number language) become the site's default, always-on look? | **No — stays exclusive to Developer Mode.** Normal pages stay calmer; the opt-in x-ray skin (`PROJECT.md` §4) remains the one place this language lives, now with more precedent for what it should look like. | Keeps the general-reader promise in `PROJECT.md` §1 ("should never feel like they wandered into a dev tool") intact. Patterns #1, #2, #4, #5, #6 are NOT scoped to Dev Mode — they're fair game for the default design; only the literal exposed-grid/annotation/index-number device is reserved. |
| How literal should bleed/cropping (#1) be? | **Literal** — type and graphics can genuinely run past the viewport edge and get clipped, matching the references directly. | Needs real care on mobile: a headline that bleeds dramatically on a wide desktop viewport needs a distinct, deliberately-designed mobile treatment, not just the same rule scaled down until it clips something load-bearing (a word becoming unreadable, a critical nav item disappearing). |
| Does the bold treatment apply everywhere, or mainly to the site's shell? | **Shell bold, reading calm.** Homepage, nav, section/entry-list hero moments get the full treatment (bleed, scale contrast, collage). Post/log article bodies stay in the existing calmer editorial register — this is the same "editorial rhythm vs. synth-panel precision" split `docs/design-prompt.md` already drew for spacing, just extended to layout/composition. | Protects long-form readability (the woodworking-post reader) while still letting the shell (what a recruiter or a skimming visitor sees first) carry the bold structural language the references show. |
| Is the Phase 2 color palette also up for revisit? | **No — kept as-is.** Phosphor amber on warm near-black stays; only layout/structure/type-scale changes. | The references span wildly different palettes (neon lime, red, sepia, orange-gradient) precisely *because* the lesson here is about structure, not color — confirmed explicitly rather than assumed. |

## Design-system changes made in this pass

- `packages/design-system/src/tokens/tokens.css`: added a fluid, viewport-scaled **display/hero type scale** (`--font-size-display`, `--font-size-hero`) sized for shell/hero contexts where bleed and violent scale contrast apply — explicitly documented in the token file as off-limits for long-form reading body text.
- Added `--content-max-width` (extracted from the previously hardcoded `64rem` in `apps/site/app/layouts/default.vue`) so the "constrained reading column" and "full-bleed shell section" can both be expressed and overridden deliberately, instead of every element inheriting the same fixed container by default.

## What this doc does not cover yet

Actual page recomposition — the homepage hero, nav treatment, entry-list layout, and how collage/bleed/marquee patterns get built as real Vue/Lit markup. Per the lesson from Phase 2/3 (a single prompt-and-transcribe pass isn't enough to avoid landing generic again), the next step is a **first concrete homepage draft, reviewed as a real screenshot before rolling the treatment out further** — not a full site rebuild in one pass.

## Addendum: "Evolved Liquid Obsidian" (Phase 4, 2026-07-08)

The first concrete draft (built directly from this doc, no external tool) was reviewed and rejected — see `PROJECT.md` Phase 4 and `docs/homepage-redesign-brief.md` for what was tried and why it read as generic. Joao then ran that brief through Google Stitch and brought back a real direction. Two updates to the decisions above, both narrowing rather than reversing the original calls:

| Question | Revised decision | Why |
|---|---|---|
| Does pattern #3 (exposed grid/annotation/index-number language) really stay 100% exclusive to Developer Mode? | **Split into two distinct things.** A small, curated, always-the-same-set of **content annotations** — a figure label, an object index (`OBJ_01`), a status readout (`SYS.STATUS: ONLINE`) — is now part of the *default* visual language, treating images/panels as labeled data objects. The **Developer Mode x-ray overlay** (exhaustive structural exposure — every element outlined, prop values, slot names, layout landmarks) stays exactly as exclusive as originally decided. | The Stitch direction leans on this device heavily and it reads as intentional editorial art-direction, not a debug view — the distinction is "a few authored labels" vs. "an exhaustive live dump of internals," not presence-vs-absence of annotation as a device. |
| Is the site's nav shell up for structural revisit, not just the homepage content? | **Yes — replaces the top header nav with a fixed vertical rail** (brand mark, kind filters, language switcher, Dev Mode toggle), consistent with "shell bold" already covering nav. Needs its own deliberate mobile treatment (collapses to a compact horizontal bar below the same breakpoint used elsewhere), not a scaled-down vertical rail. | Matches the "panel-based, custom-interface" structural logic in the Stitch output and gives the bold treatment a persistent home across every page, not just the homepage hero moment. |

Color palette and Liquid Glass scope changes are covered in `docs/design-prompt.md`'s addendum, not repeated here.
