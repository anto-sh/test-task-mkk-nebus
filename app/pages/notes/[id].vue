<script setup lang="ts">
import { provide, ref } from 'vue'
import NoteForm from '~/components/notes/NoteForm.vue'
import type { Note } from '~/entities/note'

const route = useRoute()
const notesStore = useNotesStore()

const noteId = route.params.id as string
const isNew = noteId === 'new'

function createEmptyNote(): Note {
  return {
    id: crypto.randomUUID(),
    title: '',
    todos: [],
  }
}

const original = isNew ? null : notesStore.getNoteById(noteId)
if (!isNew && !original) {
  throw createError({ statusCode: 404, statusMessage: 'Заметка не найдена', fatal: true })
}

const baseNote: Note = original ? structuredClone(toDeepRaw(original)) : createEmptyNote()
const editingNote = ref<Note>(structuredClone(baseNote))

// local state manipulation functions
function addTodoItem(id: string) {
  editingNote.value.todos.push({ id: crypto.randomUUID(), text: '', done: false })
}
function deleteTodoItem(id: string) {
  editingNote.value.todos = editingNote.value.todos.filter((t) => t.id !== id)
}
function toggleTodoItemDone(id: string) {
  const todoItem = editingNote.value.todos.find((t) => t.id === id)
  if (!todoItem) return
  todoItem.done = !todoItem.done
}
function updateTodoItemText(id: string, value: string) {
  const todoItem = editingNote.value.todos.find((t) => t.id === id)
  if (!todoItem) return
  todoItem.text = value
}
function updateNoteTitle(value: string) {
  editingNote.value.title = value
}

provide('addTodoItem', addTodoItem)
provide('deleteTodoItem', deleteTodoItem)
provide('toggleTodoItemDone', toggleTodoItemDone)
provide('updateTodoItemText', updateTodoItemText)
provide('updateNoteTitle', updateNoteTitle)

// global state manipulations functions
async function saveNote() {
  if (editingNote.value.title.trim() == '') editingNote.value.title = 'Без названия'
  notesStore.saveNote(editingNote.value)
  await navigateTo({ path: '/' })
}
async function cancelEditor() {
  await navigateTo({ path: '/' })
}
async function deleteNote() {
  notesStore.deleteNote(noteId)
}
</script>

<template>
  <div class="note__toolbar">
    <BaseButton @click="cancelEditor">Отменить</BaseButton>
    <div>
      <BaseButton v-if="!isNew" class="btn-delete" @click="deleteNote">Удалить</BaseButton>
      <BaseButton @click="saveNote">Сохранить</BaseButton>
    </div>
  </div>
  <NoteForm :note="editingNote" />
</template>

<style scoped lang="scss">
.note__toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  .btn-delete {
    margin-right: var(--spacing-sm);
  }
}
</style>
