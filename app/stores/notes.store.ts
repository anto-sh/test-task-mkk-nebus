import { ref, watch } from 'vue'
import type { Note } from '~/entities/note'
import {
  loadNotes,
  saveNotes,
  subscribeToExternalChanges,
} from '~/services/notes-storage.repository'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>(loadNotes())
  let unsubscribe: (() => void) | null = null

  function init() {
    unsubscribe = subscribeToExternalChanges(() => {
      notes.value = loadNotes()
    })
  }
  function dispose() {
    unsubscribe?.()
  }

  function saveNote(note: Note) {
    const index = notes.value.findIndex((n) => n.id === note.id)
    if (index === -1) notes.value.push({ ...note })
    notes.value[index] = { ...note }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  function getNoteById(id: string) {
    return notes.value.find((n) => n.id === id)
  }

  watch(notes, () => saveNotes(notes.value), { deep: true })

  return { notes, init, dispose, saveNote, deleteNote, getNoteById }
})
