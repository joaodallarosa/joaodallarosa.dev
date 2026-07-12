<script setup lang="ts">
import { onBeforeUnmount, useId, useTemplateRef } from 'vue'
import { loadScriptOnce } from '~/utils/load-script'

// Ported from the standalone `no-linear-time` repo — a Blotter.js (WebGL text distortion)
// title, a particles.js background, and a click/space-triggered writing animation that spells
// out a random line from a personal set of team in-jokes. All three third-party libraries are
// legacy global (non-module, non-npm) scripts, copied as-is into public/projects/no-linear-time
// and loaded via injected <script> tags on first run (see loadScriptOnce) rather than bundled.
// Originally a fullscreen page reading window.innerWidth/innerHeight; adapted here to size
// off its own embed container instead.
declare global {
  interface Window {
    // No official types ship for this legacy vendored library — shaped to just what's used
    // below rather than `any`.
    Blotter: {
      new (material: unknown, options: { texts: unknown }): { forText: (text: unknown) => { appendTo: (el: HTMLElement) => void } }
      Text: new (text: string, options: { family: string, size: number, fill: string }) => unknown
      RollingDistortMaterial: new () => { uniforms: Record<string, { value: number }> }
    }
    particlesJS: {
      load: (tag: string, path: string, callback: () => void) => void
    }
  }
}

withDefaults(defineProps<{
  prompt?: string
  caption?: string
}>(), {
  prompt: 'Click to begin',
  caption: undefined,
})

// Personal in-jokes from Joao's team, ported verbatim from the original piece.
const PHRASES = [
  'O Bruno prefere perguntar a cada 6 meses',
  'Tu não tá me ajudando hahahah',
  'tenho que atender a porta aqui',
  'Muito show Thiago!',
  'seus hackerzinho',
  'Manoo, documentação do strapi é muito boa',
  'Pessoal, alguém tem um curso bom de Vue para indicar?',
  'diz pra mim que tem jQuery por favor',
  'A Cara de julgamento do Floriano é a melhor',
  'Meu time (que agora é do bruno) é lindo',
  'Gente, não sei quem foi, mas pode chamar sempre que precisar',
  'Muitissimo obrigada',
  'BEM VINDOSSS!!!',
  'esse é pior que a galinha de armadura',
  'onde eu acho o peixe?',
  'Só tem artista como front',
  'Se prepara que toda edição tem essas doideiras',
  'acho que não fui convidado',
  'Sim, o time técnico mandou benzasso',
  'é isso, tem que aprender com os erros tbm',
  'pq o joao começou a fazer a reuniao? kkk nera o Bruno',
  'qdo vi isso a primeira vez, até assustei',
  'Nao, meu cachorro tava latindo aqui do lado',
  'Cara, faço nem ideia de como faz isso',
  'to deprimida demais pra xingar',
  'e nóis alinhando div',
  'respeita que aqui é barça',
  'Galinha do zodíaco',
  'robococóp',
  'galinha blindada kkkkkkk',
  'Me deixa',
  'Fiz um comentario com o mic ligado',
  'hoje não vão gravar a apresentação?',
]

const particlesId = `particles-${useId()}`
const containerRef = useTemplateRef<HTMLDivElement>('container')
const titleRef = useTemplateRef<HTMLDivElement>('title')
const writtenRef = useTemplateRef<HTMLDivElement>('written')

let started = false
let muted = false
let audio: HTMLAudioElement | undefined
let firstRun = true
let animating = false
const cleanupFns: (() => void)[] = []

function writePhrase() {
  const container = containerRef.value
  const written = writtenRef.value
  if (animating || !container || !written) return
  animating = true

  const letterSpacing = 30
  const fontSize = 24
  const phrase = firstRun ? 'There is no linear time' : PHRASES[Math.floor(Math.random() * PHRASES.length)]!
  written.innerHTML = ''
  const { width, height } = container.getBoundingClientRect()
  written.style.marginTop = `${height / 2 - fontSize}px`
  written.style.marginLeft = `${width / 2 - (phrase.length * letterSpacing) / 2}px`

  const half = Math.ceil(phrase.length / 2)
  for (let i = 0; i < half; i++) {
    const firstEl = document.createElement('span')
    firstEl.style.position = 'absolute'
    firstEl.style.marginLeft = `${i * letterSpacing}px`
    firstEl.style.fontSize = `${fontSize}px`
    firstEl.innerText = phrase[i]!

    const lastIndex = phrase.length - (i + 1)
    const lastEl = document.createElement('span')
    lastEl.style.position = 'absolute'
    lastEl.style.marginLeft = `${phrase.length * letterSpacing - (i + 1) * letterSpacing}px`
    lastEl.style.fontSize = `${fontSize}px`
    lastEl.innerText = phrase[lastIndex]!

    const timeout = setTimeout(() => {
      written.appendChild(firstEl)
      if (i !== lastIndex) written.appendChild(lastEl)
      if (i + 1 >= half) animating = false
    }, i * 200)
    cleanupFns.push(() => clearTimeout(timeout))
  }
  firstRun = false
}

function blotterTitle() {
  const title = titleRef.value
  if (!title || !window.Blotter) return

  const text = new window.Blotter.Text('hannah', {
    family: 'Raleway Dots, serif',
    size: 130,
    fill: '#171717',
  })
  const material = new window.Blotter.RollingDistortMaterial()
  material.uniforms.uSineDistortSpread!.value = 0
  material.uniforms.uSineDistortCycleCount!.value = 0.0395
  material.uniforms.uNoiseDistortVolatility!.value = 70
  material.uniforms.uNoiseDistortAmplitude!.value = 0.016
  material.uniforms.uRotation!.value = 70
  material.uniforms.uSpeed!.value = 0.028
  material.uniforms.uSineDistortAmplitude!.value = 0.01

  const blotter = new window.Blotter(material, { texts: text })
  blotter.forText(text).appendTo(title)
}

function toggleMute() {
  if (!audio) return
  muted = !muted
  audio.muted = muted
  containerRef.value?.querySelector('.speaker')?.classList.toggle('mute', muted)
}

async function start() {
  if (started) return
  started = true

  await loadScriptOnce('/projects/no-linear-time/blotter.min.js')
  await loadScriptOnce('/projects/no-linear-time/rolling-distort-material.js')
  await loadScriptOnce('/projects/no-linear-time/particles.min.js')

  const container = containerRef.value
  if (!container) return

  audio = new Audio('/projects/no-linear-time/music.webm')
  audio.load()

  const onMouseDown = () => {
    audio?.play()
    writePhrase()
  }
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      audio?.play()
      writePhrase()
    }
  }
  container.addEventListener('mousedown', onMouseDown)
  window.addEventListener('keyup', onKeyUp)
  cleanupFns.push(() => container.removeEventListener('mousedown', onMouseDown))
  cleanupFns.push(() => window.removeEventListener('keyup', onKeyUp))

  blotterTitle()
  window.particlesJS?.load(particlesId, '/projects/no-linear-time/particlesjs-config.json', () => {})
}

onBeforeUnmount(() => {
  cleanupFns.forEach(fn => fn())
  audio?.pause()
})
</script>

<template>
  <figure class="not-prose my-8">
    <div class="relative mx-auto aspect-video w-full max-w-225 overflow-hidden rounded-sm border border-border">
      <div
        ref="container"
        class="no-linear-time-frame relative h-full w-full"
      >
        <div
          :id="particlesId"
          class="absolute inset-0 z-20"
        />
        <div
          ref="title"
          class="title relative z-10 flex justify-center"
        />
        <div
          ref="written"
          class="pointer-events-none absolute left-0 top-0 z-10 select-none"
          style="letter-spacing: -5px;"
        />
        <a
          href="#"
          class="speaker absolute left-3 top-3 z-30"
          @click.prevent="toggleMute"
        >
          <span />
        </a>
      </div>
      <button
        v-if="!started"
        type="button"
        class="absolute inset-0 z-40 flex items-center justify-center bg-bg/90 font-mono text-sm text-text transition-colors hover:text-accent"
        @click="start"
      >
        {{ prompt }}
      </button>
    </div>
    <figcaption
      v-if="caption"
      class="mt-2 font-mono text-sm text-text-muted"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.no-linear-time-frame {
  background-image: url('/projects/no-linear-time/background7.jpg');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.title {
  color: #000;
  line-height: 1;
  font-size: 2em;
  font-weight: bold;
}

.speaker {
  display: inline-block;
  overflow: hidden;
  width: 30px;
  height: 30px;
}
.speaker span {
  display: block;
  margin: 11px 0 0 2px;
  width: 8px;
  height: 8px;
  background: #000;
}
.speaker span::after {
  content: '';
  position: absolute;
  left: -13px;
  top: 5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent #000 transparent transparent;
  border-width: 10px 14px 10px 15px;
}
.speaker span::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 9px;
  width: 5px;
  height: 5px;
  border-style: double;
  border-color: #000;
  border-width: 7px 7px 0 0;
  border-radius: 0 50px 0 0;
  transform: rotate(45deg);
  transition: all 0.2s ease-out;
}
.speaker:hover span::before {
  transform: scale(0.8) translate(-3px, 0) rotate(42deg);
}
.speaker.mute span::before {
  transform: scale(0.5) translate(-15px, 0) rotate(36deg);
  opacity: 0;
}
</style>
