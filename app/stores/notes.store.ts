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

  function createNote(): Note {
    const note: Note = {
      id: crypto.randomUUID(),
      title: '',
      todos: [],
    }
    notes.value.push(note)
    return note
  }

  function updateNote(updated: Note) {
    const index = notes.value.findIndex((n) => n.id === updated.id)
    if (index === -1) return
    notes.value[index] = { ...updated }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  function getNoteById(id: string) {
    return notes.value.find((n) => n.id === id)
  }

  let saveTimer: NodeJS.Timeout | null = null
  watch(
    notes,
    () => {
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => saveNotes(notes.value), 500)
    },
    { deep: true },
  )

  return { notes, init, dispose, createNote, updateNote, deleteNote, getNoteById }
})
