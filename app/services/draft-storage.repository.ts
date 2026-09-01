import type { Note } from '~/entities/note'

const key = (noteId: string) => `notes:draft:${noteId}`

export function saveDraft(noteId: string, note: Note) {
  localStorage.setItem(key(noteId), JSON.stringify({ note }))
}
export function loadDraft(noteId: string): Note | null {
  const raw = localStorage.getItem(key(noteId))
  if (!raw) return null
  try {
    return JSON.parse(raw).note
  } catch {
    return null
  }
}
export function clearDraft(noteId: string) {
  localStorage.removeItem(key(noteId))
}
