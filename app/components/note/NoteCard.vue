<script setup lang="ts">
import type { Note } from '~/entities/note'
interface Props {
  note: Note
}
const { note } = defineProps<Props>()

const emit = defineEmits<{
  'go-to-note-page': [id: number | string]
}>()

function goToNotePage() {
  emit('go-to-note-page', note.id)
}

const notesStore = useNotesStore()

// modals
const isDeleteConfirmModalOpen = ref(false)
function setIsDeleteConfirmModalOpen(value: boolean) {
  isDeleteConfirmModalOpen.value = value
}

async function deleteNote() {
  notesStore.deleteNote(note.id)
}
</script>

<template>
  <h2>{{ note.title }}</h2>
  <hr />
  <TodoList :items="note.todos" :is-readonly="true" :limit="3" />
  <div>
    <BaseButton @click="goToNotePage">Редактировать</BaseButton>
    <BaseButton @click="setIsDeleteConfirmModalOpen(true)">Удалить</BaseButton>
  </div>

  <ModalConfirmModal
    :is-open="isDeleteConfirmModalOpen"
    @update:is-open="setIsDeleteConfirmModalOpen"
    @on-agree="deleteNote"
  >
    Заметка будет удалена.
    <br />
    Вы уверены?
  </ModalConfirmModal>
</template>

<style scoped lang="scss"></style>
