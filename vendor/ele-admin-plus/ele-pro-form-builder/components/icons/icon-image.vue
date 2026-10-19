<template>
  <div
    class="ele-icon-bg-fill"
    :style="{
      width: size === 'sm' ? '32px' : '46px',
      height: size === 'sm' ? '24px' : '34px',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden'
    }"
  >
    <div
      class="ele-icon-bg-fill-dark"
      :style="{
        width: size === 'sm' ? '8px' : '12px',
        height: size === 'sm' ? '8px' : '12px',
        borderRadius: '50%',
        position: 'absolute',
        right: size === 'sm' ? '4px' : '6px',
        top: size === 'sm' ? '4px' : '6px'
      }"
    ></div>
    <div
      class="ele-icon-bg-fill-dark"
      :style="{
        width: size === 'sm' ? '28px' : '40px',
        height: size === 'sm' ? '28px' : '40px',
        borderRadius: '6px',
        transform: 'rotate(45deg)',
        position: 'absolute',
        bottom: size === 'sm' ? '-16px' : '-24px',
        left: size === 'sm' ? '-2px' : '-4px'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    size?: 'sm' | 'md';
  }>();
</script>
