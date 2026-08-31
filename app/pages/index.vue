<script setup lang="ts">
import NoteCard from '~/components/notes/NoteCard.vue'

const notesStore = useNotesStore()
async function goToNotePage(id?: number) {
  if (id)
    await navigateTo({
      name: 'notes-id',
      params: { id },
    })
  else
    await navigateTo({
      name: 'notes-id',
      params: { id: 'new' },
    })
}
</script>
<template>
  <div class="toolbar">
    <BaseButton @click="goToNotePage()">Создать новую заметку</BaseButton>
  </div>
  <div class="note-cards-list">
    <NoteCard @goToNotePage="goToNotePage" v-for="note of notesStore.notes" :key="note.id" :note />
  </div>
</template>

<style scoped lang="scss">
.note-cards-list {
  display: flex;
  flex-direction: column;
}
</style>
