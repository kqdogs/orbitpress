<template>
  <IconInput size="sm">
    <IconSkeleton size="sm" :style="{ flex: 1, maxWidth: '20px' }" />
    <IconSkeleton
      size="sm"
      :style="{ flex: 1, maxWidth: '20px', margin: '0 0 0 6px' }"
    />
    <IconSkeleton
      size="sm"
      :style="{ flex: 1, maxWidth: '20px', margin: '0 0 0 6px' }"
    />
    <IconCursor :style="{ margin: '0 0 0 6px' }" />
  </IconInput>
</template>

<script lang="ts" setup>
  import { IconInput, IconSkeleton, IconCursor } from '../icons/index';
</script>
