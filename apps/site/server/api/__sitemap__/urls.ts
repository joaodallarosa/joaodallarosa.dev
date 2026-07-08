import { queryCollection } from '@nuxt/content/nitro'
import { ENTRY_COLLECTIONS } from '~/composables/useEntry'

// @nuxtjs/sitemap's built-in @nuxt/content integration (asSitemapCollection) requires wrapping
// each defineCollection() call and doesn't know about this schema's locale/status fields, so it
// silently sees zero entries — the module falls back to just the static page routes (/,
// /showcase). This custom source queries every published entry across all four collections and
// locales directly (same status/locale filter as the homepage feed in pages/index.vue) and
// returns their real content paths, which is what actually makes the sitemap useful for a
// publishing site. Registered via nuxt.config.ts's sitemap.sources.
export default defineSitemapEventHandler(async (event) => {
  const results = await Promise.all(
    ENTRY_COLLECTIONS.map(collection =>
      queryCollection(event, collection).where('status', '=', 'published').all(),
    ),
  )
  return results.flat().map(entry => ({
    loc: entry.path,
    lastmod: entry.updatedAt ?? entry.date,
  }))
})
