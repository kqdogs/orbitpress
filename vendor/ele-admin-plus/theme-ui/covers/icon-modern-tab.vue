<template>
  <div
    :style="{
      height: '10px',
      width: '28px',
      display: 'inline-flex',
      alignItems: 'flex-end',
      marginBottom: '-1px'
    }"
  >
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        width: '5px',
        height: '5px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        clipPath: 'polygon(-20% -20%, 82% -20%, 82% 82%, -20% 82%)'
      }"
    >
      <div
        :class="bgClass || 'ele-setting-layout-cover-bg-blue'"
        :style="{
          flexShrink: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          margin: '0 1px 1px 0'
        }"
      ></div>
    </div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        flex: 1,
        height: '100%',
        borderRadius: '4px 4px 0 0',
        margin: '0 -1px',
        position: 'relative',
        zIndex: 2,
        clipPath: 'polygon(-20% -20%, 120% -20%, 120% 92%, -20% 92%)'
      }"
    ></div>
    <div
      class="ele-setting-layout-cover-bg-light"
      :style="{
        width: '5px',
        height: '5px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        clipPath: 'polygon(19% -20%, 120% -20%, 120% 82%, 19% 82%)'
      }"
    >
      <div
        :class="bgClass || 'ele-setting-layout-cover-bg-blue'"
        :style="{
          flexShrink: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          margin: '0 0 1px 1px'
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    bgClass?: string;
  }>();
</script>
