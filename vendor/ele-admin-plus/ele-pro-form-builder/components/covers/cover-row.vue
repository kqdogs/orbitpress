<template>
  <div
    :style="{
      display: 'grid',
      gap: '8px 6px',
      gridTemplateColumns: 'repeat(3, 1fr)'
    }"
  >
    <div
      v-for="index in 6"
      :key="index"
      class="ele-icon-border-color-base"
      :style="{
        height: '18px',
        borderStyle: 'solid',
        borderWidth: '1px',
        display: 'flex',
        alignItems: 'center'
      }"
    >
      <IconSkeleton size="xs" :style="{ width: '68%', margin: '0 auto' }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from '../icons/index';
</script>
