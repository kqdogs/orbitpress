<template>
  <div :style="{ display: 'flex', flexDirection: 'column' }">
    <div
      class="ele-setting-layout-cover-bg-primary"
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
    <div :style="{ flex: 1, display: 'flex' }">
      <div
        class="ele-setting-layout-cover-bg-light ele-setting-layout-cover-border-lighter"
        :style="{
          width: '28px',
          borderRightStyle: 'solid',
          borderRightWidth: '1px'
        }"
      ></div>
      <div
        class="ele-setting-layout-cover-bg-light"
        :style="{
          flex: 1,
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
