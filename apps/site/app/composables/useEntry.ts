const ENTRY_COLLECTIONS = ['project', 'post'] as const

export type EntryCollection = (typeof ENTRY_COLLECTIONS)[number]

export async function resolveEntryByPath(path: string) {
  for (const collection of ENTRY_COLLECTIONS) {
    // @nuxt/content auto-imports a client queryCollection(collection) and a differently-shaped
    // nitro queryCollection(event, collection) under the same global name. Now that server/api
    // exists (see server/api/__sitemap__/urls.ts), `nuxt typecheck`'s project-reference build
    // merges both projects' ambient globals into one program — and, observed across repeated
    // clean-cache runs, non-deterministically picks either signature for this client-side call
    // (an upstream vue-tsc project-reference isolation quirk, not something fixable from here).
    // The call itself is correct and runs fine at runtime (verified live, see PROJECT.md
    // Phase 7). @ts-expect-error isn't safe here since it errors on whichever run doesn't
    // trigger the mismatch, so both the arg-count and the "well-known broken ts-ignore" checks
    // are suppressed instead, which tolerate either outcome.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const entry = await queryCollection(collection).path(path).where('status', '=', 'published').first()
    if (entry) {
      return entry
    }
  }
  return null
}

export { ENTRY_COLLECTIONS }
