<script setup lang="ts">
interface LogoItem {
  name: string
  src: string
  ratio: number
}

const props = defineProps<{
  items: LogoItem[]
  pinned?: LogoItem
}>()

const srLabel = computed(() => {
  const list = props.items.map(item => item.name).join(', ')
  return props.pinned ? `${props.pinned.name} — also: ${list}` : list
})
</script>

<template>
  <div class="group flex items-center gap-4">
    <span class="sr-only">{{ srLabel }}</span>
    <span
      v-if="pinned"
      class="mask-(--logo-src) mask-center mask-contain mask-no-repeat inline-block h-[26px] w-auto shrink-0 border-r border-r-glass-border bg-text pr-4 opacity-90 [-webkit-mask-image:var(--logo-src)] [-webkit-mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat]"
      aria-hidden="true"
      :style="{ '--logo-src': `url(${pinned.src})`, 'aspect-ratio': pinned.ratio }"
    />

    <div
      class="relative min-w-0 flex-1 overflow-hidden mask-[linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <div
        class="flex w-max animate-logo-scroll motion-reduce:animate-none group-hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        <div
          v-for="rep in 2"
          :key="rep"
          class="flex shrink-0 items-center gap-6 pr-6"
        >
          <span
            v-for="item in items"
            :key="`${rep}-${item.name}`"
            class="mask-(--logo-src) mask-center mask-contain mask-no-repeat inline-block h-[32px] w-auto shrink-0 bg-text-muted opacity-60 transition-opacity duration-(--motion-duration-base) ease-mechanical [-webkit-mask-image:var(--logo-src)] [-webkit-mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] group-hover:opacity-90"
            :style="{ '--logo-src': `url(${item.src})`, 'aspect-ratio': item.ratio }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
