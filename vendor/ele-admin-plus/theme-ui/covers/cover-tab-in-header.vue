<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div
      class="ele-setting-layout-cover-bg-primary"
      :style="{
        height: '14px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px'
      }"
    >
      <IconSkeleton :style="{ width: '16px', height: '3px' }" />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', margin: '0 0 0 auto' }"
      />
      <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
      <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
      <IconSkeleton
        :style="{ width: '8px', height: '8px', marginLeft: 'auto' }"
      />
    </div>
    <div
      class="ele-setting-layout-cover-bg-light ele-setting-layout-cover-border-lighter"
      :style="{
        flex: 1,
        width: '28px',
        borderRightStyle: 'solid',
        borderRightWidth: '1px'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
