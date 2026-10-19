<template>
  <div>
    <IconSkeleton size="sm" :style="{ marginBottom: '10px', width: '33%' }" />
    <div
      class="ele-icon-border-color-primary"
      :style="{ borderTopStyle: 'solid', borderTopWidth: '1px' }"
    ></div>
    <IconSkeleton size="sm" :style="{ margin: '10px 0', width: '66%' }" />
    <div
      class="ele-icon-border-color-primary"
      :style="{ borderTopStyle: 'dashed', borderTopWidth: '1px' }"
    ></div>
    <IconSkeleton size="sm" :style="{ marginTop: '10px' }" />
  </div>
</template>

<script lang="ts" setup>
  import { IconSkeleton } from '../icons/index';
</script>
