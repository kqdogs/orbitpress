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
    <IconPanel size="sm">
      <div
        :style="{ display: 'flex', alignItems: 'center', marginTop: '-2px' }"
      >
        <IconCheckbox size="sm" :checked="true" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '2px' }">
        <IconCheckbox size="sm" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          marginTop: '2px',
          marginBottom: '-2px'
        }"
      >
        <IconCheckbox size="sm" />
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
    IconCheckbox
  } from '../icons/index';
</script>
