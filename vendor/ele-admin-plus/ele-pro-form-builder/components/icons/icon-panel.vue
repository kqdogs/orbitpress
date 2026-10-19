<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      padding: size === 'sm' ? '6px' : '8px',
      margin: '6px 0 0 0',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px'
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    size?: 'sm' | 'md';
  }>();
</script>
