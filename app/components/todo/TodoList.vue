<script setup lang="ts">
import type { useNoteHistory } from '~/composables/history/useNoteHistory'
import type { TodoItem } from '~/entities/note'

interface Props {
  items: TodoItem[]
  isReadonly?: boolean
  limit?: number | null
  history?: ReturnType<typeof useNoteHistory>
}

const { items, isReadonly = false, limit = null } = defineProps<Props>()

const itemsToShow = computed(() => items.slice(0, limit ?? items.length))
</script>

<template>
  <ul class="todo-list" :class="{ 'todo-list--readonly': isReadonly }">
    <TodoListItem
      v-for="item of itemsToShow"
      :item
      :key="item.id"
      :is-readonly="isReadonly"
      :history
    />
  </ul>
</template>

<style scoped lang="scss">
.todo-list {
  list-style: none;
  padding-left: 0;
}
.todo-list--readonly {
  list-style: circle;
}
</style>
