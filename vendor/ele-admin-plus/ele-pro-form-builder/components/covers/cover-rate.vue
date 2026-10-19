<template>
  <div
    :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }"
  >
    <SvgIcon
      name="StarFilled"
      :style="{ color: '#f7ba2a', fontSize: '20px' }"
    />
    <SvgIcon
      name="StarFilled"
      :style="{ color: '#f7ba2a', fontSize: '20px', marginLeft: '4px' }"
    />
    <SvgIcon
      name="StarFilled"
      :style="{ color: '#f7ba2a', fontSize: '20px', marginLeft: '4px' }"
    />
    <SvgIcon
      name="StarFilled"
      color="lighter"
      :style="{ fontSize: '20px', marginLeft: '4px' }"
    />
  </div>
</template>

<script lang="ts" setup>
  import { SvgIcon } from '../icons/index';
</script>
