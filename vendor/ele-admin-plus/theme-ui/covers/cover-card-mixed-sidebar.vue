<template>
  <div :style="{ padding: '6px', boxSizing: 'border-box', display: 'flex' }">
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{ width: '32px', borderRadius: '3px', marginRight: '6px' }"
    >
      <div
        class="ele-setting-layout-cover-border-lighter"
        :style="{
          width: '12px',
          height: '100%',
          borderRightStyle: 'solid',
          borderRightWidth: '1px'
        }"
      ></div>
    </div>
    <div :style="{ flex: 1, display: 'flex', flexDirection: 'column' }">
      <div
        class="ele-setting-layout-cover-bg-light"
        :style="{
          height: '12px',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '4px'
        }"
      >
        <IconSkeleton :style="{ width: '6px', height: '6px' }" />
      </div>
      <div
        class="ele-setting-layout-cover-bg-light"
        :style="{ flex: 1, marginTop: '4px', borderRadius: '3px' }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
