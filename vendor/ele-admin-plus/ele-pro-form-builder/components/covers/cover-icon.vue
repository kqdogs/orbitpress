<template>
  <div
    :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }"
  >
    <SvgIcon name="CheckCircleFilled" :style="{ fontSize: '20px' }" />
    <SvgIcon
      name="StarFilled"
      color="primary5"
      :style="{ fontSize: '23px', margin: '-2px 0 0 8px' }"
    />
    <SvgIcon
      name="StepForwardFilled"
      color="light"
      :style="{ fontSize: '23px', marginLeft: '8px' }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon } from '../icons/index';
</script>
