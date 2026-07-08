# Homepage redesign brief (Phase 4, workstream A — handoff to external design tool)

**Status: an in-repo first attempt at the homepage was built and rejected 2026-07-08** (bleeding two-line wordmark, horizontal ticker strip, mismatched-span tile grid for the entry feed) — it did not land the reference direction. Rather than iterate blind in code again, this brief is meant to be copy-pasted into an external design tool (image model, Figma AI, another chat session, a human collaborator) to get a real visual direction before anything is implemented again. Bring the output back for implementation.

This doc is self-contained — it doesn't require also having `PROJECT.md`/`docs/design-prompt.md`/`docs/design-layout-references.md` open, though all three exist in-repo if more depth is needed.

---

## The prompt

```
You're art-directing the homepage of a personal website + in-repo web-component design
system. This is not a portfolio — it's a personal publication with a working lab
attached: dev projects, creative coding, and completely non-technical posts (a recipe,
a repair, a woodworking build) under one voice — creative, technical, design-literate,
playful but credible, never gimmicky.

THREE AUDIENCES, all must be served without compromise:
- Recruiters/hiring managers skimming for a quick credibility signal.
- Developers/designers who want to see how the owner thinks, not just outputs.
- General readers arriving at one non-technical post via a shared link — they should
  never feel like they wandered into a dev tool.

DESIGN LANGUAGE ALREADY LOCKED — do not change these, work within them:

Color (dark-mode-first, warm-tinted, never pure black/white):
- Background: #0b0c0d (near-black, warm-tinted)
- Raised surface: #131517
- Text: #eceeef, muted text: #868c91
- Border: #2a2e32
- The one confident accent — phosphor amber: #ffb000 (hover #ffc94d)
- Four desaturated kind-badge hues, deliberately not competing with the accent:
  project #6ea8d8 (blue), post #4fb6a6 (teal), note #9b8fd1 (violet), log #c97b5a
  (rust)
- Light mode exists (background #f6f7f7, text #131517-ish, accent darkens to #e69a00)
  but dark is the primary/default mode to design for.

Type:
- Fraunces (serif, variable) for headlines and long-form reading body, at different
  weights/optical sizes.
- JetBrains Mono for code, UI labels, and a "Developer Mode" technical overlay state.
- Existing scale: body sizes from 0.75rem up to 4rem, PLUS a newly added fluid
  display/hero scale for shell moments: --font-size-display: clamp(3rem, 1rem + 7vw,
  6rem), --font-size-hero: clamp(4rem, 1rem + 13vw, 11rem). These fluid sizes are
  reserved for shell/hero contexts only, never long-form reading body text.

Spacing: one 4px-based modular scale, 0.25rem up to 8rem (small steps for tight
UI/panel precision, large steps for editorial rhythm) — not two separate systems.

Motion: two registers — a snappy mechanical one (100-160ms, cubic-bezier(0.2,0,0,1))
for everyday micro-interactions, and a slower fluid one (320ms, cubic-bezier(0.16,1,
0.3,1)) reserved for overlay/depth moments only (never persistent content surfaces).
Reduced-motion users get near-zero durations and no transforms.

Tone: dry precision over cuteness — "Publish" / "Save draft," not "Ship it! 🚀."

ORIGINAL SIX DESIGN INFLUENCES (extract underlying principles, don't copy surface
skins): Brutalism (raw, honest structure — show the seams), Alien 1979 production
design (phosphor-monochrome terminal readouts, dot-matrix labeling, warning-stripe
accents — NOT literal skeuomorphic switches/bezels/hardware textures), hardware
synthesizers (panel-like layouts, precisely labeled controls, a serious instrument
that's still fun), editorial magazine layout (confident type hierarchy, structured
grid, print-derived rhythm), Apple's Liquid Glass (translucency/depth — resolved as
reserved for transient overlays only, never persistent surfaces — the base register
everywhere else is raw/matte), Tron: Legacy (high-contrast dark base, thin glowing
linework, grid-as-environment).

WHAT THE HOMEPAGE NEEDS TO ACTUALLY LOOK LIKE — this is the open problem:
A second round of ten concrete image references (agency portfolios, brand case
studies, editorial/fashion sites) was reviewed against the current site, which reads
as generic "dark-mode-plus-one-accent" — technically applying the tokens above but
with no real layout confidence. Structural patterns extracted from those references,
ranked by how often they recurred:
1. Type/graphics bleed past the frame and get cropped, not comfortably contained.
2. Violent scale contrast with no stepped middle size — a massive headline next to
   genuinely tiny utility text.
3. The grid itself rendered as decoration (hairline rules, crosshair marks,
   annotation labels, construction lines) — RESERVED EXCLUSIVELY for this site's
   opt-in "Developer Mode" x-ray overlay, must NOT appear in the default homepage
   design. Everything else in this list is fair game for the default design.
4. Asymmetric collage — elements overlapping/interrupting at odd angles, not a
   centered hero or a uniform card grid.
5. Repeating marquee/ticker text used as texture.
6. Full-bleed content touching the viewport edge, sections separated by hairline
   rules only.

DECISIONS ALREADY MADE — work within these:
- Bold means layout/composition, NOT color or font-weight. The locked palette above
  does not change.
- "Shell bold, reading calm": this treatment applies to the homepage, primary nav,
  and hero/section-divider moments only. Long-form post/log article bodies stay in
  a calmer, more conventional editorial register (not part of this brief).
- Bleed/cropping should be literal (real content can run past the viewport edge and
  get clipped) but needs a deliberately-designed mobile treatment — not just the
  desktop layout scaled down until something load-bearing (a word, a nav item)
  becomes unreadable or disappears.

WHAT WAS ALREADY TRIED AND REJECTED (avoid repeating this specific execution):
A first pass built a two-line serif wordmark ("joao" / "dallarosa") with the first
line bled off the left edge, a horizontal scrolling ticker strip below it, and the
entry feed laid out as a CSS grid with one large tile and three smaller ones of
mismatched spans. It technically hit patterns #1/#2/#4/#5/#6 but read as a generic
"trendy brutalist template" rather than something with real compositional intent —
the individual moves were present but didn't add up to a considered whole.

CONTENT THE HOMEPAGE ACTUALLY NEEDS TO DISPLAY (real constraints, not decoration):
- Site wordmark/title: "joaodallarosa.dev"
- A primary nav with 4 entry-kind filters (Projects / Posts / Notes / Log) and a
  3-language switcher (EN / FR / PT-BR) — currently plain text links, open to
  redesign as part of the shell.
- A feed of "entries," each with: a kind (project/post/note/log — has its own badge
  color per above), a title, optional tags, and a publish date. Currently 0-4 items
  exist (early-stage site) — the design must not fall apart or look broken with very
  few items, since that's the real near-term state.
- A footer with copyright and a "Component showcase" link.
This is a Vue/Nuxt SSR site — the homepage content itself (headings, entry list) must
stay real semantic HTML for SEO, not an opaque canvas/image.

DELIVERABLE
Give a genuinely considered homepage composition — hero/wordmark treatment, nav
treatment, and entry-feed layout — that earns the "bold, editorial-brutalist,
confident" description these references actually have, not just a checklist
application of patterns #1/#2/#4/#5/#6. Prefer a visual mockup (image or detailed
enough description of exact proportions/positions/type sizes) over abstract
direction. Call out explicitly how it degrades on a narrow mobile viewport.
```

---

## What to bring back

Whatever comes out of this — a mockup image, a Figma link, a written spec with concrete positions/sizes — bring it back for implementation. If it's an image, describing it precisely (regions, type sizes relative to the scale above, what bleeds/crops where, what happens at mobile width) is enough even without pasting the image itself.
