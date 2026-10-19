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
    <IconPanel size="sm">
      <IconSkeleton size="sm" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
      <IconSkeleton size="sm" :style="{ marginTop: '4px' }" />
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import { IconInput, IconSkeleton, SvgIcon, IconPanel } from '../icons/index';
</script>
