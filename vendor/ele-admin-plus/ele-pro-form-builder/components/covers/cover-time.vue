<template>
  <div>
    <IconInput size="sm">
      <IconSkeleton size="sm" :style="{ width: '50%' }" />
      <SvgIcon
        name="ClockCircleOutlined"
        size="sm"
        :style="{ margin: '0 0 0 auto' }"
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
  </div>
</template>

<script lang="ts" setup>
  import { IconInput, IconSkeleton, SvgIcon, IconPanel } from '../icons/index';
</script>
