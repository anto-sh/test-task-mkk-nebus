<script setup lang="ts">
interface Props {
  type?: 'success' | 'danger' | 'info' | 'primary'
  size?: 'small' | 'medium' | 'large'
}
const { type = 'primary', size = 'medium' } = defineProps<Props>()
</script>

<template>
  <button class="button" :class="`button--${type} button--${size}`">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  border: var(--btn-border-color);
  border-radius: var(--radius-sm);

  &--small {
    padding: var(--spacing-2xs) var(--spacing-xs);
    font-size: var(--text-xs);
  }
  &--medium {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--text-md);
  }
  &--large {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--text-2xl);
  }
}
</style>
