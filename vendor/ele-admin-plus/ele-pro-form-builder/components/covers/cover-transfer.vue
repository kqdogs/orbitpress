<template>
  <div :style="{ display: 'flex', alignItems: 'center' }">
    <IconPanel size="sm" :style="{ flex: 1, marginTop: 0 }">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <IconCheckbox size="xs" :checked="true" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
    </IconPanel>
    <div :style="{ margin: '0 6px' }">
      <IconArrow :style="{ marginRight: '-4px' }" />
      <IconArrow
        direction="left"
        :style="{ marginLeft: '-4px', marginTop: '6px' }"
      />
    </div>
    <IconPanel size="sm" :style="{ flex: 1, marginTop: 0 }">
      <div :style="{ display: 'flex', alignItems: 'center' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', marginTop: '4px' }">
        <IconCheckbox size="xs" />
        <IconSkeleton size="sm" :style="{ flex: 1 }" />
      </div>
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconSkeleton,
    IconPanel,
    IconArrow,
    IconCheckbox
  } from '../icons/index';
</script>
