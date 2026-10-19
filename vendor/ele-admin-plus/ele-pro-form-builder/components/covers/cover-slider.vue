<template>
  <div :style="{ display: 'flex', alignItems: 'center' }">
    <div
      class="ele-icon-bg-primary"
      :style="{
        flexShrink: 0,
        width: '38px',
        height: '4px',
        borderRadius: '6px'
      }"
    ></div>
    <div
      class="ele-icon-border-color-primary"
      :style="{
        flexShrink: 0,
        width: '12px',
        height: '12px',
        margin: '0 -6px',
        background: '#fff',
        borderRadius: '50%',
        borderStyle: 'solid',
        borderWidth: '3px',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.4)',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2
      }"
    ></div>
    <div
      class="ele-icon-bg-fill"
      :style="{ flex: 1, height: '4px', borderRadius: '6px' }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  //
</script>
