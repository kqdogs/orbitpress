<template>
  <div :style="{ width: '82%', margin: '0 auto' }">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <IconCheckbox size="md" />
      <IconSkeleton size="sm" :style="{ flex: 1 }" />
    </div>
    <div :style="{ display: 'flex', alignItems: 'center', marginTop: '6px' }">
      <IconCheckbox size="md" :checked="true" />
      <IconSkeleton size="sm" :style="{ flex: 1 }" />
    </div>
    <div :style="{ display: 'flex', alignItems: 'center', marginTop: '6px' }">
      <IconCheckbox size="md" />
      <IconSkeleton size="sm" :style="{ flex: 1 }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton, IconCheckbox } from '../icons/index';
</script>
