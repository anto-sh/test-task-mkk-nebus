<script setup lang="ts">
interface Props {
  isOpen: boolean
}
const { isOpen } = defineProps<Props>()

const emit = defineEmits(['update:is-open', 'on-agree'])
</script>
<template>
  <BaseModal :is-open @update:is-open="(value) => emit('update:is-open', value)">
    <template #header> <slot name="header"> Требуется подтверждение </slot> </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer="modalProps">
      <div class="confirm-modal__buttons">
        <BaseButton @click="modalProps.close" >Нет</BaseButton>
        <BaseButton @click="emit('on-agree')" color="success">Да</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.confirm-modal__buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
