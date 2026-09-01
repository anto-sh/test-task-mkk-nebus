<script setup lang="ts">
import { provide, ref } from 'vue'
import { useGlobalUndoRedo } from '~/composables/history/useGlobalUndoRedo'
import { useNoteHistory } from '~/composables/history/useNoteHistory'
import { type Note, type TodoItem } from '~/entities/note'
import { clearDraft, loadDraft, saveDraft } from '~/services/draft-storage.repository'

const route = useRoute()
const notesStore = useNotesStore()

const noteId = route.params.id as string
const isNew = noteId === 'new'

function createEmptyNote(): Note {
  return {
    id: 'new',
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

const history = useNoteHistory(editingNote.value)
useGlobalUndoRedo(history.undo, history.redo)

// modals
const isDeleteConfirmModalOpen = ref(false)
function setIsDeleteConfirmModalOpen(value: boolean) {
  isDeleteConfirmModalOpen.value = value
}

const isDraftRecoveryConfirmModalOpen = ref(false)
function setIsDraftRecoveryConfirmModalOpen(value: boolean) {
  isDraftRecoveryConfirmModalOpen.value = value
}

// draft recovery

const [debouncedDraftSave, draftSaveTimer] = debounce(
  () => saveDraft(editingNote.value.id, editingNote.value),
  1000,
)

watch(editingNote, debouncedDraftSave, { deep: true })

const draft = loadDraft(noteId)
console.log(draft)
onMounted(() => {
  if (draft) setIsDraftRecoveryConfirmModalOpen(true)
})
onUnmounted(() => {
  clearTimeout(draftSaveTimer)
  clearDraft(noteId)
})

function recoverDraft() {
  if (!draft) return
  editingNote.value = draft
  setIsDraftRecoveryConfirmModalOpen(false)
}

// local state manipulation functions
function addTodoItem(id: string) {
  const newTodoItem = { id: crypto.randomUUID(), text: '', done: false }
  const index = editingNote.value.todos.length
  editingNote.value.todos.push(newTodoItem)

  history.commit({
    type: 'todo-add',
    todo: newTodoItem,
    index,
  })
}

function deleteTodoItem(id: string) {
  const index = editingNote.value.todos.findIndex((t) => t.id === id)
  if (index === -1) return
  const todo = editingNote.value.todos.splice(index, 1)[0] as TodoItem
  history.commit({ type: 'todo-remove', todo, index })
}

function toggleTodoItemDone(id: string) {
  const todoItem = editingNote.value.todos.find((t) => t.id === id)
  if (!todoItem) return
  const before = todoItem.done
  todoItem.done = !todoItem.done
  history.commit({
    type: 'todo-done',
    todoId: id,
    before,
    after: !before,
  })
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
  await navigateTo({ path: '/' })
}
</script>

<template>
  <div class="note__toolbar">
    <BaseButton @click="cancelEditor">Отменить</BaseButton>
    <div>
      <span>{{ history.undoStackSize.value }}</span>
      <BaseButton @click="history.undo" :disabled="!history.canUndo.value">&#8617;</BaseButton>
      <BaseButton @click="history.redo" :disabled="!history.canRedo.value">&#8618;</BaseButton>
      <span>{{ history.redoStackSize.value }}</span>
    </div>
    <div>
      <BaseButton v-if="!isNew" class="btn-delete" @click="setIsDeleteConfirmModalOpen(true)"
        >Удалить</BaseButton
      >
      <BaseButton @click="saveNote">Сохранить</BaseButton>
    </div>
  </div>
  <NoteForm :note="editingNote" :history />

  <ModalConfirmModal
    :is-open="isDeleteConfirmModalOpen"
    @update:is-open="setIsDeleteConfirmModalOpen"
    @on-agree="deleteNote"
  >
    Заметка будет удалена.
    <br />
    Вы уверены?
  </ModalConfirmModal>

  <BaseModal
    :is-open="isDraftRecoveryConfirmModalOpen"
    @update:is-open="setIsDraftRecoveryConfirmModalOpen"
  >
    <template #header>У вас есть черновик</template>
    <template #default> Вы хотите восстановить черновик? </template>
    <template #footer="modalProps">
      <BaseButton @click="modalProps.close">Нет</BaseButton>
      <BaseButton @click="recoverDraft">Да</BaseButton>
    </template>
  </BaseModal>
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
