<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <SvgIcon name="ArrowUp" size="sm" :style="{ margin: '0 0 0 auto' }" />
    </IconInput>
    <IconPanel size="sm">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow
          size="sm"
          color="primary"
          :style="{ margin: '0 1px 0 4px' }"
        />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow
          size="sm"
          color="primary"
          :style="{ margin: '0 1px 0 4px' }"
        />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow size="sm" :style="{ margin: '0 1px 0 4px' }" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow size="sm" :style="{ margin: '0 1px 0 4px' }" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow size="sm" :style="{ margin: '0 1px 0 4px' }" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
        <IconArrow size="sm" :style="{ margin: '0 1px 0 4px' }" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    SvgIcon,
    IconPanel,
    IconArrow
  } from '../icons/index';
</script>
