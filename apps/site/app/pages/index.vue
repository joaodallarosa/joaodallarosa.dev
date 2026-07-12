<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  description: 'Personal publication and working lab — projects, notes, and logs from Joao Dallarosa.',
})

const baseBrandRatio = 4 / 1

const featuredBrand = { name: 'Valtech', src: '/images/brands/valtech.svg', ratio: baseBrandRatio }

const shippedForBrands = [
  { name: 'Louis Vuitton', src: '/images/brands/louis-vuitton.png', ratio: 8 / 1 },
  { name: 'L’Oréal', src: '/images/brands/loreal.svg', ratio: baseBrandRatio },
  { name: 'Lancôme', src: '/images/brands/lancome.svg', ratio: baseBrandRatio },
  { name: 'Redken', src: '/images/brands/redken.svg', ratio: baseBrandRatio },
  { name: 'Giorgio Armani', src: '/images/brands/giorgio-armani.svg', ratio: 7 / 1 },
  { name: 'Yves Saint Laurent', src: '/images/brands/ysl.svg', ratio: baseBrandRatio },
  { name: 'Garnier', src: '/images/brands/garnier.svg', ratio: baseBrandRatio },
  { name: 'Maybelline', src: '/images/brands/maybelline.svg', ratio: baseBrandRatio },
  { name: 'La Roche-Posay', src: '/images/brands/la-roche-posay.svg', ratio: baseBrandRatio },
]

const techStack = [
  { name: 'JavaScript', src: '/images/tech/javascript.svg', ratio: 1 },
  { name: 'TypeScript', src: '/images/tech/typescript.svg', ratio: 1 },
  { name: 'Vue.js', src: '/images/tech/vuedotjs.svg', ratio: 1 },
  { name: 'Nuxt', src: '/images/tech/nuxtdotjs.svg', ratio: 1 },
  { name: 'Node.js', src: '/images/tech/nodedotjs.svg', ratio: 1 },
  { name: 'Vite', src: '/images/tech/vite.svg', ratio: 1 },
  { name: 'Storybook', src: '/images/tech/storybook.svg', ratio: 1 },
  { name: 'Git', src: '/images/tech/git.svg', ratio: 1 },
  { name: 'Figma', src: '/images/tech/figma.svg', ratio: 1 },
  { name: 'GitHub Copilot', src: '/images/tech/githubcopilot.svg', ratio: 1 },
  { name: 'Claude', src: '/images/tech/claude.svg', ratio: 1 },
  { name: 'Tailwind CSS', src: '/images/tech/tailwindcss.svg', ratio: 1 },
]
</script>

<template>
  <div class="contents">
    <FlowFieldBackground />

    <section class="relative flex flex-1 flex-col justify-between gap-9 overflow-hidden px-6 pb-8 pt-2 mt-5">
      <h1 class="flex shrink-0 flex-col font-display-gothic">
        <span class="block text-xl leading-[0.8em]">JOÃO</span>
        <span class="block text-xl text-accent leading-[0.8em]">DALLA</span>
        <span class="block text-xl text-accent leading-[0.8em]">ROSA<span
          class="ml-[0.15em] align-baseline text-[0.55em]"
          aria-hidden="true"
        >†</span></span>
      </h1>

      <div class="flex flex-col sm:flex-row sm:justify-end">
        <div class="relative rounded-xs border border-glass-border-accent bg-glass-bg p-6 backdrop-blur-xl before:absolute before:-top-px before:-right-px before:h-3 before:w-3 before:border-t-2 before:border-r-2 before:border-accent before:opacity-80 before:content-[''] after:absolute after:-bottom-px after:-left-px after:h-3 after:w-3 after:border-b-2 after:border-l-2 after:border-accent after:opacity-80 after:content-[''] sm:max-w-[50vw]">
          <div class="mb-4 flex items-center gap-4">
            <p class="m-0 border-r border-r-glass-border pr-4 font-mono text-base uppercase tracking-[0.15em] text-text-muted">
              {{ t('home.role') }}
            </p>
            <span
              class="mask-(--logo-src) mask-center mask-contain mask-no-repeat inline-block h-[1.2rem] w-auto shrink-0 bg-text [-webkit-mask-image:var(--logo-src)] [-webkit-mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat]"
              role="img"
              :aria-label="featuredBrand.name"
              :style="{ '--logo-src': `url(${featuredBrand.src})`, 'aspect-ratio': featuredBrand.ratio }"
            />
          </div>

          <p class="mb-5 font-mono text-base font-light leading-reading text-text">
            {{ t('home.intro') }}
          </p>

          <div class="border-t border-t-glass-border pt-4">
            <p class="mb-3 font-mono text-base uppercase tracking-[0.15em] text-text-muted">
              {{ t('home.shippedFor') }}
            </p>
            <LogoCarousel :items="shippedForBrands" />
          </div>

          <div class="mt-4">
            <p class="mb-3 font-mono text-base uppercase tracking-[0.15em] text-text-muted">
              {{ t('home.techIUse') }}
            </p>
            <LogoCarousel :items="techStack" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
