<template>
  <IconInput
    :style="{ height: '38px', padding: '6px 6px 0 6px', display: 'block' }"
  >
    <IconSkeleton size="sm" />
    <div :style="{ display: 'flex', alignItems: 'center', marginTop: '6px' }">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <IconCursor />
    </div>
  </IconInput>
</template>

<script lang="ts" setup>
  import { IconInput, IconSkeleton, IconCursor } from '../icons/index';
</script>
