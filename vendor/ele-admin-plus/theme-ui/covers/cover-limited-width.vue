<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div
      class="ele-setting-layout-cover-bg-light"
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
        flex: 1,
        width: '68%',
        margin: '6px auto',
        borderRadius: '4px'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
