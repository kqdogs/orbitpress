<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>
<template>
  <div class="studio-page-title">
    <div>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="page-actions"><slot /></div>
  </div>
</template>
