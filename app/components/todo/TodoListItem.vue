<script setup lang="ts">
import type { TodoItem } from '~/entities/note'
interface Props {
  item: TodoItem
  isReadonly?: boolean
}
const { item, isReadonly = false } = defineProps<Props>()

const toggleTodoItemDone = inject<(id: string) => void>('toggleTodoItemDone', () => {})
const updateTodoItemText = inject<(id: string, value: string) => void>(
  'updateTodoItemText',
  () => {},
)
const deleteTodoItem = inject<(id: string) => void>('deleteTodoItem', () => {})

function updateText(event: Event) {
  updateTodoItemText(item.id, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <li class="todo-item" :class="{ 'todo-item--done': item.done }">
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
      placeholder="Задача"
    />
    <span v-else class="todo-item__text">{{ item.text }}</span>
    <BaseButton v-if="!isReadonly" @click="deleteTodoItem(item.id)">&times;</BaseButton>
  </li>
</template>

<style scoped lang="scss">
.todo-item {
  $base: &;
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  &__text {
    width: 100%;
  }

  &--done {
    display: flex;

    #{$base}__text {
      text-decoration: line-through;
    }
  }
}
</style>
