<template>
  <div
    class="ele-icon-border-color-base"
    :class="[
      { 'ele-icon-bg-primary': type === 'primary' },
      { 'ele-icon-bg-fill': type !== 'primary' && type !== 'bordered' }
    ]"
    :style="{
      display: 'flex',
      alignItems: 'center',
      height: size === 'sm' ? '22px' : '28px',
      padding: size === 'sm' ? '0 6px' : '0 10px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      borderStyle: type === 'bordered' ? 'solid' : void 0,
      borderWidth: type === 'bordered' ? '1px' : void 0
    }"
  >
    <IconSkeleton
      v-if="!hideSkeleton && (type === 'primary' || type === 'bordered')"
      :size="size === 'sm' ? 'xs' : 'sm'"
      :class="[
        { 'ele-icon-bg-white': type === 'primary' },
        { 'ele-icon-bg-fill-light': type !== 'primary' }
      ]"
      :style="{ flex: 1 }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from './index';

  defineProps<{
    size?: 'sm' | 'md';
    type?: 'default' | 'primary' | 'bordered';
    hideSkeleton?: boolean;
  }>();
</script>
