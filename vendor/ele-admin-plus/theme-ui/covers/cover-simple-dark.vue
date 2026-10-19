<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '2px 6px 6px 0',
      background: 'linear-gradient(270deg, #06080d, #0d121c)'
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
        :style="{ width: '16px', height: '4px', background: '#282c42' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', margin: '0 0 0 auto', background: '#282c42' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', marginLeft: '4px', background: '#282c42' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', marginLeft: '4px', background: '#282c42' }"
      />
      <IconSkeleton
        :style="{
          width: '6px',
          height: '6px',
          marginLeft: 'auto',
          background: '#282c42'
        }"
      />
    </div>
    <div
      :style="{
        flex: 1,
        width: 'calc(100% - 28px)',
        borderRadius: '6px',
        margin: '2px 0 0 auto',
        background: '#101622'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
