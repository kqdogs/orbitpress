<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <SvgIcon name="ArrowUp" size="sm" :style="{ margin: '0 0 0 auto' }" />
    </IconInput>
    <IconPanel size="sm">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <IconArrow
          size="sm"
          direction="down"
          color="primary"
          :style="{ marginRight: '1px', transform: 'translate(-2px, 1px)' }"
        />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          marginTop: '4px',
          paddingLeft: '8px'
        }"
      >
        <IconArrow size="sm" :style="{ marginRight: '1px' }" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconArrow size="sm" :style="{ marginRight: '1px' }" />
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
