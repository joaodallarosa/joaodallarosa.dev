const ENTRY_COLLECTIONS = ['project', 'post', 'note', 'log'] as const

export type EntryCollection = (typeof ENTRY_COLLECTIONS)[number]

export async function resolveEntryByPath(path: string) {
  for (const collection of ENTRY_COLLECTIONS) {
    const entry = await queryCollection(collection).path(path).first()
    if (entry) {
      return entry
    }
  }
  return null
}

export { ENTRY_COLLECTIONS }
