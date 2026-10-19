<template>
  <div
    class="ele-icon-bg-calendar"
    :style="{
      height: size === 'sm' ? '38px' : '66px',
      width: size === 'sm' ? '82px' : '144px',
      margin: '0 auto',
      backgroundPosition: 'center',
      backgroundSize: size === 'sm' ? '12px 12px' : '20px 20px',
      maxWidth: '100%'
    }"
  ></div>
</template>

<script lang="ts" setup>
  defineProps<{
    size?: 'sm' | 'md';
  }>();
</script>
