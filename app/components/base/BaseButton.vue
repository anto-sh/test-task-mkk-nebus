<script setup lang="ts">
interface Props {
  type?: 'success' | 'danger' | 'info' | 'primary'
}
const { type = 'primary' } = defineProps<Props>()
</script>

<template>
  <button class="button" :class="`button--${type}`">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  font-size: var(--text-md);
  padding: var(--spacing-sm);
  border: var(--btn-border-color);
  border-radius: var(--radius-sm);
}
</style>
