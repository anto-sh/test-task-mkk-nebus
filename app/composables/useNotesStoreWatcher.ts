import type { Note } from '~/entities/note'
import { saveNotes } from '~/services/notes-storage.repository'

export function useNotesStoreWatcher(notes: Ref<Note[]>) {
  watch(notes, () => saveNotes(notes.value), { deep: true })
}
