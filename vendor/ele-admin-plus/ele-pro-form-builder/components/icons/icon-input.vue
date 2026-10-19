<template>
  <div
    class="ele-icon-border-color-primary5"
    :style="{
      display: 'flex',
      alignItems: 'center',
      height: size === 'sm' ? '20px' : '26px',
      padding: '0 6px',
      boxSizing: 'border-box',
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
