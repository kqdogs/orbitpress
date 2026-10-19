<template>
  <div
    :class="bgClass || 'ele-setting-layout-cover-bg-fill-light'"
    :style="{
      flexShrink: 0,
      height: { md: '10px', xs: '4px' }[size || 'md'],
      borderRadius: size === 'xs' ? '2px' : '4px'
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    size?: 'xs' | 'md';
    bgClass?: string;
  }>();
</script>
