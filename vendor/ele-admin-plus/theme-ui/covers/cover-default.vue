<template>
  <div :style="{ display: 'flex' }">
    <div
      class="ele-setting-layout-cover-bg-dark"
      :style="{ width: '28px' }"
    ></div>
    <div :style="{ flex: 1 }">
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
        class="ele-setting-layout-cover-bg-light ele-setting-layout-cover-border-lighter"
        :style="{
          height: '8px',
          borderTopStyle: 'solid',
          borderTopWidth: '1px',
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
