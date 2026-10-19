<template>
  <div
    class="ele-setting-layout-cover-bg-blue"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '2px 6px 6px 0'
    }"
  >
    <div
      :style="{
        height: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2px 0 8px'
      }"
    >
      <IconSkeleton
        bgClass="ele-setting-layout-cover-bg-light"
        :style="{ width: '16px', height: '4px' }"
      />
      <IconSkeleton
        bgClass="ele-setting-layout-cover-bg-light"
        size="xs"
        :style="{ width: '10px', margin: '0 0 0 auto' }"
      />
      <IconSkeleton
        bgClass="ele-setting-layout-cover-bg-light"
        size="xs"
        :style="{ width: '10px', marginLeft: '4px' }"
      />
      <IconSkeleton
        bgClass="ele-setting-layout-cover-bg-light"
        size="xs"
        :style="{ width: '10px', marginLeft: '4px' }"
      />
      <IconSkeleton
        bgClass="ele-setting-layout-cover-bg-light"
        :style="{ width: '6px', height: '6px', marginLeft: 'auto' }"
      />
    </div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        flex: 1,
        width: 'calc(100% - 28px)',
        borderRadius: '6px',
        margin: '2px 0 0 auto'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
