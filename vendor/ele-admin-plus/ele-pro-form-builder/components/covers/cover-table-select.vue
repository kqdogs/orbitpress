<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <SvgIcon name="ArrowUp" size="sm" :style="{ margin: '0 0 0 auto' }" />
    </IconInput>
    <IconPanel size="sm" :style="{ paddingTop: '4px', paddingBottom: '4px' }">
      <IconTable size="sm" />
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    SvgIcon,
    IconPanel,
    IconTable
  } from '../icons/index';
</script>
