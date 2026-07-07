# Baseline conventions: accessibility, performance, SEO, privacy

Status: standards to hold future phases to — not an implementation. Nothing here is built yet; this is the checklist that later phases get checked against (per `PROJECT.md` §7: accessibility, SEO, performance, and privacy/cookie review are explicit, separate checklist items at each phase, never assumed as side effects of "it works").

## Accessibility

- WCAG 2.2 AA is the target level.
- Non-empty `alt` text is required on all media — enforced structurally in the content schema (`apps/site/content.config.ts`), not just documented here.
- Interactive components must be keyboard-operable with a visible focus state — checked per component starting Phase 2/3, not assumed from a design mockup.
- Respect `prefers-reduced-motion` for any animation or motion token (ties to `PROJECT.md` §8's WebGL/motion tension).
- Body content (headings, prose) stays plain semantic HTML, never inside a Shadow Root — keeps it directly accessible to assistive tech and crawlers (`PROJECT.md` §3).
- Developer Mode's x-ray overlay (`PROJECT.md` §4) is itself off by default and must not be the only way to inspect component structure for a screen-reader user — it's a sighted-developer aid, not an accessibility feature.

## Performance

- Core Web Vitals budgets (LCP/INP/CLS thresholds) get defined precisely once there's a real page to measure against — not invented speculatively now.
- Any future WebGL/creative-coding layer carries its own explicit JS budget and stays off content-heavy reading pages (`PROJECT.md` §8).
- Image optimization goes through `@nuxt/image` once real images exist (`PROJECT.md` §3's workaround for Nuxt Studio's media-optimization gap).
- Web Component hydration cost on content pages stays minimal — CSS-hidden `:not(:defined)` handling to avoid FOUC, not a blocking hydration step (`PROJECT.md` §3).
- If the eventual visual language adopts heavy translucency/blur (a candidate direction in [`docs/design-prompt.md`](./design-prompt.md), per the Liquid Glass influence), `backdrop-filter` cost gets measured on mid-tier devices before shipping it broadly — not assumed free.

## SEO

- Rely on Nuxt Content's `page`-type collection auto-fields (title, description, path, SEO metadata) rather than re-deriving them by hand.
- Sitemap, robots.txt, and canonical URLs are fundamentals to check once real routes exist.
- `hreflang` becomes relevant once i18n subpaths land (`PROJECT.md` §9, Phase 1+) — forward reference only, not built now.
- Structured data (schema.org) for `project` and `post` entries, once those templates exist.

## Privacy / cookies

- Analytics stays cookieless/privacy-first (`PROJECT.md` §3, decided) — this is what avoids needing a consent banner at all, rather than solving consent after the fact.
- Standing checklist item: every time a future third-party script or embed is added, re-verify the "no tracking cookies" claim still holds. Don't let it quietly become false (`PROJECT.md` §6 Phase 6, §8).
