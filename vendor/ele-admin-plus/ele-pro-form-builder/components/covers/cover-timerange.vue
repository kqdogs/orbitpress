<template>
  <IconInput size="sm">
    <IconRangeSkeleton size="sm" />
    <SvgIcon
      name="ClockCircleOutlined"
      size="sm"
      :style="{ margin: '0 0 0 8px' }"
    />
  </IconInput>
  <IconPanel size="sm" :style="{ display: 'flex', alignItems: 'flex-start' }">
    <div :style="{ flex: 1 }">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </div>
    <div :style="{ flex: 1, marginLeft: '4px' }">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </div>
    <div :style="{ flex: 1, marginLeft: '4px' }">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </div>
  </IconPanel>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    SvgIcon,
    IconPanel,
    IconRangeSkeleton
  } from '../icons/index';
</script>
