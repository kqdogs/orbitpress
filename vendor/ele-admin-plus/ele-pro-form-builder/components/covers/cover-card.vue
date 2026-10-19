<template>
  <div
    class="ele-icon-border-color-base"
    :style="{
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px'
    }"
  >
    <div
      class="ele-icon-border-color-base"
      :style="{
        padding: '8px 10px',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px'
      }"
    >
      <IconSkeleton :style="{ width: '38px' }" size="sm" />
    </div>
    <div :style="{ padding: '8px 10px 12px 10px' }">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '10px', width: '50%' }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from '../icons/index';
</script>
