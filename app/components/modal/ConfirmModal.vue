<script setup lang="ts">
interface Props {
  isOpen: boolean
}
const { isOpen } = defineProps<Props>()

const emit = defineEmits(['update:is-open', 'on-agree'])
</script>
<template>
  <BaseModal :is-open @update:is-open="(value) => emit('update:is-open', value)">
    <template #header>Требуется подтверждение</template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer="modalProps">
      <BaseButton @click="modalProps.close">Нет</BaseButton>
      <BaseButton @click="emit('on-agree')">Да</BaseButton>
    </template>
  </BaseModal>
</template>
