<script setup lang="ts">
import { useFieldDebouncedCommitingWatcher } from '~/composables/history/useFieldDebouncedCommitingWatcher'
import type { useNoteHistory } from '~/composables/history/useNoteHistory'
import type { TodoItem } from '~/entities/note'
interface Props {
  item: TodoItem
  isReadonly?: boolean
  history?: ReturnType<typeof useNoteHistory>
}
const { item, isReadonly = false, history = null } = defineProps<Props>()

const toggleTodoItemDone = inject<(id: string) => void>('toggleTodoItemDone', () => {})
const updateTodoItemText = inject<(id: string, value: string) => void>(
  'updateTodoItemText',
  () => {},
)
const deleteTodoItem = inject<(id: string) => void>('deleteTodoItem', () => {})

function updateText(event: Event) {
  updateTodoItemText(item.id, (event.target as HTMLInputElement).value.trim())
}

const todoTextFieldDebouncedCommit = isReadonly
  ? () => {}
  : useFieldDebouncedCommitingWatcher(
      () => item.text,
      (before, after) => {
        if (history)
          history.commit({
            type: 'todo-text',
            todoId: item.id,
            before,
            after,
          })
      },
    )
</script>

<template>
  <li
    class="todo-item"
    :class="{ 'todo-item--done': item.done, 'todo-item--readonly': isReadonly }"
  >
    <input
      v-if="!isReadonly"
      type="checkbox"
      :checked="item.done"
      @change="toggleTodoItemDone(item.id)"
    />
    <input
      v-if="!isReadonly"
      class="todo-item__text"
      type="text"
      :value="item.text"
      @input="updateText"
      @blur="todoTextFieldDebouncedCommit"
      placeholder="Задача"
    />
    <span v-else class="todo-item__text">{{ item.text.slice(0, 100) }}...</span>
    <BaseButton v-if="!isReadonly" @click="deleteTodoItem(item.id)" color="danger"
      >&times;</BaseButton
    >
  </li>
</template>

<style scoped lang="scss">
.todo-item {
  $base: &;
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);

  &__text {
    width: 100%;
    font-size: var(--text-md);
    background-color: var(--page-bg-color);
    border: none;
    color: var(--text-main-color);
  }

  &--done {
    list-style-type: disc;
    #{$base}__text {
      text-decoration: line-through;
    }
  }

  &--readonly {
    display: list-item;
  }
}
</style>
