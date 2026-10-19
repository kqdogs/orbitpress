<template>
  <div>
    <IconInput size="sm">
      <IconRangeSkeleton size="sm" />
      <SvgIcon
        name="ClockCircleOutlined"
        size="sm"
        :style="{ margin: '0 0 0 8px' }"
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
    IconRangeSkeleton,
    SvgIcon,
    IconPanel,
    IconCalendar
  } from '../icons/index';
</script>
