<script setup lang="ts">
import type { Note } from '~/entities/note'
interface Props {
  note: Note
}
const { note } = defineProps<Props>()

const emit = defineEmits<{
  'go-to-note-page': [id: number | string]
}>()

function goToNotePage() {
  emit('go-to-note-page', note.id)
}

const notesStore = useNotesStore()

// modals
const isDeleteConfirmModalOpen = ref(false)
function setIsDeleteConfirmModalOpen(value: boolean) {
  isDeleteConfirmModalOpen.value = value
}

async function deleteNote() {
  notesStore.deleteNote(note.id)
}
</script>

<template>
  <div class="note-card">
    <div class="note-card__header">
      <h2 class="note-card__title">{{ note.title.slice(0, 40) }}...</h2>
      <div class="note-card__buttons">
        <BaseButton @click="setIsDeleteConfirmModalOpen(true)" color="danger">&#10006;</BaseButton>
        <BaseButton class="btn-edit" @click="goToNotePage">
          <span class="btn-edit__icon">&#128393;</span>
        </BaseButton>
      </div>
    </div>
    <UiDivider />
    <TodoList :items="note.todos" :is-readonly="true" :limit="3" />
  </div>

  <ModalConfirmModal
    :is-open="isDeleteConfirmModalOpen"
    @update:is-open="setIsDeleteConfirmModalOpen"
    @on-agree="deleteNote"
  >
    Заметка будет удалена.
    <br />
    Вы уверены?
  </ModalConfirmModal>
</template>

<style scoped lang="scss">
.note-card {
  margin: 1.2rem 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  padding: 2rem;

  @include box-shadow;

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-sm);

    .btn-edit {
      &__icon {
        width: 0.8rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 1.7rem;
        line-height: 0.8rem;
      }
    }
  }
}
</style>
