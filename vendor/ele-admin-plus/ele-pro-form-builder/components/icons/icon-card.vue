<template>
  <div
    :class="[
      { 'ele-icon-border-color-primary5': checked },
      { 'ele-icon-border-color-base': !checked }
    ]"
    :style="{
      padding: size === 'sm' ? '8px' : '10px',
      borderRadius: '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
      position: 'relative'
    }"
  >
    <IconSkeleton :size="size === 'sm' ? 'xs' : 'sm'" />
    <div
      v-if="checked"
      class="ele-icon-border-color-primary"
      :style="{
        borderRadius: '2px',
        borderStyle: 'solid',
        borderWidth: '4px',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        position: 'absolute',
        right: size === 'sm' ? '2px' : '4px',
        top: size === 'sm' ? '2px' : '4px'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from './index';

  defineProps<{
    size?: 'sm' | 'md';
    checked?: boolean;
  }>();
</script>
