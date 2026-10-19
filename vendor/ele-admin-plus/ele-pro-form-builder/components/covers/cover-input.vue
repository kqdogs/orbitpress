<template>
  <IconInput size="sm">
    <IconSkeleton size="sm" :style="{ width: '50%' }" />
    <IconCursor />
  </IconInput>
</template>

<script lang="ts" setup>
  import { IconInput, IconSkeleton, IconCursor } from '../icons/index';
</script>
