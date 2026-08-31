import type { Note } from '~/entities/note'

interface StoragePayloadV1 {
  schemaVersion: 1
  notes: Note[]
}

const STORAGE_KEY = 'notes:data'
const SCHEMA_VERSION = 1

export function loadNotes(): Note[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsedStorage = JSON.parse(raw)
    if (parsedStorage.schemaVersion === SCHEMA_VERSION) return parsedStorage.notes
    return []
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  const payload: StoragePayloadV1 = { schemaVersion: SCHEMA_VERSION, notes }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function subscribeToExternalChanges(cb: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
