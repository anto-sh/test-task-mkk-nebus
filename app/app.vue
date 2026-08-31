<script setup lang="ts">
const { init } = useNotesStore()

onMounted(init)
</script>
<template>
  <div class="container">
    <NuxtPage />
  </div>
</template>
