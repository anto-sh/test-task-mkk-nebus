<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

interface Props {
  isOpen: boolean
}
const { isOpen } = defineProps<Props>()

const emit = defineEmits(['update:is-open'])

const close = () => {
  emit('update:is-open', false)
}

const modalEl = useTemplateRef<HTMLDivElement>('modal-el')
const focusTrap = useFocusTrap(modalEl)

watch(
  () => isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      focusTrap.activate()
    } else focusTrap.deactivate()
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal__backdrop" @click.self="close" @keydown.esc="close">
      <div class="modal__content" ref="modal-el" tabindex="-1" aria-modal="true" role="dialog">
        <header class="modal__header">
          <slot name="header">Default Title</slot>
          <BaseButton class="modal__close-btn" @click="close" size="medium">&times;</BaseButton>
        </header>

        <div class="modal__body">
          <slot>Default body content</slot>
        </div>

        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" :close></slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: start;
  }
  &__content {
    background: var(--page-bg-color);
    margin-top: 5vw;
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    min-width: 300px;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__body {
    margin-top: var(--spacing-md);
  }
  &__footer {
    margin-top: var(--spacing-md);
  }
}
</style>
