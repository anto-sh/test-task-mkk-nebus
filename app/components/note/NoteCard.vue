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

const { deleteNote } = useNotesStore()
</script>

<template>
  <h2>{{ note.title }}</h2>
  <hr />
  <TodoList :items="note.todos" :is-readonly="true" :limit="3" />
  <div>
    <BaseButton @click="goToNotePage">Редактировать</BaseButton>
    <BaseButton @click="deleteNote(note.id)">Удалить</BaseButton>
  </div>
</template>

<style scoped lang="scss"></style>
