<template>
  <IconSkeleton :size="size" :style="{ flex: 1 }" />
  <div
    class="ele-icon-border-color-text"
    :style="{
      flexShrink: 0,
      width: size === 'sm' ? '6px' : '8px',
      margin: size === 'sm' ? '0 4px' : '0 6px',
      borderTopStyle: 'solid',
      borderTopWidth: '1px'
    }"
  ></div>
  <IconSkeleton :size="size" :style="{ flex: 1 }" />
</template>

<script lang="ts" setup>
  import { IconSkeleton } from './index';

  defineProps<{
    size?: 'sm' | 'md';
  }>();
</script>
