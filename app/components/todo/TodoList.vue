<script setup lang="ts">
import type { TodoItem } from '~/entities/note'

interface Props {
  items: TodoItem[]
  isReadonly?: boolean
  limit?: number | null
}

const { items, isReadonly = false, limit = null } = defineProps<Props>()

const itemsToShow = computed(() => items.slice(0, limit ?? -1))
</script>

<template>
  <ul class="todo-list" :class="{ 'todo-list--readonly': isReadonly }">
    <TodoListItem v-for="item of itemsToShow" :item :key="item.id" :is-readonly="isReadonly" />
  </ul>
</template>

<style scoped lang="scss">
.todo-list {
  list-style: none;
}
.todo-list--readonly {
  list-style: circle;
}
</style>
