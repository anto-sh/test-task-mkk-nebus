<script setup lang="ts">
import type { Note } from '~/entities/note'

interface Props {
  note: Note
}
const { note } = defineProps<Props>()

const addTodoItem = inject<() => void>('addTodoItem')
const updateNoteTitle = inject<(value: string) => void>('updateNoteTitle')

function updateTitle(event: Event) {
  updateNoteTitle?.((event.target as HTMLInputElement).value)
}
</script>
<template>
  <form @submit.prevent>
    <label for="title">Название заметки: </label>
    <br />
    <input
      class="note-title-input"
      type="text"
      :value="note.title"
      @input="updateTitle"
      id="title"
      name="title"
      placeholder="Без названия"
    />
    <TodoList :items="note.todos" />
    <BaseButton size="medium" @click="addTodoItem?.()">Добавить задачу</BaseButton>
  </form>
</template>
<style scoped lang="scss">
.note-title-input {
  width: 98%;
}
</style>
