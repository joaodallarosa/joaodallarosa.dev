import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

// Translated entries live under a locale-first subdirectory (e.g. `fr/post/*.md`) so
// Nuxt Content's auto-derived route prefix carries the locale segment the URL needs
// (`/fr/post/<name>`) — @nuxtjs/i18n's `prefix_except_default` strategy then resolves
// it correctly with no further wiring. `en` stays unprefixed at the collection root.
const TRANSLATED_LOCALES = ['fr', 'pt-BR'] as const

function localizedSource(collection: string) {
  return [
    { include: `${collection}/**/*.md` },
    ...TRANSLATED_LOCALES.map(locale => ({ include: `${locale}/${collection}/**/*.md` })),
  ]
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
  // Studio's image picker clears `src` to "" rather than removing the whole
  // block when a cover is unset, so treat an empty src as "no cover".
  cover: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional().transform((cover, ctx) => {
    if (!cover?.src) return undefined
    if (!cover.alt) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'cover.alt is required when cover.src is set' })
      return z.NEVER
    }
    return cover
  }),
})

export default defineContentConfig({
  collections: {
    project: defineCollection({
      type: 'page',
      source: localizedSource('project'),
      schema: baseSchema.extend({
        kind: z.literal('project').default('project'),
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

    post: defineCollection({
      type: 'page',
      source: localizedSource('post'),
      schema: baseSchema.extend({
        kind: z.literal('post').default('post'),
      }),
    }),
  },
})
