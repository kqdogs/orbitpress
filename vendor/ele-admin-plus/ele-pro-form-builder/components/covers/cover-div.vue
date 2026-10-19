<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      padding: '8px 6px 18px 6px',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px'
    }"
  >
    <IconSkeleton size="sm" />
    <IconSkeleton size="sm" :style="{ marginTop: '6px' }" />
    <IconSkeleton size="sm" :style="{ marginTop: '6px', width: '50%' }" />
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from '../icons/index';
</script>
