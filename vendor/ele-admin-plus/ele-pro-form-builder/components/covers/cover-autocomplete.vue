<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <IconCursor />
    </IconInput>
    <IconPanel size="sm">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    IconCursor,
    IconPanel
  } from '../icons/index';
</script>
