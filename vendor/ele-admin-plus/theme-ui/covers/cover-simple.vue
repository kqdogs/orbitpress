<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '2px 6px 6px 0',
      background:
        'repeating-linear-gradient(103deg, #e2f5ff 3%, #eaf5ff 10%, #ece1ff 30%, #e4f6ff 50%)'
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
        :style="{ width: '16px', height: '4px', background: '#fff' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', margin: '0 0 0 auto', background: '#fff' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', marginLeft: '4px', background: '#fff' }"
      />
      <IconSkeleton
        size="xs"
        :style="{ width: '10px', marginLeft: '4px', background: '#fff' }"
      />
      <IconSkeleton
        :style="{
          width: '6px',
          height: '6px',
          marginLeft: 'auto',
          background: '#fff'
        }"
      />
    </div>
    <div
      :style="{
        flex: 1,
        width: 'calc(100% - 28px)',
        borderRadius: '6px',
        margin: '2px 0 0 auto',
        background: '#fff'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import IconSkeleton from './icon-skeleton.vue';
</script>
