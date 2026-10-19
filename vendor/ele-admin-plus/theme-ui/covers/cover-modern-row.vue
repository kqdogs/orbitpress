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
        margin: '0 0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '2px 6px 6px 6px'
      }"
    >
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <IconSkeleton :style="{ width: '16px', height: '4px' }" />
        <IconSkeleton
          :style="{ width: '6px', height: '6px', marginLeft: 'auto' }"
        />
      </div>
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 0 5px 0'
        }"
      >
        <IconSkeleton size="xs" :style="{ width: '10px' }" />
        <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
        <IconSkeleton size="xs" :style="{ width: '10px', marginLeft: '4px' }" />
      </div>
      <div
        class="ele-setting-layout-cover-border-lighter"
        :style="{
          flex: 1,
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: '4px'
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
