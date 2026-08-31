import type { Note } from '~/entities/note'

interface StoragePayloadV1 {
  schemaVersion: 1
  notes: Note[]
}

const STORAGE_KEY = 'notes:data'
const SCHEMA_VERSION = 1

// При изменении версии, дописать функцию сюда,
// ключ - версия, от которой мигрируем.
const migrations: Record<number, (payload: any) => any> = {}

function migrate(payload: any): StoragePayloadV1 {
  let current = payload
  while (current.schemaVersion < SCHEMA_VERSION) {
    const step = migrations[current.schemaVersion]
    if (!step) break
    current = step(current)
  }
  return current
}

export function loadNotes(): Note[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return migrate(JSON.parse(raw)).notes
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
