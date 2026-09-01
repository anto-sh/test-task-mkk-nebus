<script setup lang="ts">
interface Props {
  color?: 'success' | 'danger' | 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}
const { color = 'secondary', size = 'medium' } = defineProps<Props>()
</script>

<template>
  <button type="button" class="btn" :class="`btn--${color} btn--${size}`">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.btn {
  border: var(--btn-border-color);
  border-radius: var(--radius-sm);
  transition: 0.3s background-color;
  cursor: pointer;

  &--small {
    padding: var(--spacing-2xs) var(--spacing-xs);
    font-size: var(--text-xs);
  }
  &--medium {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--text-md);
  }
  &--large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--text-2xl);
  }

  &--primary {
    background-color: var(--btn-primary-bg-color);
    color: var(--btn-primary-text-color);
    &:hover {
      background-color: var(--btn-primary-hover-bg-color);
    }
    &:active {
      background-color: var(--btn-primary-click-bg-color);
    }
  }

  &--secondary {
    background-color: var(--btn-secondary-bg-color);
    color: var(--btn-secondary-text-color);
    &:hover {
      background-color: var(--btn-secondary-hover-bg-color);
    }
    &:active {
      background-color: var(--btn-secondary-click-bg-color);
    }
  }

  &--success {
    background-color: var(--btn-success-bg-color);
    color: var(--btn-success-text-color);
    &:hover {
      background-color: var(--btn-success-hover-bg-color);
    }
    &:active {
      background-color: var(--btn-success-click-bg-color);
    }
  }

  &--danger {
    background-color: var(--btn-danger-bg-color);
    color: var(--btn-danger-text-color);
    &:hover {
      background-color: var(--btn-danger-hover-bg-color);
    }
    &:active {
      background-color: var(--btn-danger-click-bg-color);
    }
  }
}
</style>
