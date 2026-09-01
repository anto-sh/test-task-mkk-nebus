<script setup lang="ts">
import { useFieldDebouncedCommitingWatcher } from '~/composables/history/useFieldDebouncedCommitingWatcher'
import type { useNoteHistory } from '~/composables/history/useNoteHistory'
import type { Note } from '~/entities/note'

interface Props {
  note: Note
  history: ReturnType<typeof useNoteHistory>
}
const { note, history } = defineProps<Props>()

const addTodoItem = inject<() => void>('addTodoItem')
const updateNoteTitle = inject<(value: string) => void>('updateNoteTitle')

function updateTitle(event: Event) {
  updateNoteTitle?.((event.target as HTMLInputElement).value)
}

const titleFieldDebouncedCommit = useFieldDebouncedCommitingWatcher(
  () => note.title,
  (before, after) =>
    history.commit({
      type: 'title',
      before,
      after,
    }),
)
</script>
<template>
  <form @submit.prevent>
    <label class="note-title__label" for="title">Название заметки</label>
    <input
      class="note-title__input"
      type="text"
      :value="note.title"
      @input="updateTitle"
      @blur="titleFieldDebouncedCommit"
      id="title"
      name="title"
      placeholder="Без названия"
    />
    <TodoList :items="note.todos" :history />
    <BaseButton size="medium" @click="addTodoItem?.()">Добавить задачу</BaseButton>
  </form>
</template>
<style scoped lang="scss">
.note-title {
  &__label {
    font-size: var(--text-2xl);
  }
  &__input {
    width: 98%;
    margin-top: var(--spacing-sm);
    font-size: var(--text-3xl);
  }
}
</style>
