<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ flex: 1, maxWidth: '32px' }" />
      <IconSkeleton
        size="sm"
        :style="{ flex: 1, maxWidth: '32px', margin: '0 0 0 6px' }"
      />
      <IconSkeleton
        size="sm"
        :style="{ flex: 1, maxWidth: '32px', margin: '0 6px 0 6px' }"
      />
      <SvgIcon name="ArrowUp" size="sm" :style="{ margin: '0 0 0 auto' }" />
    </IconInput>
    <IconPanel size="sm" :style="{ paddingTop: '4px', paddingBottom: '4px' }">
      <IconTable size="sm" :multiple="true" />
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
