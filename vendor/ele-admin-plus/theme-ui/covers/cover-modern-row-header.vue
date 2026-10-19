<template>
  <div
    class="ele-setting-layout-cover-bg-blue"
    :style="{
      display: 'flex',
      boxSizing: 'border-box',
      padding: '6px 6px 6px 0'
    }"
  >
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        width: 'calc(100% - 28px)',
        borderRadius: '6px',
        margin: '0 0 0 auto'
      }"
    >
      <div
        class="ele-setting-layout-cover-bg-blue-dark"
        :style="{
          height: '12px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '5px 5px 0 0',
          padding: '0 6px'
        }"
      >
        <IconModernTab
          bgClass="ele-setting-layout-cover-bg-blue-dark"
          :style="{
            margin: '0 0 -1px 0',
            alignSelf: 'flex-end',
            width: '26px'
          }"
        />
        <IconSkeleton
          bgClass="ele-setting-layout-cover-bg-light"
          :style="{ width: '6px', height: '6px', marginLeft: 'auto' }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
  import IconModernTab from './icon-modern-tab.vue';
</script>
