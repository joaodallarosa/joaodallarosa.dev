<script setup lang="ts">
useSeoMeta({
  description: 'Personal publication and working lab — projects, posts, notes, and logs from Joao Dallarosa.',
})

const featuredBrand = { name: 'Valtech', src: '/images/brands/valtech.svg', ratio: 159 / 36 }

const shippedForBrands = [
  { name: 'Louis Vuitton', src: '/images/brands/louis-vuitton.png', ratio: 4610 / 590 },
  { name: 'L’Oréal', src: '/images/brands/loreal.svg', ratio: 800 / 144.748 },
  { name: 'Lancôme', src: '/images/brands/lancome.svg', ratio: 156.78157 / 37.101406 },
  { name: 'Redken', src: '/images/brands/redken.svg', ratio: 189.7150896 / 52.2279596 },
  { name: 'Giorgio Armani', src: '/images/brands/giorgio-armani.svg', ratio: 285.52 / 31.739 },
  { name: 'Yves Saint Laurent', src: '/images/brands/ysl.svg', ratio: 576.2217 / 120.1528 },
  { name: 'Garnier', src: '/images/brands/garnier.svg', ratio: 1962 / 470 },
  { name: 'Maybelline', src: '/images/brands/maybelline.svg', ratio: 241 / 53 },
  { name: 'La Roche-Posay', src: '/images/brands/la-roche-posay.svg', ratio: 283.84399 / 121.631 },
]

const techStack = [
  { name: 'JavaScript', src: '/images/tech/javascript.svg', ratio: 1 },
  { name: 'TypeScript', src: '/images/tech/typescript.svg', ratio: 1 },
  { name: 'Vue.js', src: '/images/tech/vuedotjs.svg', ratio: 1 },
  { name: 'Nuxt', src: '/images/tech/nuxtdotjs.svg', ratio: 1 },
  { name: 'Node.js', src: '/images/tech/nodedotjs.svg', ratio: 1 },
  { name: 'Vite', src: '/images/tech/vite.svg', ratio: 1 },
  { name: 'Lit', src: '/images/tech/lit.svg', ratio: 1 },
  { name: 'Storybook', src: '/images/tech/storybook.svg', ratio: 1 },
  { name: 'Git', src: '/images/tech/git.svg', ratio: 1 },
]
</script>

<template>
  <div class="home">
    <FlowFieldBackground />

    <section
      class="hero"
      data-devmode-label="home[hero]"
    >
      <p
        class="hero-watermark"
        aria-hidden="true"
      >
        LAB
      </p>

      <div class="hero-header">
        <h1 class="hero-mark">
          <span class="hero-mark-line">JOÃO</span>
          <span class="hero-mark-line hero-mark-line--accent">DALLA</span>
          <span class="hero-mark-line hero-mark-line--accent">ROSA<span
            class="hero-mark-ornament"
            aria-hidden="true"
          >†</span></span>
        </h1>

        <!-- Hidden for now, not removed — may bring this eyebrow tag back later. -->
        <div class="hero-top">
          <div class="glass-panel hero-eyebrow-panel">
            <p class="hero-eyebrow">
              Web Engineer / design system lab / other stuff
            </p>
          </div>
        </div>
      </div>

      <div class="hero-bottom">
        <div class="glass-panel hero-panel hero-resume">
          <div class="hero-resume-header">
            <span
              class="hero-resume-featured-logo"
              role="img"
              :aria-label="featuredBrand.name"
              :style="{ '--logo-src': `url(${featuredBrand.src})`, 'aspect-ratio': featuredBrand.ratio }"
            />
            <p class="hero-resume-role">
              Lead Frontend Engineer
            </p>
          </div>

          <p class="hero-panel-text">
            I help teams — of any size — ship production-grade web experiences,
            from a one-off animation to large-scale e-commerce.
          </p>

          <div class="hero-resume-brands">
            <p class="hero-resume-eyebrow">
              Shiped for
            </p>
            <LogoCarousel :items="shippedForBrands" />
          </div>

          <div class="hero-resume-tech">
            <p class="hero-resume-eyebrow">
              Tech I use
            </p>
            <LogoCarousel :items="techStack" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
}

/*
 * Full-bleed breakout (pattern #6): escapes <main>'s padded --content-max-width column to
 * touch the edges of .site-body (default.vue) — the true viewport minus the fixed nav rail's
 * width. The classic 100vw/-50vw breakout trick assumes margin-left's percentage resolves
 * against an ancestor that's exactly as wide as the true viewport; here the immediate
 * containing block (.home, sized to main's capped content-max-width) is narrower than that,
 * and site-body itself is offset by the rail, so the trick needs its own local variables
 * instead of a bare percentage to stay correct at every viewport width.
 */
.home {
  --site-body-width: calc(100vw - var(--space-9));
  --main-width: min(var(--content-max-width), var(--site-body-width));
  --main-inset: calc((var(--site-body-width) - var(--main-width)) / 2);
}

@media (max-width: 640px) {
  .home {
    --site-body-width: 100vw;
  }
}

/*
 * Hero fills the viewport and anchors its content to the top/bottom edges (pattern #7): the
 * flow field's Clifford-attractor field is centered on the canvas (see flow-field-sketch.ts),
 * so the vertical middle is where its swirling motion is most legible — content is pushed to
 * the corners instead of stacking straight down the center to leave that band open.
 */
.hero {
  width: var(--site-body-width);
  margin-left: calc(-1 * (var(--main-inset) + var(--space-6)));
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-9);
  min-height: calc(100vh - var(--space-8) * 2);
  padding: var(--space-2) var(--space-6) var(--space-8);
  overflow: hidden;
}

.hero-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  width: 100%;
}

/* Hidden for now (see template) — not removed, this eyebrow tag may come back later. */
.hero-top {
  display: none;
  max-width: 44rem;
}

.hero-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  /* Only the resume card lives here now (hero-meta was removed) — anchor it to the right
     instead of relying on space-between, which would collapse a lone child to the left. */
  justify-content: flex-end;
  gap: var(--space-6);
}

.hero-watermark {
  position: absolute;
  left: 4%;
  top: 50%;
  z-index: 0;
  margin: 0;
  font-family: var(--font-family-serif);
  font-size: 32vw;
  font-weight: var(--font-weight-display);
  line-height: 1;
  color: var(--color-text);
  opacity: 0.04;
  mix-blend-mode: overlay;
  writing-mode: vertical-rl;
  transform: translateY(-50%) rotate(180deg);
  pointer-events: none;
  user-select: none;
}

.hero-eyebrow-panel {
  display: inline-block;
  padding: var(--space-3) var(--space-4);
}

.hero-eyebrow {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-mono-em);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent);
}

/* Violent scale contrast (pattern #2): the wordmark sits well above the eyebrow/meta text's
   --font-size-xs — no stepped middle sizes bridging the two.
   Stacked JOÃO / DALLA / ROSA in the top-left corner, left-aligned, so the flow field's
   swirl stays open across the rest of the hero. */
.hero-mark {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  /* Oldenorth (see tokens.css) — a single static weight, no italic cut, so this rule
     deliberately doesn't set font-weight or font-style: the browser would otherwise fake a
     bolder/oblique version of a face that has neither. */
  font-family: var(--font-family-display-gothic);
  line-height: var(--line-height-headline);
  letter-spacing: -0.01em;
  text-align: left;
}

.hero-mark-line {
  display: block;
  font-size: var(--font-size-hero);
}

.hero-mark-line--accent {
  font-size: var(--font-size-hero);
  color: var(--color-accent);
}

/* Echoes the reference brief's small cross/dagger ornament — the typeface's own glyph, not an
   icon font, so it inherits Oldenorth's exact linework. */
.hero-mark-ornament {
  margin-left: 0.15em;
  font-size: 0.55em;
  vertical-align: baseline;
}

/*
 * Liquid glass data panel (Phase 4 addendum) — a persistent structural panel, not a transient
 * overlay; see docs/design-prompt.md's addendum for why that's now in-scope for --glass-*.
 * Shared by the hero panel and the eyebrow label so both corner/edge annotations read as the
 * same glass surface.
 */
.glass-panel {
  position: relative;
  z-index: 1;
  padding: var(--space-6);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border-accent);
  border-radius: 2px;
}

.glass-panel::before,
.glass-panel::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--color-accent);
  opacity: 0.8;
}

.glass-panel::before {
  top: -1px;
  right: -1px;
  border-top: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}

.glass-panel::after {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}

.hero-panel {
  max-width: 34rem;
}

.hero-panel-text {
  margin: 0 0 var(--space-5);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  font-weight: 300;
  line-height: var(--line-height-reading);
  color: var(--color-text);
}

.hero-resume-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.hero-resume-featured-logo {
  display: inline-block;
  flex-shrink: 0;
  width: auto;
  height: 30px;
  background-color: var(--color-text);
  /* Same currentColor-mask + real-aspect-ratio technique as LogoCarousel.vue's .brand-logo,
     so the featured Valtech mark and the rotating strips stay in sync across the light/dark
     toggle and none of them get squeezed into a fixed box. */
  -webkit-mask-image: var(--logo-src);
  mask-image: var(--logo-src);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.hero-resume-role {
  margin: 0;
  padding-left: var(--space-4);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-left: 1px solid var(--glass-border);
}

.hero-resume-brands {
  padding-top: var(--space-4);
  border-top: 1px solid var(--glass-border);
}

.hero-resume-tech {
  margin-top: var(--space-4);
}

.hero-resume-eyebrow {
  margin: 0 0 var(--space-3);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .hero {
    min-height: 0;
  }

  .hero-watermark {
    display: none;
  }

  .hero-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }

  .hero-bottom {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-6);
  }

  .hero-panel {
    max-width: none;
  }
}
</style>
