import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

// Translated entries live under a locale-first subdirectory (e.g. `fr/note/*.md`) so
// Nuxt Content's auto-derived route prefix carries the locale segment the URL needs
// (`/fr/note/<name>`) — @nuxtjs/i18n's `prefix_except_default` strategy then resolves
// it correctly with no further wiring. `en` stays unprefixed at the collection root.
const TRANSLATED_LOCALES = ['fr', 'pt-BR'] as const

function localizedSource(collection: string) {
  return [
    { include: `${collection}/**/*.md` },
    ...TRANSLATED_LOCALES.map(locale => ({ include: `${locale}/${collection}/**/*.md` })),
  ]
}

// Studio's image picker clears `src` to "" rather than removing the whole
// block when an image is unset, so treat an empty src as "no image".
function optionalImage(fieldName: string) {
  return z.object({
    src: z.string(),
    alt: z.string(),
  }).optional().transform((image, ctx) => {
    if (!image?.src) return undefined
    if (!image.alt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${fieldName}.alt is required when ${fieldName}.src is set` })
      return z.NEVER
    }
    return image
  })
}

const baseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().min(1),
  date: z.date(),
  updatedAt: z.date().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  locale: z.enum(['en', 'fr', 'pt-BR']).default('en'),
  tags: z.array(z.string()).default([]),
  // Hero image shown at the top of the entry's own page.
  cover: optionalImage('cover'),
})

export default defineContentConfig({
  collections: {
    project: defineCollection({
      type: 'page',
      source: localizedSource('project'),
      schema: baseSchema.extend({
        kind: z.literal('project').default('project'),
        // Tile image shown in the /project grid — independent from `cover` so a
        // project can use one image as its listing thumbnail and a different
        // (or no) hero image on its own page.
        thumbnail: optionalImage('thumbnail'),
        role: z.string().optional(),
        stack: z.array(z.string()).default([]),
        links: z.array(z.object({
          label: z.string(),
          href: z.string().url(),
        })).default([]),
        gallery: z.array(z.object({
          src: z.string().min(1),
          alt: z.string().min(1),
          caption: z.string().optional(),
        })).default([]),
      }),
    }),

    note: defineCollection({
      type: 'page',
      source: localizedSource('note'),
      schema: baseSchema.extend({
        kind: z.literal('note').default('note'),
      }),
    }),
  },
})
