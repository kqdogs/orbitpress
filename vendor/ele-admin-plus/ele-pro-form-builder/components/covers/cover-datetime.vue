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
    <IconPanel :style="{ padding: '1px 0' }">
      <IconCalendar size="sm" />
    </IconPanel>
  </div>
</template>

<script lang="ts" setup>
  import {
    IconInput,
    IconSkeleton,
    SvgIcon,
    IconPanel,
    IconCalendar
  } from '../icons/index';
</script>
