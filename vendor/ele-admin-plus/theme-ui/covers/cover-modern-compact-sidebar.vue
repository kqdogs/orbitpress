<template>
  <div
    class="ele-setting-layout-cover-bg-blue"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '2px 6px 6px 0',
      position: 'relative'
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
      <IconModernTab
        :style="{ margin: '0 0 -1px 16px', alignSelf: 'flex-end' }"
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
        width: 'calc(100% - 16px)',
        borderRadius: '6px',
        margin: '0 0 0 auto'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
  import IconModernTab from './icon-modern-tab.vue';
</script>
