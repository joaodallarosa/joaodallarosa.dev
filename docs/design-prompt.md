# Design prompt (§6 step 1: define tokens/principles → draft the Design prompt → run it once)

**Status: run 2026-07-08.** Output transcribed into `packages/design-system/src/tokens/tokens.css`. Rationale per dimension, the resolved color/type/spacing/motion/tone values, and the explicit tension resolution (matte-by-default, glass reserved for overlays) are preserved below for reference — this is the record of *why* the tokens are what they are, not just the prompt that produced them.

## Framing

The prompt below is self-contained on purpose — it doesn't require also having `PROJECT.md` open to make sense, so it stays portable if copied into another session or tool. It links back to `PROJECT.md` §1 (voice, three audiences) and §4 (Developer Mode's x-ray skin needs to hold up as its own state, not read as a bolt-on debug view).

The six design influences embedded in the prompt came directly from the project owner, not from inference — see the "Design Influences" section inside the prompt itself.

## The Design Prompt

Copy-paste this and run it wherever you intend (another Claude session, a design tool, whatever) to produce concrete values.

```
You are establishing the visual design language for a personal site + in-repo Lit design system. Read the brief below, then propose a concrete, cohesive first-pass design token system.

CONTEXT
Not a portfolio — a personal publication with a working lab attached. Showcases dev
projects, creative coding, and completely non-technical work (a recipe, a repair, a
woodworking build) under one voice: creative, technical, design-literate, playful but
credible, never gimmicky.

Three audiences read this site, and the design has to work for all three without
compromise:
- Recruiters/hiring managers skimming for a quick credibility signal.
- Developers/designers who want to see how you think, not just outputs.
- General readers arriving at a single non-technical post via a shared link — they
  should never be made to feel like they wandered into a dev tool.

There's no existing brand — no logo, no legacy palette, no constraint to react to.
Blank slate, except for the influences below.

The site has a "Developer Mode" — an opt-in x-ray overlay revealing component
structure/props/slots — so the design language needs to hold up in two states
(normal + x-ray) without the x-ray state feeling like a bolt-on debug skin.

DESIGN INFLUENCES
Influences, not a mood board to copy literally — extract underlying principles, not
surface skins:
- Brutalism — raw, honest structure; show the seams rather than hide them. A strong
  candidate for how Developer Mode's x-ray overlay should *feel*, not just look.
- Alien, 1979 (production design) — analog-terminal utilitarianism: phosphor
  monochrome readouts, dot-matrix/monospace labeling, warning-stripe accent use. Take
  the mood and palette logic, not the literal hardware — avoid skeuomorphic switches,
  bezels, or textures (explicit instruction from the brief owner: be careful here).
- Synthesizers (hardware) — a technical instrument that's unapologetically tactile and
  expressive: panel-like layouts, precisely labeled controls, confident color-coding.
  A serious tool, not a boring one.
- Editorial magazine layout — reference: https://cdn.dribbble.com/userupload/35110582/file/large-03d8135840726b428a9fe651534d8f72.mp4
  — confident type hierarchy, structured grid, generous whitespace, print-derived
  rhythm. Directly reinforces "personal publication," not portfolio.
- Apple's Liquid Glass — translucency, depth, refraction, continuous fluid motion.
- Tron: Legacy — high-contrast dark base, thin glowing linework, duotone neon
  accents, grid-as-environment.

There's a real tension in this list: Brutalism / Alien / synthesizers pull toward
raw, honest, matte, physical. Liquid Glass pulls toward polished, translucent,
depth-layered. Don't silently pick a side — state explicitly where each register
wins (for example: a raw/matte structural base with glass-like depth reserved for
specific moments such as overlays or transitions — or a different resolution
entirely) and justify the call.

WHAT TO PROPOSE
Provide concrete values, not just direction, for each of the following:

1. COLOR — a full palette: base neutrals (avoid pure #000/#fff), one confident
   accent, and enough range for state (hover/focus/disabled) and semantic use
   (draft/published status, kind badges for project/post/note/log). Assume
   dark-mode-first (developer-tool-adjacent audience) but specify light mode too.
   Tron's high-contrast dark base + neon duotone accent and Alien's
   phosphor-monochrome terminal palette are candidate directions to react to, blend,
   or deliberately reject. Give actual hex values.
2. TYPE — a pairing: one face for long-form reading (post/note bodies) and one for
   technical/structural contexts (code, Developer Mode overlays, UI labels).
   Editorial magazine layout argues for confident, large-scale headline type;
   Alien's terminal readouts argue for a monospace/grotesk technical face — could be
   the same family in different weights if that's the stronger choice, argue for
   whichever you pick. Give a type scale (actual rem values) and line-height/weight
   pairings.
3. SPACING — a modular scale (actual rem/px values) serving two registers: editorial
   rhythm (generous, print-like, for long-form reading) and synthesizer-panel
   precision (tight, labeled, grid-locked, for leaf-component UI) — one coherent
   scale, not two unrelated systems.
4. MOTION — duration/easing tokens for micro-interactions. Resolve in motion the
   same tension named above: Liquid Glass's continuous, physically-fluid motion vs.
   a more restrained, mechanical/technical register (synth switches, Tron's precise
   geometry). Pick a register — or a deliberate, justified split by context — and
   keep it scoped to micro-interactions (this is a content-heavy site, not a WebGL
   showcase — that's a separate, later, progressive-enhancement layer). State how
   these tokens degrade under `prefers-reduced-motion`.
5. TONE → UI translation — take "playful but credible, never gimmicky" (a
   synthesizer is the model here: a serious instrument that's still fun) and
   translate it into concrete interface-writing/microcopy guidance (button labels,
   empty states, error messages) and one or two concrete "do this / not that"
   examples.

CONSTRAINTS
- Must read as credible to a recruiter skimming in 10 seconds AND hold personality
  for a woodworking post. Don't design two visual languages — one system, flexible
  enough to flex tone by content kind without looking inconsistent.
- Leaf components (Button, Tag, Card, Badge) get real Shadow DOM — palette/type/
  spacing choices should work as CSS custom properties crossing that boundary cleanly.
- Optimize for "impressive, well-reasoned, maintainable by one person" — not a
  scalable enterprise design system. Prefer a small, well-argued set of tokens over
  an exhaustive one.
- Any translucency/blur direction taken from Liquid Glass must come with an explicit
  performance note (backdrop-filter is not free) — see docs/conventions.md.

OUTPUT FORMAT
A short rationale paragraph per dimension, followed by the concrete token values in
a form ready to transcribe into CSS custom properties / TS constants.
```

## Output (run 2026-07-08)

**Color.** Warm-tinted near-black neutrals (never pure black/white) — warmth reads as "instrument," not "screen," and fits Alien/synthesizers better than Tron's cold blue-black. One confident accent — phosphor amber (`#ffb000`) — chosen over cyan for its direct *Alien* CRT/warning-stripe lineage and because it sits better against warm neutrals. Four desaturated kind-badge hues (project/post/note/log) are a separate palette from the accent so badges never compete with it. Status (draft/published) uses a third, independent scheme — status must read at a glance regardless of kind.

**Type.** Two families, not one: **Fraunces** (variable, editorial, used for both headlines and long-form body at different weights/optical sizes) and **JetBrains Mono** (code, Developer Mode overlays, UI labels). A single family risked flattening the intended editorial-vs-terminal tension.

**Spacing.** One 4px-based scale (`--space-1` … `--space-10`), not two systems — small steps serve synth-panel precision, large steps serve editorial rhythm.

**Motion.** Two registers on one scale: mechanical/snap (`--motion-duration-fast`/`-base`, `cubic-bezier(0.2, 0, 0, 1)`) for everyday micro-interactions, fluid/glass-like (`--motion-duration-slow`, `cubic-bezier(0.16, 1, 0.3, 1)`) reserved for overlay/depth moments only. `prefers-reduced-motion` collapses all durations to ≤20ms and drops transforms.

**Tone.** "Playful but credible" = the synthesizer model: dry precision over cuteness. `Publish` / `Save draft`, not `Ship it! 🚀`.

**The stated tension, resolved explicitly:** raw/matte (Brutalism/Alien/synth) is the default surface treatment everywhere; Liquid Glass translucency is reserved for transient overlays only (modals, lightbox, command palette) — never persistent content surfaces, and always under the `backdrop-filter` perf note in `docs/conventions.md`. Developer Mode's x-ray skin is the fullest expression of the brutalist register, not a bolted-on debug view — see `packages/design-system/src/utils/xray.ts`.

Full hex/rem/token values: `packages/design-system/src/tokens/tokens.css` (source of truth — don't let this doc drift out of sync with it).

## Next step

Done — see Phase 2 in `PROJECT.md`. Any future revisit of the visual language itself (not just adding components) should update `tokens.css` first, then reflect the change here.
