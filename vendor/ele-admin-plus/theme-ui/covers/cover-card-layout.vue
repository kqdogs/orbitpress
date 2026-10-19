<template>
  <div :style="{ padding: '6px', boxSizing: 'border-box', display: 'flex' }">
    <div
      class="ele-setting-layout-cover-bg-dark"
      :style="{ width: '10px', borderRadius: '3px' }"
    ></div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        width: '20px',
        borderRadius: '3px',
        margin: '0 4px',
        border: 'none'
      }"
    ></div>
    <div :style="{ flex: 1, display: 'flex', flexDirection: 'column' }">
      <div
        class="ele-setting-layout-cover-bg-primary"
        :style="{
          height: '12px',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px'
        }"
      >
        <IconSkeleton size="xs" :style="{ width: '8px', height: '3px' }" />
        <IconSkeleton
          size="xs"
          :style="{ width: '8px', height: '3px', marginLeft: '4px' }"
        />
        <IconSkeleton
          size="xs"
          :style="{ width: '8px', height: '3px', marginLeft: '4px' }"
        />
        <IconSkeleton
          :style="{ width: '6px', height: '6px', marginLeft: 'auto' }"
        />
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
