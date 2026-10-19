<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div
      class="ele-setting-layout-cover-bg-dark"
      :style="{
        height: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '4px'
      }"
    >
      <IconSkeleton :style="{ width: '8px', height: '8px' }" />
    </div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        height: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px'
      }"
    >
      <IconSkeleton size="xs" :style="{ width: '10px' }" />
      <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
      <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
    </div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{ flex: 1, margin: '6px', borderRadius: '4px' }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
